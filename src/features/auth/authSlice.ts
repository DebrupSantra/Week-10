import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
  name: string;
  email: string;
  role: 'Admin' | 'Member';
}

interface AuthState {
  user: AuthUser | null;
}

const initialState: AuthState = { user: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signedIn(state, action: PayloadAction<AuthUser>) { state.user = action.payload; },
    signedOut(state) { state.user = null; }
  }
});

export const { signedIn, signedOut } = authSlice.actions;
export default authSlice.reducer;
