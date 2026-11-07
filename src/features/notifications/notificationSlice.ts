import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppNotification } from '../../types';

interface NotificationState { items: AppNotification[]; }

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [
      { id: 'n-1', title: 'Monthly report is ready', detail: 'Your October analytics report is available.', time: '12 min ago', read: false },
      { id: 'n-2', title: 'New team member', detail: 'Drew Cano joined the workspace.', time: '1 hour ago', read: false },
      { id: 'n-3', title: 'Payment received', detail: 'A payment of $2,480 was processed.', time: 'Yesterday', read: true }
    ]
  } as NotificationState,
  reducers: {
    markAllRead(state) { state.items.forEach((item) => { item.read = true; }); },
    addNotification(state, action: PayloadAction<AppNotification>) { state.items.unshift(action.payload); }
  }
});

export const { markAllRead, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
