# BlumHelps Web — dependency security notes

Review date: 2026-10-13. Branch: `feat/futuristic-wellbeing-habits`. Runtime routing dependency: `react-router-dom@7.18.4`.

## Gates

- The pull request and Pages validation workflows run `npm ci`, `npm audit --omit=dev --audit-level=moderate`, the structural/product validator and the TypeScript/Vite production build. The moderate-or-higher runtime threshold is deliberate; known advisories in shipped dependencies should fail the release gate, not just high/critical ones.
- The complete development dependency tree is also audited and printed in CI, so development-tool findings remain visible rather than being silently ignored.
- Tailwind CSS 3 is retained for UI compatibility. Do not run `npm audit fix --force` on this branch without a separate, reviewed Tailwind major-version migration.

## Current dependency risk

- **Resolved in this branch — moderate selector parsing advisory GHSA-rj75-hqrm-r3gf:** `postcss-selector-parser` is pinned to `7.1.6` through the root npm override because Tailwind CSS 3's declared dependency range remains on the 6.x major. GitHub Actions regenerated the lockfile, installed dependencies with `npm ci`, passed the runtime audit, compiled TypeScript/Vite, and verified the emitted Tailwind CSS. The permanent build step checks that the generated stylesheet contains expected app/Tailwind styles and reduced-motion rules. See the upstream [7.1.6 release notes](https://github.com/postcss/postcss-selector-parser/releases/tag/7.1.6).
- **Still unresolved — high braces advisory GHSA-vfj7-8cjw-p6xm:** `braces@3.0.3` remains in the Tailwind 3 development toolchain. The upstream advisory currently lists no patched `braces` version. It cascades into five affected package entries (`braces`, `chokidar`, `fast-glob`, `micromatch` and `tailwindcss`), representing one advisory path rather than five independent CVEs. Keep the development server off untrusted networks and track the upstream advisory.

The release gate is `npm audit --omit=dev --audit-level=moderate` and blocks moderate-or-higher vulnerabilities in shipped runtime dependencies. The full development dependency audit remains visible in CI. This is a scoped risk decision, not a claim that every development dependency is vulnerability-free.
