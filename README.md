# Northstar Analytics

An enterprise-style analytics workspace built with React 18, TypeScript, Vite, Redux Toolkit, React Query, MUI, and Recharts. The current build is a frontend demo backed by realistic local mock data; it does not connect to a production identity provider or analytics API.

## Features

- Responsive dashboard with KPI cards, interactive revenue/activity charts, product performance, and CSV export.
- Mock sign-in and registration, persisted session simulation, protected routes, and admin-only user management.
- User CRUD, search, status/role editing, pagination, orders search/status filters, and CSV export.
- Notifications panel and simulated live metric updates with connection status.
- Light/dark theme, English/Hindi/Bengali UI labels, and persisted preferences.
- React Query server-state boundary and Redux Toolkit client state with Redux Persist.
- Installable PWA shell, unit tests, Cypress smoke tests, Storybook metric-card example, and CI workflow.

## Technology stack

React 18 · TypeScript strict mode · Vite · Redux Toolkit · Redux Persist · React Router v6 · TanStack React Query · Recharts · MUI · mock WebSocket-style event simulator · Jest · React Testing Library · Cypress · Storybook · i18next · Vite PWA · ESLint · Husky.

## Architecture

`src/app` owns the store, typed hooks, theme, and app entry point. `src/features` contains Redux slices and their reducer tests. `src/services` is the replaceable API/mock-service boundary. `src/data/mockData.ts` provides local demo data. The route shell and lazily loaded page modules live in `src/App.tsx`; shared types, hooks, and styling live in `src/types`, `src/hooks`, and `src/styles.css`.

## Folder structure

```text
src/
  app/                 store, typed hooks, MUI theme
  components/          Storybook examples
  data/                realistic mock dashboard data
  features/             auth, dashboard, notifications, theme, users slices
  hooks/                auth, debounce, simulated live connection hooks
  services/             auth and transaction mock services
  tests/                Jest setup
  types/                shared domain types
  App.tsx                protected routes, shell, pages and workflows
  i18n.ts                English, Hindi and Bengali translations
public/icons/            app mark
cypress/e2e/              browser smoke tests
.storybook/               Storybook configuration
```

## Requirements and installation

Use Node.js 20+ and npm 10+.

```bash
npm ci
cp .env.example .env
npm run dev
```

On Windows PowerShell, copy the example using `Copy-Item .env.example .env`. Demo sign-in accepts any valid email and a password of at least four characters. Use `admin@acme.co` to exercise admin-only user management; any other valid email is a standard member.

## Environment variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Placeholder endpoint for a future real API integration | `http://localhost:3000/api` |

No secrets are required or stored by the demo.

## Development and verification

```bash
npm run dev
npm run typecheck
npm run lint
npm test
npm run e2e
npm run build
npm run preview
npm run storybook
```

## Deployment

Build with `npm run build` and deploy the `dist` directory to Vercel or another static host. `vercel.json` rewrites SPA paths to the Vite entry point. The GitHub Actions workflow runs type checking, lint, Jest, and the production build on pushes to `main` and pull requests. Configure `VITE_API_BASE_URL` in the deployment environment when replacing mocks.

## Screenshots

_Add product screenshots here after running the application in the target environment._

## Known limitations

- Authentication is a local simulation persisted in browser storage, without a backend, secure cookies, token lifecycle, or actual authorization enforcement. Do not use it to protect real data.
- “Live” data uses a local timer-based simulator, not a network WebSocket server; the UI indicator and data are demonstrative.
- User and order records are local fixtures, not a durable multi-user database. User edits persist in the current browser.
- The PWA caches static app assets only; no private API responses are configured for caching.
- Cypress tests require the Vite server to be running at the configured base URL. Authentication and API behavior need dedicated backend integration tests when real services are connected.
- The current dependency audit reports advisories in the development toolchain and two moderate React Router v6 advisories. The automatic React Router fix requires a major-version upgrade; re-evaluate the dependency tree before production deployment.

## Future improvements

Connect a secure identity provider and API, implement server-side roles and audit logs, add server pagination and query invalidation for mutations, expand translated copy, add user/order detail routes and accessibility automation, and validate the service worker lifecycle against real deployment hosting.
