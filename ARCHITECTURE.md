# Architecture

## Runtime boundaries

- **Application state:** Redux Toolkit stores authentication simulation, theme, notifications, dashboard filter/live metric, and the local user directory. Redux Persist stores only browser-demo state.
- **Server state:** TanStack React Query owns transaction reads and their loading/error lifecycle. Replace `src/services/dashboardService.ts` with a network adapter and retain query keys/invalidation at the feature boundary.
- **Presentation:** React Router v6 protects the application shell and nests an admin-only users route. Route pages are lazy-loaded. MUI provides accessible primitives, with responsive layout rules in `src/styles.css`.
- **Visualization:** Recharts receives deterministic mock series and includes responsive containers, tooltips, legends, and chart interaction.
- **Infrastructure adapters:** `authService.ts` and `dashboardService.ts` are explicit mock boundaries. `useWebSocket` simulates connection state and periodic metric changes; it is not a WebSocket client.

## Data flow

The login form validates locally through `loginMock`, dispatches `signedIn`, and navigates to the originally requested protected route. Dashboard/order pages query transactions via React Query. User form actions dispatch typed Redux actions. Date range, theme, and notification state are selected with typed store hooks.

## Security boundaries

The persisted auth state is a UX simulation, not an identity credential. Route guards are client-side navigation controls only. Production use requires server-side authentication and authorization, secure session storage, validated API inputs, and appropriate cache controls. No sensitive API payload is cached by the current service worker.

## PWA and deployment

Vite PWA generates a static-asset service worker and web manifest. Vercel rewrites client routes to `index.html`. The CI workflow checks TypeScript, ESLint, Jest, and the optimized Vite bundle.
