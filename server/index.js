import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import os from "node:os";
import dotenv from "dotenv";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import multer from "multer";
import { nanoid } from "nanoid";
import archiver from "archiver";
import unzipper from "unzipper";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env"), override: true });

const PORT = Number(process.env.PORT || 5174);
const ADMIN_KEY = process.env.ADMIN_KEY || "";
const projectRoot = path.resolve(__dirname, "..");
const configuredUploadsDir = (process.env.UPLOADS_DIR || "").trim();
const uploadsDir = configuredUploadsDir
  ? path.isAbsolute(configuredUploadsDir)
    ? configuredUploadsDir
    : path.resolve(projectRoot, configuredUploadsDir)
  : path.join(__dirname, "uploads");

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "";
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL || "";
const FIREBASE_PRIVATE_KEY = (process.env.FIREBASE_PRIVATE_KEY || "").replace(
  /\\n/g,
  "\n",
);

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_SECURE =
  String(process.env.SMTP_SECURE || "true").toLowerCase() !== "false";
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER || "";
const QUOTE_TO = process.env.QUOTE_TO || process.env.QUOTE_TO_EMAIL || "";
const EMAIL_LOGO_URL = (process.env.EMAIL_LOGO_URL || "").trim();
const EMAIL_LOGO_PATH = (process.env.EMAIL_LOGO_PATH || "").trim();

const QUOTE_EMAIL_TEMPLATE_VERSION = "2026-03-08-v2";
const THEME_PRESET_VERSION = "2026-04-cleaning-green";

const app = express();
app.use(express.json({ limit: "1mb" }));

let db = null;
let mailTransporter = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDateTimeWithTz(date) {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    }).formatToParts(date);

    const get = (type) => parts.find((p) => p.type === type)?.value || "";
    const day = get("day");
    const month = get("month");
    const year = get("year");
    const hour = get("hour");
    const minute = get("minute");
    const dayPeriod = get("dayPeriod");
    const timeZoneName = get("timeZoneName");

    const tz = timeZoneName ? ` (${timeZoneName})` : "";
    return `${day}/${month}/${year} ${hour}:${minute} ${dayPeriod}${tz}`.trim();
  } catch {
    return new Date(date).toISOString();
  }
}

function getMailTransporter() {
  if (mailTransporter) return mailTransporter;
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error("Email is not configured (set SMTP_USER and SMTP_PASS)");
  }

  mailTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return mailTransporter;
}

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use(
  "/media",
  express.static(uploadsDir, {
    fallthrough: false,
    maxAge: "7d",
  }),
);

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const original = file.originalname || "upload";
      const ext = path.extname(original).toLowerCase();
      const safeExt = /^[a-z0-9.]+$/i.test(ext) ? ext : "";
      cb(null, `${Date.now()}_${nanoid(10)}${safeExt}`);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const ok =
      typeof file.mimetype === "string" && file.mimetype.startsWith("image/");
    cb(ok ? null : new Error("Only image uploads are allowed"), ok);
  },
});

const restoreUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, os.tmpdir()),
    filename: (_req, file, cb) => {
      const safeBase = `renora_restore_${Date.now()}_${nanoid(8)}`;
      const ext = path.extname(file.originalname || "").toLowerCase();
      const safeExt = ext === ".zip" ? ".zip" : ".zip";
      cb(null, `${safeBase}${safeExt}`);
    },
  }),
  limits: {
    fileSize: 250 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const name = (file.originalname || "").toLowerCase();
    const ok = name.endsWith(".zip") || file.mimetype === "application/zip";
    cb(ok ? null : new Error("Only .zip files are allowed"), ok);
  },
});

function isSafeZipEntryPath(entryPath) {
  if (!entryPath || typeof entryPath !== "string") return false;
  const normalized = path.posix.normalize(entryPath);
  if (normalized.startsWith("../") || normalized === "..") return false;
  if (normalized.startsWith("/")) return false;
  // Disallow Windows drive letters / backslashes
  if (/^[a-zA-Z]:/.test(normalized)) return false;
  if (normalized.includes("\\")) return false;
  return true;
}

