import { copyFileSync, existsSync, writeFileSync } from "node:fs";

const src = "dist/index.html";
const dest = "dist/404.html";
const nojekyll = "dist/.nojekyll";

if (!existsSync(src)) {
  console.error("ERROR: No existe dist/index.html. Ejecuta npm run build primero.");
  process.exit(1);
}

copyFileSync(src, dest);
writeFileSync(nojekyll, "");

console.log("OK dist/404.html generado para fallback SPA.");
console.log("OK dist/.nojekyll generado.");
