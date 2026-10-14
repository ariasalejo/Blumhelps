# Deploy preview instructions (updated)

The preview deployment workflow builds the web app and publishes it to the `gh-pages` branch. I pushed a small trigger to the branch `feat/blumhelps-state-quality` to start the workflow.

How to check the workflow:
1. Go to the repository Actions page: https://github.com/ariasalejo/Blumhelps/actions
2. Look for the workflow named **Deploy BlumHelps preview** and click the most recent run.
3. Inspect the logs for any `npm ci` or `npm run build` errors. If a step fails, copy the failing log lines and paste them in the chat and I will diagnose and fix them.

Preview URL (expected):
- https://ariasalejo.github.io/Blumhelps/

Notes and troubleshooting:
- If GitHub Pages hasn't been enabled for the repository, go to Settings → Pages and set source to `gh-pages` branch (published by GitHub Actions). Allow GitHub Actions to deploy if required.
- If the build fails due to dependency or Node version issues, open the failed job logs and I will provide a fix.

If you prefer a Vercel/Netlify preview instead of GitHub Pages, tell me and I will add config files and instructions for that provider.