async function validateRestoreZip(zipFilePath) {
  const dbDumpRelPath = "DB/content.json";
  let hasDump = false;
  let dumpBytes = 0;
  let uploadFiles = 0;
  let ignoredEntries = 0;
  let unsafeEntries = 0;
  let invalidUploadNames = 0;

  await new Promise((resolve, reject) => {
    const pendingReads = [];
    const stream = fs
      .createReadStream(zipFilePath)
      .on("error", reject)
      .pipe(unzipper.Parse());

    stream.on("entry", (entry) => {
      const entryPath = entry.path;
      const entryType = entry.type;

      if (!isSafeZipEntryPath(entryPath)) {
        unsafeEntries += 1;
        entry.autodrain();
        return;
      }

      const normalized = path.posix.normalize(entryPath);
      if (entryType === "Directory") {
        entry.autodrain();
        return;
      }

      if (normalized === dbDumpRelPath) {
        hasDump = true;
        // Some ZIPs don't expose reliable size metadata here; stream and count bytes.
        pendingReads.push(
          new Promise((res, rej) => {
            entry.on("data", (chunk) => {
              dumpBytes += chunk.length;
            });
            entry.on("end", res);
            entry.on("error", rej);
          }),
        );
        return;
      }

      if (normalized.startsWith("Uploads/")) {
        const name = normalized.slice("Uploads/".length);
        if (!sanitizeMediaName(name)) {
          invalidUploadNames += 1;
          entry.autodrain();
          return;
        }
        uploadFiles += 1;
        entry.autodrain();
        return;
      }

      ignoredEntries += 1;
      entry.autodrain();
    });

    stream.on("close", () => {
      Promise.all(pendingReads).then(resolve).catch(reject);
    });
    stream.on("error", reject);
  });

  if (!hasDump) {
    return {
      ok: false,
      error: "Invalid backup ZIP: missing DB/content.json",
      hasDump,
      dumpBytes,
      uploadFiles,
      unsafeEntries,
      invalidUploadNames,
      ignoredEntries,
    };
  }

  return {
    ok: true,
    hasDump,
    dumpBytes,
    uploadFiles,
    unsafeEntries,
    invalidUploadNames,
    ignoredEntries,
  };
}

async function extractRestoreZip(zipFilePath, extractDir) {
  const dbDumpRelPath = "DB/content.json";
  const dbDumpAbsPath = path.join(extractDir, "DB", "content.json");
  const extractedUploads = [];
  const writePromises = [];

  await new Promise((resolve, reject) => {
    const stream = fs
      .createReadStream(zipFilePath)
      .on("error", reject)
      .pipe(unzipper.Parse());

    stream.on("entry", (entry) => {
      const entryPath = entry.path;
      const entryType = entry.type;

      if (!isSafeZipEntryPath(entryPath)) {
        entry.autodrain();
        return;
      }

      const normalized = path.posix.normalize(entryPath);
      if (
        normalized === dbDumpRelPath ||
        normalized.startsWith("Uploads/") ||
        normalized === "Uploads"
      ) {
        if (entryType === "Directory") {
          entry.autodrain();
          return;
        }

        const destAbs = path.join(extractDir, ...normalized.split("/"));
        if (!destAbs.startsWith(extractDir + path.sep)) {
          entry.autodrain();
          return;
        }

        fs.mkdirSync(path.dirname(destAbs), { recursive: true });
        const out = fs.createWriteStream(destAbs);
        entry.pipe(out);

        writePromises.push(
          new Promise((res) => {
            out.on("finish", () => {
              if (normalized.startsWith("Uploads/")) {
                extractedUploads.push({
                  rel: normalized,
                  abs: destAbs,
                });
              }
              res(undefined);
            });
          }),
        );

        out.on("error", (err) => {
          entry.autodrain();
          reject(err);
        });
        return;
      }

      // Ignore any other entries
      entry.autodrain();
    });

    stream.on("close", resolve);
    stream.on("error", reject);
  });

  await Promise.all(writePromises);

  if (!fs.existsSync(dbDumpAbsPath)) {
    throw new Error("Invalid backup ZIP: missing DB/content.json");
  }

  return { dbDumpAbsPath, extractedUploads };
}

function sanitizeMediaName(value) {
  if (!value || typeof value !== "string") return null;
  const name = path.basename(value.trim());
  if (!name) return null;
  if (name === "." || name === "..") return null;
  if (name.includes("/") || name.includes("\\")) return null;
  // Keep this fairly strict to prevent odd filesystem edge cases.
  if (!/^[a-z0-9._-]+$/i.test(name)) return null;
  return name;
}

