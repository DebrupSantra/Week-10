import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Alert, Box, Button, Typography } from '@mui/material';

interface ErrorBoundaryState { hasError: boolean; }

export default class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application rendering failed', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <Box sx={{ maxWidth: 560, mx: 'auto', mt: 12, p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>The application ran into an unexpected error.</Alert>
        <Typography color="text.secondary" mb={2}>Reload the workspace to try again.</Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>Reload workspace</Button>
      </Box>;
    }
    return this.props.children;
  }
}
