# Stage 0 — Dynamic Profile Endpoint (Node.js/Express)

## Overview
GET /me returns your profile + dynamic cat fact from https://catfact.ninja/fact

## Run locally
1. clone repo
2. cp .env
3. npm install
4. npm start
5. open http://localhost:3000/me

## Deployment
Works on Railway, Heroku, Fly etc. Set env vars from `.env`.

## API Response
{
  "status":"success",
  "user": { "email": "dorathypaul48@gmail.com", "name": "Dorathy Paul", "stack": "Node.js/Express" },
  "timestamp":"<ISO 8601 UTC>",
  "fact":"<cat fact>"
}

## Tests
npm test

## Notes
- External API timeout set to 3000ms
- Graceful fallback if cat facts API fails
