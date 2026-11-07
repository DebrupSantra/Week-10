import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: 'light' as 'light' | 'dark' },
  reducers: {
    setTheme(state, action: PayloadAction<'light' | 'dark'>) { state.mode = action.payload; },
    toggleTheme(state) { state.mode = state.mode === 'light' ? 'dark' : 'light'; }
  }
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
