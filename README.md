# Reward Geni - Hybrid Client API Docs (Part B)

Static documentation site for the Reward Geni Hybrid Client API Part B.

This site documents the endpoints your HYBRID client server must implement:

- **POST /auth/token** — Generate a Bearer token using `x-client-id` + `x-client-secret` headers
- **GET /v1/points/:externalUserId** — Fetch a user's point balance grouped by blocks
- **POST /v1/redeem** — Deduct points from a user's balance before order creation

It also includes:

- token-based authentication flow (POST /auth/token → Bearer token)
- success and error response examples for every endpoint
- error code reference (HC_400, HC_401, HC_402, HC_404, HC_500, HC_503)
- timeout and retry behavior
- Postman collection download

## Tech

- HTML
- CSS
- JavaScript

No backend runtime and no build step are required.

## Run locally

```bash
python -m http.server 8000
```

Open: http://localhost:8000

## Main files

- index.html
- docs/getting-started.html
- docs/api.html
- docs/guides.html
- Reward Geni - Hybrid Client API Spec (Part B).postman_collection.json
- styles.css
- script.js
- config.js
- search-index.json

## Base URL display

The docs use the value from config.js to render example URLs.
Site name and API version in the sidebar/footer are also read from config.js.

Default in this project:

- BASE_URL: https://your-api.example.com

Change only config.js if you want examples to show a different domain.

## Deploy

- Push to main branch.
- GitHub Pages serves this static site.

No BASE_URL injection workflow is required for this project.
