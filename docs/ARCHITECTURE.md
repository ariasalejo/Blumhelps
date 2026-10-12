# Architecture

## Product boundary
BlumHelps is the user-facing app for support pathways, education, employment guidance, and a curated catalog relevant to Colombia. It is separate from BlumTherapy's developer-oriented Android utilities.

## Target layers
- **Presentation:** accessible Compose screens with loading, empty, error, and stale-data states.
- **Domain:** resource, organization, location, eligibility, and verification models plus use cases.
- **Data:** repository interfaces and implementations; start locally and add remote sources only when justified.
- **Verification:** source provenance and review metadata are mandatory for entries marked verified.
- **Privacy boundary:** avoid collecting sensitive support needs; make future optional data use clear and consent-based.

## Resource model direction
Each listing should include a stable ID, title, plain-language description, category, official source URL, coverage area, last-checked date, verification state, and optional eligibility/contact details. Never infer verification from popularity.

## Safety and quality
1. Separate general information from professional advice and emergency services.
2. Do not promise aid, employment, eligibility, or service availability.
3. Display source and freshness metadata.
4. Provide a way to report outdated or unsafe listings.
5. Use accessible labels, scalable text, and adequate contrast.
6. Do not add analytics or accounts without a privacy review.