function mediaPathFromName(name) {
  return path.join(uploadsDir, name);
}

function readDefaultContent() {
  const defaultPath = path.join(__dirname, "defaultContent.json");
  const defaultJson = fs.readFileSync(defaultPath, "utf8");
  return JSON.parse(defaultJson);
}

function stripTrailingSlash(value) {
  return String(value || "").replace(/\/$/, "");
}

function getSiteUrl(req) {
  const explicit = stripTrailingSlash(process.env.SITE_URL);
  if (explicit) return explicit;

  const productionUrl = stripTrailingSlash(
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  );
  if (productionUrl) {
    return productionUrl.startsWith("http")
      ? productionUrl
      : `https://${productionUrl}`;
  }

  const deploymentUrl = stripTrailingSlash(process.env.VERCEL_URL);
  if (deploymentUrl) {
    return deploymentUrl.startsWith("http")
      ? deploymentUrl
      : `https://${deploymentUrl}`;
  }

  if (req) {
    const forwardedProto = req.header("x-forwarded-proto");
    const proto = forwardedProto || req.protocol || "https";
    const host = req.header("x-forwarded-host") || req.header("host");
    if (host) return `${proto}://${host}`;
  }

  return "";
}

function migrateThemePreset(content) {
  if (!content || typeof content !== "object") return content;

  const defaults = readDefaultContent();
  const defaultTheme = defaults?.settings?.theme;
  if (!defaultTheme || typeof defaultTheme !== "object") return content;

  const currentTheme = content.settings?.theme;
  if (
    currentTheme &&
    typeof currentTheme === "object" &&
    currentTheme.presetVersion === THEME_PRESET_VERSION
  ) {
    return content;
  }

  return {
    ...content,
    settings: {
      ...(content.settings ?? {}),
      theme: {
        ...defaultTheme,
        presetVersion: THEME_PRESET_VERSION,
      },
    },
  };
}

async function initDbAsync() {
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error(
      "Firebase configuration missing. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your .env file.",
    );
  }

  initializeApp({
    credential: cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY,
    }),
  });

  db = getFirestore();

  // Seed default content if the document doesn't exist yet
  const docRef = db.collection("cms").doc("content");
  const snap = await docRef.get();
  if (!snap.exists) {
    const defaultContent = readDefaultContent();
    await docRef.set({
      json: JSON.stringify(defaultContent),
      updatedAt: new Date().toISOString(),
    });
    return;
  }

  const data = snap.data();
  if (!data || typeof data.json !== "string") return;

  try {
    const existing = JSON.parse(data.json);
    const migrated = migrateThemePreset(existing);
    if (JSON.stringify(existing) !== JSON.stringify(migrated)) {
      await docRef.set({
        json: JSON.stringify(migrated),
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error("Failed to migrate saved theme preset during startup.");
    console.error(err);
  }
}

function requireAdmin(req, res, next) {
  if (!ADMIN_KEY) {
    return res.status(500).json({
      error: "Server misconfigured: ADMIN_KEY not set",
      hint: "Create a .env file (see .env.example) and set ADMIN_KEY.",
    });
  }

  const key = req.header("x-admin-key") || "";
  if (key !== ADMIN_KEY) return res.status(401).json({ error: "Unauthorized" });
  next();
}

async function getContent() {
  const snap = await db.collection("cms").doc("content").get();
  if (!snap.exists) return null;
  const data = snap.data();
  if (!data || typeof data.json !== "string") return null;
  try {
    const parsed = JSON.parse(data.json);
    const migrated = migrateThemePreset(parsed);
    if (JSON.stringify(parsed) !== JSON.stringify(migrated)) {
      await setContent(migrated);
    }
    return migrated;
  } catch (err) {
    console.error("Failed to parse CMS content JSON; repairing from default.");
    console.error(err);
    try {
      const repaired = readDefaultContent();
      await setContent(repaired);
      return repaired;
    } catch (repairErr) {
      console.error("Failed to repair CMS content JSON.");
      console.error(repairErr);
      return null;
    }
  }
}

async function setContent(content) {
  await db
    .collection("cms")
    .doc("content")
    .set({
      json: JSON.stringify(content),
      updatedAt: new Date().toISOString(),
    });
}

function replaceStringsDeep(value, replacer) {
  if (typeof value === "string") return replacer(value);
  if (Array.isArray(value))
    return value.map((v) => replaceStringsDeep(v, replacer));
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = replaceStringsDeep(v, replacer);
    }
    return out;
  }
  return value;
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/admin/verify", requireAdmin, (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/content", async (_req, res) => {
  const content = await getContent();
  res.json(content);
});

