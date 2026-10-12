# BlumHelps-Android

> **A privacy-conscious Android starting point for support, education, employment, and verified resources in Colombia.**

BlumHelps aims to help people discover support pathways, learning opportunities, employment resources, and trustworthy public-service information. This repository establishes an Android app foundation and the governance needed to develop those features responsibly.

**Status:** early scaffold. The app currently contains a basic interface; resource directories, verification workflows, and integrations must be implemented and validated before being described as available.

## Product principles
- **Human-centered:** clear language, accessible layouts, and low-friction navigation.
- **Trustworthy resources:** show source, verification date, and geographic coverage.
- **Privacy by default:** no account, tracking, or collection of sensitive information in the starter app.
- **No false promises:** no emergency response, legal advice, medical care, or guaranteed employment.
- **Colombia-aware:** local content must be checked against authoritative sources and kept current.

## Initial product areas
- **Support:** curated routes to public and community services.
- **Education:** learning and training opportunities.
- **Employment:** job-search guidance and legitimate resources.
- **Verified resources:** a transparent catalog with source and last-reviewed metadata.

These are planned areas. A resource must not be labeled verified until its documented review is complete.

## Repository map
```text
app/                         Android application
docs/                        Product, architecture, and verification guidance
.github/                     Issue templates and continuous integration
CONTRIBUTING.md               Contribution workflow
SECURITY.md                   Vulnerability reporting
CODE_OF_CONDUCT.md            Community expectations
```

## Build locally
Requirements: JDK 17, Android SDK, and Gradle 8.11.1 or compatible with the configured Android Gradle Plugin.

```bash
gradle assembleDebug
```

Open the project in Android Studio if preferred. CI will validate the initial configuration. Add a Gradle wrapper from a trusted local Gradle installation before relying on wrapper-based builds.

## Resource verification
Every future catalog entry should include, where relevant:
- Title and plain-language description.
- Official source URL and responsible organization.
- Country/department/municipality coverage.
- Eligibility and cost information, only when confirmed.
- Date last checked and a review process.
- A way to report outdated or unsafe information.

Never publish private contact details or user-submitted claims as verified facts without a lawful, documented basis.

## Safety and privacy
Read [SECURITY.md](SECURITY.md) and [docs/RESOURCE_VERIFICATION.md](docs/RESOURCE_VERIFICATION.md). Do not commit personal records, credentials, tokens, or unredacted support conversations.

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md).

## License
MIT. See [LICENSE](LICENSE).
