import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const html = readFileSync("dist/index.html", "utf8");
const cssFiles = [];

function visit(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = directory + "/" + entry.name;
    if (entry.isDirectory()) visit(fullPath);
    else if (entry.isFile() && entry.name.endsWith(".css")) cssFiles.push(fullPath);
  }
}

visit("dist");
assert.ok(cssFiles.length > 0, "Production build must emit a CSS file under dist/.");
assert.match(html, /href="[^"]+\.css/, "The built HTML must reference its stylesheet.");

const css = cssFiles.map((path) => readFileSync(path, "utf8")).join("\n");
assert.match(css, /gradient-to-br|gradient-to-b|bg-forest/, "Tailwind utility styles must be included in the CSS output.");
assert.match(css, /card-bh/, "BlumHelps component styles must be included in the CSS output.");
assert.match(css, /prefers-reduced-motion/, "Reduced-motion rules must be included in the CSS output.");

console.log("PASS: a generated CSS artifact is linked from the built HTML.");
console.log("PASS: Tailwind utilities, BlumHelps components and reduced-motion styles are present.");