app.post("/api/quote", async (req, res) => {
  try {
    if (!QUOTE_TO) {
      return res
        .status(500)
        .json({ error: "Email is not configured (set QUOTE_TO)" });
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (
      name.length > 200 ||
      email.length > 320 ||
      phone.length > 50 ||
      message.length > 5000
    ) {
      return res.status(400).json({ error: "One or more fields are too long" });
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
      req.ip;
    const userAgent = (req.headers["user-agent"] || "").toString();
    const nowDate = new Date();
    const nowIso = nowDate.toISOString();
    const nowDisplay = formatDateTimeWithTz(nowDate);

    const brandGold = "#D4AF37";
    const brandBrown = "#3E2723";
    const brandCream = "#FFF8E7";

    const siteUrl = getSiteUrl(req);
    const fallbackLogoUrl = siteUrl ? `${siteUrl}/renoralogo.svg` : "";
    const logoUrl = (EMAIL_LOGO_URL || fallbackLogoUrl).trim();

    const attachments = [];
    let logoBlock = "";
    let logoMode = "text";

    const defaultPngAbs = path.join(
      __dirname,
      "..",
      "public",
      "renoralogo.png",
    );
    const hasDefaultPng = fs.existsSync(defaultPngAbs);

    const envCandidate = EMAIL_LOGO_PATH
      ? path.isAbsolute(EMAIL_LOGO_PATH)
        ? EMAIL_LOGO_PATH
        : path.join(__dirname, "..", EMAIL_LOGO_PATH)
      : "";

    let candidate = "";
    if (envCandidate) {
      if (fs.existsSync(envCandidate)) {
        candidate = envCandidate;
      } else {
        console.warn(
          `EMAIL_LOGO_PATH was set but file was not found: ${envCandidate}`,
        );
        if (hasDefaultPng) candidate = defaultPngAbs;
      }
    } else if (hasDefaultPng) {
      candidate = defaultPngAbs;
    }

    if (candidate && fs.existsSync(candidate)) {
      const ext = path.extname(candidate).toLowerCase();
      const contentType =
        ext === ".png"
          ? "image/png"
          : ext === ".jpg" || ext === ".jpeg"
            ? "image/jpeg"
            : ext === ".webp"
              ? "image/webp"
              : undefined;

      attachments.push({
        filename: path.basename(candidate),
        path: candidate,
        cid: "renora-logo",
        contentDisposition: "inline",
        contentType,
      });
      logoBlock = `<img src="cid:renora-logo" width="120" height="120" alt="Renora" style="display:block; width:120px; height:auto;" />`;
      logoMode = "cid";
    }

    if (!logoBlock) {
      const safeLogoUrl = /^(https?:)?\/\//.test(logoUrl) ? logoUrl : "";
      logoBlock = safeLogoUrl
        ? `<img src="${escapeHtml(safeLogoUrl)}" width="120" height="120" alt="Renora" style="display:block; width:120px; height:auto;" />`
        : `<div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:${brandBrown}; font-size:20px; font-weight:800;">Renora</div>`;
      logoMode = safeLogoUrl ? "url" : "text";
    }

    // Include a timestamp to reduce aggressive email threading in Gmail.
    const subject = `New Quote Request - ${name} (${nowDisplay})`;
    const text = [
      "New quote request received.",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      "",
      "Message:",
      message,
      "",
      `Time: ${nowDisplay}`,
      `IP: ${ip}`,
      `User-Agent: ${userAgent}`,
    ].join("\n");

    const html = `
      <!doctype html>
      <html lang="en">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>New Quote Request</title>
        </head>
        <body style="margin:0; padding:0; background:${brandCream};">
          <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
            New quote request from ${escapeHtml(name)}.
          </div>

          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse; background:${brandCream};">
            <tr>
              <td align="center" style="padding:32px 16px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="width:100%; max-width:600px; border-collapse:collapse;">
                  <tr>
                    <td style="padding:0 0 12px 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                        <tr>
                          <td align="left" style="vertical-align:middle;">
                            ${logoBlock}
                          </td>
                          <td align="right" style="vertical-align:middle; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:${brandBrown};">
                            <div style="font-size:12px; opacity:0.9;">New Quote Request</div>
                            <div style="font-size:12px; opacity:0.7;">${escapeHtml(nowDisplay)}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid rgba(62,39,35,0.12);">
                      <div style="height:6px; background:${brandGold};"></div>
                      <div style="padding:22px 22px 10px 22px; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:${brandBrown};">
                        <h1 style="margin:0 0 8px 0; font-size:22px; line-height:1.3;">You’ve received a new quote request</h1>
                        <p style="margin:0 0 14px 0; font-size:14px; opacity:0.85;">Reply directly to this email to respond to the customer (Reply-To is set to the customer’s email).</p>

                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse; font-size:14px;">
                          <tr>
                            <td style="padding:10px 0; border-top:1px solid rgba(62,39,35,0.10); width:140px; color:${brandBrown}; opacity:0.75;">Name</td>
                            <td style="padding:10px 0; border-top:1px solid rgba(62,39,35,0.10); color:${brandBrown}; font-weight:700;">${escapeHtml(name)}</td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0; border-top:1px solid rgba(62,39,35,0.10); width:140px; color:${brandBrown}; opacity:0.75;">Email</td>
                            <td style="padding:10px 0; border-top:1px solid rgba(62,39,35,0.10); color:${brandBrown}; font-weight:700;">${escapeHtml(email)}</td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0; border-top:1px solid rgba(62,39,35,0.10); width:140px; color:${brandBrown}; opacity:0.75;">Phone</td>
                            <td style="padding:10px 0; border-top:1px solid rgba(62,39,35,0.10); color:${brandBrown}; font-weight:700;">${escapeHtml(phone)}</td>
                          </tr>
                        </table>

                        <div style="margin-top:14px; padding:14px; border-radius:12px; background:rgba(212,175,55,0.10); border:1px solid rgba(212,175,55,0.35);">
                          <div style="font-size:12px; font-weight:800; letter-spacing:0.06em; text-transform:uppercase; color:${brandBrown}; opacity:0.85; margin-bottom:8px;">Customer Message</div>
                          <div style="white-space:pre-wrap; font-size:14px; color:${brandBrown};">${escapeHtml(message)}</div>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td align="center" style="padding:14px 8px 0 8px; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:${brandBrown}; font-size:12px; opacity:0.75;">
                      Sent by Renora Quote System
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `.trim();

    const transporter = getMailTransporter();
    await transporter.sendMail({
      to: QUOTE_TO,
      from: SMTP_FROM ? `Renora <${SMTP_FROM}>` : SMTP_USER,
      replyTo: email,
      subject,
      text,
      html,
      attachments,
      headers: {
        "X-Renora-Quote-Template": QUOTE_EMAIL_TEMPLATE_VERSION,
        "X-Renora-Quote-Logo-Mode": logoMode,
      },
    });

    res.json({ ok: true, template: QUOTE_EMAIL_TEMPLATE_VERSION, logoMode });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Quote request failed";
    res.status(500).json({ error: message });
  }
});

app.get("/api/media", (_req, res) => {
  try {
    const entries = fs
      .readdirSync(uploadsDir, { withFileTypes: true })
      .filter((d) => d.isFile())
      .map((d) => {
        const name = d.name;
        const fullPath = path.join(uploadsDir, name);
        const stat = fs.statSync(fullPath);
        return {
          name,
          url: `/media/${encodeURIComponent(name)}`,
          size: stat.size,
          uploadedAt: stat.mtime.toISOString(),
        };
      })
      .sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1));

    res.json({ items: entries });
  } catch (err) {
    console.error("Failed to list media files", err);
    res.status(500).json({ error: "Failed to list media" });
  }
});

