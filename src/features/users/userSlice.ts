import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { initialUsers } from '../../data/mockData';
import type { AppUser } from '../../types';

const userSlice = createSlice({
  name: 'users',
  initialState: { items: initialUsers },
  reducers: {
    addUser(state, action: PayloadAction<AppUser>) { state.items.unshift(action.payload); },
    updateUser(state, action: PayloadAction<AppUser>) {
      const index = state.items.findIndex((user) => user.id === action.payload.id);
      if (index >= 0) state.items[index] = action.payload;
    },
    removeUser(state, action: PayloadAction<string>) {
      state.items = state.items.filter((user) => user.id !== action.payload);
    }
  }
});

export const { addUser, updateUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
