import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.join(__dirname, "..");

const inputSvg = path.join(repoRoot, "public", "cioslogo.svg");
const outputPng = path.join(repoRoot, "public", "cioslogo.png");

if (!fs.existsSync(inputSvg)) {
  console.error(`Input SVG not found: ${inputSvg}`);
  process.exit(1);
}

const svg = fs.readFileSync(inputSvg, "utf8");

// Render to a crisp square PNG for email clients.
const resvg = new Resvg(svg, {
  fitTo: {
    mode: "width",
    value: 512,
  },
});

const pngData = resvg.render().asPng();
fs.writeFileSync(outputPng, pngData);

console.log(`Wrote: ${path.relative(repoRoot, outputPng)}`);