app.post("/api/media", requireAdmin, upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "Missing file" });
  const name = file.filename;
  res.json({
    name,
    url: `/media/${encodeURIComponent(name)}`,
    size: file.size,
  });
});

app.delete("/api/media/:name", requireAdmin, (req, res) => {
  const name = sanitizeMediaName(req.params.name);
  if (!name) return res.status(400).json({ error: "Invalid media name" });

  try {
    const fullPath = mediaPathFromName(name);
    if (!fs.existsSync(fullPath))
      return res.status(404).json({ error: "Not found" });
    fs.unlinkSync(fullPath);
    res.json({ ok: true });
  } catch (err) {
    console.error("Failed to delete media", err);
    res.status(500).json({ error: "Failed to delete media" });
  }
});

app.post("/api/media/rename", requireAdmin, async (req, res) => {
  const from = sanitizeMediaName(req.body?.from);
  let to = sanitizeMediaName(req.body?.to);
  if (!from || !to) return res.status(400).json({ error: "Invalid rename" });

  const fromExt = path.extname(from);
  const toExt = path.extname(to);
  if (!toExt && fromExt) {
    const withExt = `${to}${fromExt}`;
    to = sanitizeMediaName(withExt);
    if (!to) return res.status(400).json({ error: "Invalid rename" });
  }

  const fromUrl = `/media/${encodeURIComponent(from)}`;
  const toUrl = `/media/${encodeURIComponent(to)}`;

  if (from === to)
    return res.json({
      ok: true,
      from,
      to,
      fromUrl,
      toUrl,
      updatedReferences: 0,
    });

  try {
    const fromPath = mediaPathFromName(from);
    const toPath = mediaPathFromName(to);
    if (!fs.existsSync(fromPath))
      return res.status(404).json({ error: "Not found" });
    if (fs.existsSync(toPath))
      return res
        .status(409)
        .json({ error: "A file with that name already exists" });
    fs.renameSync(fromPath, toPath);

    let updatedReferences = 0;
    const content = await getContent();
    if (content && typeof content === "object") {
      const next = replaceStringsDeep(content, (s) => {
        if (s === fromUrl) {
          updatedReferences += 1;
          return toUrl;
        }
        return s;
      });

      if (updatedReferences > 0) {
        await setContent(next);
      }
    }

    res.json({ ok: true, from, to, fromUrl, toUrl, updatedReferences });
  } catch (err) {
    console.error("Failed to rename media", err);
    res.status(500).json({ error: "Failed to rename media" });
  }
});

