import type { Preview } from '@storybook/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { getAppTheme } from '../src/app/theme';

const preview: Preview = {
  decorators: [(Story) => <ThemeProvider theme={getAppTheme('light')}><CssBaseline /><Story /></ThemeProvider>],
  parameters: { controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } } }
};

export default preview;
