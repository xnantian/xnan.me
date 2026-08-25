import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const [html, css, script, manifest] = await Promise.all([
  readFile(join(root, "index.html"), "utf8"),
  readFile(join(root, "styles.css"), "utf8"),
  readFile(join(root, "script.js"), "utf8"),
  readFile(join(root, "site.webmanifest"), "utf8"),
]);

test("includes required metadata and one primary heading", () => {
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /<meta\s+name="description"/);
  assert.match(html, /<link\s+rel="canonical"\s+href="https:\/\/xnan\.me\/"/);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
});

test("uses semantic landmarks and valid in-page destinations", () => {
  assert.match(html, /<header\b/);
  assert.match(html, /<nav\b/);
  assert.match(html, /<main\b[^>]*id="main-content"/);
  assert.match(html, /<footer\b/);

  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  const localTargets = [...html.matchAll(/href="#([^"]+)"/g)].map(
    (match) => match[1],
  );

  localTargets.forEach((target) => {
    assert.ok(ids.has(target), `Missing in-page target: #${target}`);
  });
});

test("has no duplicate ids, placeholder copy, or unsafe blank targets", () => {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  assert.doesNotMatch(html, /TODO|lorem ipsum|在这里填写/i);

  const blankLinks = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].map(
    (match) => match[0],
  );
  blankLinks.forEach((link) => assert.match(link, /rel="[^"]*noreferrer[^"]*"/));
});

test("supports responsive and reduced-motion presentation", () => {
  assert.match(css, /@media\s*\(max-width:\s*560px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /min-width:\s*320px/);
  assert.match(script, /IntersectionObserver/);
  assert.match(script, /prefers-reduced-motion/);
});

test("web manifest is valid and points at the site identity", () => {
  const parsed = JSON.parse(manifest);
  assert.equal(parsed.name, "XNAN");
  assert.equal(parsed.start_url, "/");
  assert.ok(Array.isArray(parsed.icons) && parsed.icons.length > 0);
});