app.put("/api/content", requireAdmin, async (req, res) => {
  const content = req.body;
  if (!content || typeof content !== "object") {
    return res.status(400).json({ error: "Invalid content" });
  }

  if (!Array.isArray(content.services)) {
    return res.status(400).json({ error: "content.services must be an array" });
  }
  if (!Array.isArray(content.banners)) {
    return res.status(400).json({ error: "content.banners must be an array" });
  }
  if (!Array.isArray(content.testimonials)) {
    return res
      .status(400)
      .json({ error: "content.testimonials must be an array" });
  }
  if (!content.settings || typeof content.settings !== "object") {
    return res
      .status(400)
      .json({ error: "content.settings must be an object" });
  }

  await setContent(content);
  res.json({ ok: true });
});

// Dynamic sitemap based on current content
app.get(["/sitemap.xml", "/sitemap"], async (req, res) => {
  const content = await getContent();
  const siteUrl = getSiteUrl(req) || "https://renora.com.au";

  const urls = [
    `${siteUrl}/`,
    `${siteUrl}/services`,
    ...(content?.services || []).map((s) => `${siteUrl}/services/${s.slug}`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((loc) => `  <url>\n    <loc>${loc}</loc>\n  </url>`)
    .join("\n")}\n</urlset>\n`;

  res.setHeader("Content-Type", "application/xml");
  res.send(xml);
});

app.post("/api/backup", requireAdmin, async (_req, res) => {
  // Creates a ZIP containing:
  // - DB/content.json (Firestore content export)
  // - Uploads/* (all uploaded media)

  const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), "renora-export-"));
  const dbOutDir = path.join(tmpBase, "DB");
  fs.mkdirSync(dbOutDir, { recursive: true });

  const cleanup = () => {
    try {
      fs.rmSync(tmpBase, { recursive: true, force: true });
    } catch {
      // ignore
    }
  };

  try {
    const content = await getContent();
    if (!content) throw new Error("No content found to back up");

    const contentFilePath = path.join(dbOutDir, "content.json");
    fs.writeFileSync(contentFilePath, JSON.stringify(content, null, 2), "utf8");

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="renora-backup.zip"`,
    );

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", (err) => {
      throw err;
    });

    archive.pipe(res);
    archive.file(contentFilePath, { name: "DB/content.json" });
    archive.directory(uploadsDir, "Uploads");
    await archive.finalize();

    res.on("close", cleanup);
    res.on("finish", cleanup);
  } catch (err) {
    cleanup();
    const message = err instanceof Error ? err.message : "Backup failed";
    res.status(500).json({ error: message });
  }
});

