import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "dist");
const publicFiles = [
  "index.html",
  "styles.css",
  "script.js",
  "favicon.svg",
  "site.webmanifest",
  "robots.txt",
  "sitemap.xml",
  "CNAME",
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

await Promise.all(
  publicFiles.map((file) => cp(join(root, file), join(output, file))),
);

console.log(`Built ${publicFiles.length} static files in dist/`);
