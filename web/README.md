# BlumHelps — Web companion

BlumHelps Web is the Spanish (Colombia) React/Vite progressive web app for wellbeing habits, public support resources, training, work, community, families and local saved items. It complements the native Android app; it does not replace it.

## Run locally

Use Node.js 22 and npm 10 or newer. From the repository root:

```bash
cd web
npm ci
npm run validate
npm run build
npm run dev
```

Vite serves the web app on <http://localhost:5173>. The development server proxies `/api` to <http://127.0.0.1:8000>. To run the API in a second terminal, follow the backend README and start it on port 8000.

## Build and deployment

- `npm ci` installs exactly the dependencies recorded in `web/package-lock.json`; a mismatch between that lockfile and `package.json` is a release-blocking error.
- `npm run validate` checks the current React/Vite entry, route declarations, deployment base path, accessible navigation and motion settings, local data handling, public link safety, PWA setup, demo-data disclosure and lockfile consistency.
- `npm run build` runs TypeScript's project build and creates the production assets in `web/dist`.
- Pull requests validate and build the PWA. Only a push to `main` publishes the compiled `web/dist` folder to GitHub Pages. A Pages-compatible `404.html` keeps client-side routes available on direct navigation and refresh.

The production web build uses the GitHub Pages project path `/Blumhelps/`. Local builds use the root path.

## Product scope, privacy and safety

- Saved resources, goals and preferences live in the browser's local storage. This is not an encrypted vault; avoid storing sensitive health details and remember that other people using the same browser profile may be able to see this information.
- This version has no screen lock, discreet-mode behavior, scheduled notifications, account sync, encrypted journal or encrypted backup. UI labels identify those as unavailable/future ideas rather than active features.
- The interface is currently Spanish (Colombia). The language selector marks other languages as coming later; choosing one does not falsely imply that the text has been translated.
- The sample resource catalog contains fictional examples marked as demo. Do not treat demo listings, review dates, availability, benefits eligibility, training places or jobs as verified real-world offers.
- The API exposes public resource catalog data and a non-clinical, explainable daily-step suggestion. Personal habit history is not sent to or stored by the API.
- BlumHelps is not a clinical service or emergency service. For immediate danger in Colombia, contact emergency services at 123.
- Before connecting a production API, configure `CORS_ORIGINS` for the actual deployed origin. Localhost defaults are intentionally not a production allowlist.

## Architecture

- `src/main.tsx`: routes, app shell and navigation
- `src/pages/`: user-facing areas
- `src/state/app.tsx`: local goals, saved items and supported preferences
- `src/lib/platformApi.ts`: public API and adaptive-plan client
- `vite.config.ts`: Vite and PWA build settings
- `validate.mjs`: lightweight structural/release checks
- `../backend`: FastAPI API and database-backed public catalog

See the [main repository](https://github.com/ariasalejo/Blumhelps) for Android, backend, packaging and release notes.
