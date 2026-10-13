# BlumHelps Web — dependency security notes

Review date: 2026-10-13. Branch: `feat/futuristic-wellbeing-habits`. Runtime routing dependency: `react-router-dom@7.18.4`.

## Gates

- The pull request and Pages validation workflows run `npm ci`, `npm audit --omit=dev --audit-level=moderate`, the structural/product validator and the TypeScript/Vite production build. The moderate-or-higher runtime threshold is deliberate; known advisories in shipped dependencies should fail the release gate, not just high/critical ones.
- The complete development dependency tree is also audited and printed in CI, so development-tool findings remain visible rather than being silently ignored.
- Tailwind CSS 3 is retained for UI compatibility. Do not run `npm audit fix --force` on this branch without a separate, reviewed Tailwind major-version migration.

## Known upstream advisory to re-check

The complete dependency-tree audit currently identifies two upstream issues in development tooling:
- **High — `braces@3.0.3` (GHSA-vfj7-8cjw-p6xm):** no patched braces release is listed. Its cascade appears as five affected package entries (`braces`, `chokidar`, `fast-glob`, `micromatch` and `tailwindcss`); they are not five separate CVEs.
- **Moderate — `postcss-selector-parser@6.1.4` (GHSA-rj75-hqrm-r3gf):** the fix is in `postcss-selector-parser@7.1.6` or newer; the current Tailwind CSS 3 dependency range resolves to major version 6, so it is a separate toolchain compatibility decision rather than a safe in-range lockfile update. The audit can also count `postcss-nested` as affected through this dependency.

Both paths are development/build-tool dependencies; `npm audit --omit=dev --audit-level=moderate` is the release gate for shipped runtime dependencies. The full-tree report remains visible, and this document does not claim that the development dependency tree is vulnerability-free.

- Advisory: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm
- Mitigation: don't expose the development server to untrusted networks or feed untrusted glob patterns into build tooling; continue tracking upstream.
- Re-check after every lockfile refresh and remove this note when the advisory is resolved or the dependency path is removed.

This note is a scoped risk statement, not a claim that the advisory is fixed.
