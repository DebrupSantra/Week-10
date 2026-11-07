import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { store, persistor } from './app/store';
import { useAppSelector } from './app/hooks';
import { getAppTheme } from './app/theme';
import ErrorBoundary from './app/ErrorBoundary';
import App from './App';
import './i18n';
import './styles.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } }
});

export function Root() {
  const mode = useAppSelector((state) => state.theme.mode);
  return <ThemeProvider theme={getAppTheme(mode)}><CssBaseline /><App /></ThemeProvider>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div className="boot-loader">Loading workspace…</div>} persistor={persistor}>
        <QueryClientProvider client={queryClient}><ErrorBoundary><Root /></ErrorBoundary></QueryClientProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
