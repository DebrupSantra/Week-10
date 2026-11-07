import { createTheme } from '@mui/material/styles';

export const getAppTheme = (mode: 'light' | 'dark') => createTheme({
  cssVariables: true,
  palette: {
    mode,
    primary: { main: '#635bff', light: '#eeedff' },
    secondary: { main: '#16a88a' },
    background: { default: mode === 'light' ? '#f6f7fb' : '#111827', paper: mode === 'light' ? '#fff' : '#1f2937' },
    text: { primary: mode === 'light' ? '#172033' : '#f3f4f6', secondary: mode === 'light' ? '#667085' : '#aab2c0' },
    divider: mode === 'light' ? '#eaecf0' : '#374151'
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Arial, sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.04em' },
    h5: { fontWeight: 700, letterSpacing: '-0.03em' },
    h6: { fontWeight: 650, letterSpacing: '-0.02em' },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  components: {
    MuiCard: { styleOverrides: { root: { border: '1px solid', borderColor: mode === 'light' ? '#eaecf0' : '#374151', boxShadow: '0 2px 8px rgba(16, 24, 40, 0.035)' } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 9, boxShadow: 'none' } } }
  }
});
