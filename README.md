# Reward Geni - Hybrid Client API Docs (Part B)

Static documentation site for the Reward Geni Hybrid Client API Part B.

This site documents the endpoints your HYBRID client server must implement:

- GET /v1/points/:externalUserId
- POST /v1/redeem

It also includes:

- x-api-key authentication requirements
- success and error response examples
- error code reference
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
