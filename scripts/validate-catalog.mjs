import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const path = new URL("../app/src/main/assets/catalog/colombia_v1.json", import.meta.url);
const catalog = JSON.parse(readFileSync(path, "utf8"));
const errors = [];
const fail = (message) => errors.push(message);
const isDate = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value + "T00:00:00Z"));
const isNullableDate = (value) => value === null || isDate(value);
const isHttpsUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
};

if (catalog.catalogVersion !== "1.1") fail("catalogVersion must be 1.1.");
if (catalog.countryCode !== "COL") fail("countryCode must be COL.");
if (!isDate(catalog.updatedAt)) fail("updatedAt must be a real YYYY-MM-DD date.");
if (!Array.isArray(catalog.items)) fail("items must be an array.");

const ids = new Set();
for (const [index, item] of (Array.isArray(catalog.items) ? catalog.items : []).entries()) {
  const at = \`items[\${index}]\`;
  for (const field of ["id", "title", "agency", "jurisdiction", "audienceSummary", "eligibilitySummary", "costSummary", "notes"]) {
    if (typeof item[field] !== "string" || !item[field].trim()) fail(\`\${at}.\${field} must be a non-empty string.\`);
  }
  if (typeof item.id === "string") {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id)) fail(\`\${at}.id must be a stable lowercase kebab-case identifier.\`);
    if (ids.has(item.id)) fail(\`Duplicate resource id: \${item.id}\`);
    ids.add(item.id);
  }
  if (item.countryCode !== "COL") fail(\`\${at}.countryCode must be COL.\`);
  if (!Array.isArray(item.categories) || item.categories.length === 0 || item.categories.some((v) => typeof v !== "string" || !v.trim())) fail(\`\${at}.categories must contain non-empty strings.\`);
  for (const field of ["applicationUrl", "sourceUrl"]) {
    if (!isHttpsUrl(item[field])) fail(\`\${at}.\${field} must be a valid HTTPS URL without embedded credentials.\`);
  }
  for (const field of ["sourcePublishedAt", "sourceUpdatedAt", "verifiedAt", "applicationOpensAt", "applicationClosesAt"]) {
    if (!isNullableDate(item[field])) fail(\`\${at}.\${field} must be null or a real YYYY-MM-DD date.\`);
  }
  if (!["VERIFIED_ACTIVE", "PENDING_RECHECK", "HISTORICAL"].includes(item.status)) fail(\`\${at}.status is not supported.\`);
  if (item.status === "VERIFIED_ACTIVE" && (!isDate(item.verifiedAt) || !isDate(item.sourceUpdatedAt))) fail(\`\${at}: VERIFIED_ACTIVE requires explicit verification and source-update dates.\`);
  if (item.applicationOpensAt && item.applicationClosesAt && item.applicationClosesAt < item.applicationOpensAt) fail(\`\${at}: applicationClosesAt cannot precede applicationOpensAt.\`);
  if (item.status === "HISTORICAL" && !/hist[oó]ric|cerrad|vencid/i.test(item.notes)) fail(\`\${at}: HISTORICAL entries must explain that the opportunity is historical/closed/expired.\`);
}

if (errors.length) {
  console.error("Catalog validation FAILED:");
  for (const error of errors) console.error(" - " + error);
  process.exitCode = 1;
} else {
  console.log(\`Catalog validation PASS: \${catalog.items.length} item(s); unique IDs, safe URLs, dates and verification-state invariants checked.\`);
}
