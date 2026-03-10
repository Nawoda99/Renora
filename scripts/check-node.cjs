#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function fail(message) {
  console.error(message);
  process.exit(1);
}

const requiredMajor = 20;
const version = process.versions && process.versions.node ? process.versions.node : "0.0.0";
const major = Number(String(version).split(".")[0] || 0);

function readNvmrc() {
  try {
    const repoRoot = path.resolve(__dirname, "..");
    const nvmrcPath = path.join(repoRoot, ".nvmrc");
    if (!fs.existsSync(nvmrcPath)) return "";
    return String(fs.readFileSync(nvmrcPath, "utf8")).trim();
  } catch (_err) {
    return "";
  }
}

const nvmrc = readNvmrc();
const nvmHint = nvmrc
  ? "- If you use nvm: `nvm install && nvm use` (uses .nvmrc)"
  : "- If you use nvm: `nvm install 20 && nvm use 20`";

if (!Number.isFinite(major) || major < requiredMajor) {
  fail(
    [
      `Error: Node.js ${requiredMajor}+ is required to run this project.`,
      `Detected Node.js ${version}.`,
      "",
      "Fix:",
      nvmHint,
      "- Or install Node 20+ from https://nodejs.org/",
    ].join("\n")
  );
}
