# Contributing

## Local workflow

1. Use Node.js 20+ and install dependencies with `npm ci`.
2. Create a focused branch and keep changes scoped to one feature or fix.
3. Use strict TypeScript types and the existing Redux/React Query boundaries.
4. Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` before opening a pull request.
5. Add or update tests for behavior changes. For browser flows, run Cypress against a local Vite server.

## Pull requests

Describe the user impact, note any changed state or mock-service contracts, and include screenshots for visible changes. Do not commit credentials, real customer data, generated build output, or local environment files. Mock auth must not be presented as production security.
