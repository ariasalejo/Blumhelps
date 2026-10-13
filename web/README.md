# BlumHelps — Web companion

A lightweight Spanish (Colombia) browser companion for the BlumHelps project. This site is a separate static frontend and does not replace or change the native Android application.

## Run locally

From the repository root, run:

```bash
python3 -m http.server 8000 --directory web
```

Then open <http://localhost:8000>.

No package installation, build tool, third-party JavaScript, external font, or application server is required.

## Included

- Independent, hash-routed screens for Inicio, Encontrar apoyo, Bienestar, Formación, Trabajo, Comunidad, Para familias, Guardados and Ajustes.
- Responsive persistent desktop navigation and compact mobile navigation.
- Resource search and filters, saved links, wellbeing idea selection, dark theme and larger text.
- Local browser storage for saved resource identifiers and display preferences.
- Institutional starting points that link directly to source sites, with clear reminders to confirm current coverage, eligibility, costs, deadlines and availability.

## Privacy and safety

This static version does not send search strings, saved links, or wellbeing selections to a BlumHelps server. Browser-local storage is not a secure vault: people sharing the same browser profile may see saved preferences. Avoid entering sensitive health details. The site is not a clinical service or emergency service and does not promise access to treatment, jobs, grants, training places or benefits.

## Validation and deployment

`node web/validate.mjs` checks inline JavaScript syntax and important structural, responsive, source-link and safety requirements. GitHub Actions runs this validation for pull requests and, after changes reach `main`, deploys the `web/` folder to GitHub Pages.

If Pages has not been configured in this repository before, open **Settings → Pages → Build and deployment → Source → GitHub Actions** once. The workflow does not change repository settings or create credentials.

## Project

See the [main BlumHelps repository](https://github.com/ariasalejo/Blumhelps) and the project documentation for the wider Android roadmap and principles.