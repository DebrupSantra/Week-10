import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface DashboardState {
  dateRange: '30d' | '90d' | '180d' | '12m';
  revenueOffset: number;
}

const initialState: DashboardState = { dateRange: '12m', revenueOffset: 0 };

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDateRange(state, action: PayloadAction<DashboardState['dateRange']>) { state.dateRange = action.payload; },
    addRevenueOffset(state, action: PayloadAction<number>) { state.revenueOffset += action.payload; }
  }
});

export const { setDateRange, addRevenueOffset } = dashboardSlice.actions;
export default dashboardSlice.reducer;
