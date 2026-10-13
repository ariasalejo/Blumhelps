# BlumHelps Web — dependency security notes

Review date: 2026-10-13. Branch: `feat/futuristic-wellbeing-habits`. Runtime routing dependency: `react-router-dom@7.18.4`.

## Gates

- The pull request and Pages validation workflows run `npm ci`, `npm audit --omit=dev --audit-level=moderate`, the structural/product validator and the TypeScript/Vite production build. The moderate-or-higher runtime threshold is deliberate; known advisories in shipped dependencies should fail the release gate, not just high/critical ones.
- The complete development dependency tree is also audited and printed in CI, so development-tool findings remain visible rather than being silently ignored.
- Tailwind CSS 3 is retained for UI compatibility. Do not run `npm audit fix --force` on this branch without a separate, reviewed Tailwind major-version migration.

## Known upstream advisory to re-check

The upstream GitHub Advisory Database reports GHSA-vfj7-8cjw-p6xm for `braces <= 3.0.3` as high severity and, as of this review, lists no patched version. In the current dependency graph, the reported path is through development tooling (Tailwind/chokidar/micromatch); `npm audit --omit=dev` is the separate release gate for runtime dependencies. The complete-tree report can show five affected package entries (`braces`, `chokidar`, `fast-glob`, `micromatch` and `tailwindcss`) cascading from this same upstream braces advisory; they are not five separate CVEs. No patched braces release was listed when checked. This does not mean the whole development dependency tree is vulnerability-free.

- Advisory: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm
- Mitigation: don't expose the development server to untrusted networks or feed untrusted glob patterns into build tooling; continue tracking upstream.
- Re-check after every lockfile refresh and remove this note when the advisory is resolved or the dependency path is removed.

This note is a scoped risk statement, not a claim that the advisory is fixed.