app.post(
  "/api/restore",
  requireAdmin,
  restoreUpload.single("file"),
  async (req, res) => {
    const zipPath = req.file?.path;
    if (!zipPath)
      return res
        .status(400)
        .json({ error: "Missing ZIP file (field name: file)" });

    const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), "renora-restore-"));
    const extractDir = path.join(tmpBase, "extract");
    fs.mkdirSync(extractDir, { recursive: true });

    const cleanup = () => {
      try {
        fs.rmSync(tmpBase, { recursive: true, force: true });
      } catch {
        // ignore
      }
      try {
        fs.rmSync(zipPath, { force: true });
      } catch {
        // ignore
      }
    };

    try {
      const { dbDumpAbsPath, extractedUploads } = await extractRestoreZip(
        zipPath,
        extractDir,
      );

      // 1) Restore content to Firestore
      const contentRaw = fs.readFileSync(dbDumpAbsPath, "utf8");
      const restoredContent = JSON.parse(contentRaw);
      await setContent(restoredContent);

      // 2) Restore uploads (replace directory)
      fs.rmSync(uploadsDir, { recursive: true, force: true });
      fs.mkdirSync(uploadsDir, { recursive: true });

      let restoredFiles = 0;
      for (const item of extractedUploads) {
        const rel = item.rel;
        const abs = item.abs;
        const name = rel.slice("Uploads/".length);
        const safeName = sanitizeMediaName(name);
        if (!safeName) continue;

        const dest = mediaPathFromName(safeName);
        fs.copyFileSync(abs, dest);

        const srcStat = fs.statSync(abs);
        const destStat = fs.statSync(dest);
        if (srcStat.size !== destStat.size) {
          throw new Error(`Upload restore validation failed for ${safeName}`);
        }
        restoredFiles += 1;
      }

      // 3) Validate content exists
      const content = await getContent();
      if (!content) {
        throw new Error(
          "Restore validation failed: content not found after import",
        );
      }

      res.json({ ok: true, restoredFiles });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Restore failed";
      res.status(500).json({ error: message });
    } finally {
      cleanup();
    }
  },
);

app.post(
  "/api/restore/validate",
  requireAdmin,
  restoreUpload.single("file"),
  async (req, res) => {
    const zipPath = req.file?.path;
    if (!zipPath)
      return res
        .status(400)
        .json({ error: "Missing ZIP file (field name: file)" });

    try {
      const result = await validateRestoreZip(zipPath);
      if (!result.ok) return res.status(400).json(result);
      res.json(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Validation failed";
      res.status(500).json({ error: message });
    } finally {
      try {
        fs.rmSync(zipPath, { force: true });
      } catch {
        // ignore
      }
    }
  },
);

// Serve built frontend when available (production)
const distDir = path.join(__dirname, "..", "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  // Express 5 + path-to-regexp no longer accepts "*"/"/*" as a route pattern.
  // Use a RegExp catch-all and explicitly exclude /api.
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

// Consistent JSON errors (helps the admin UI surface meaningful messages)
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  if (res.headersSent) return;
  res.status(500).json({ error: "Internal Server Error" });
});

async function main() {
  await initDbAsync();

  app.listen(PORT, "0.0.0.0", () => {
    const localIp = Object.values(os.networkInterfaces())
      .flat()
      .find(
        (iface) => iface && iface.family === "IPv4" && !iface.internal,
      )?.address;

    console.log(`CMS server running:`);
    console.log(`  Local:   http://localhost:${PORT}`);
    if (localIp) console.log(`  Network: http://${localIp}:${PORT}`);
    console.log(`Uploads directory: ${uploadsDir}`);
    console.log(`Firebase project: ${FIREBASE_PROJECT_ID}`);
    console.log(`Quote email template: ${QUOTE_EMAIL_TEMPLATE_VERSION}`);
  });
}

main().catch((err) => {
  console.error("Failed to start CMS server");
  console.error(err);
  process.exit(1);
});
