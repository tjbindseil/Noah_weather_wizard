import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Spot } from 'ww-3-models-tjb';

interface VisibleSpot {
  spot: Spot;
  selected: boolean;
  favorite: boolean;
  hovered: boolean;
  // forecast: Forecast;
}

export const visibleSpotsSlice = createSlice({
  name: 'visible_spots',
  initialState: { visibleSpots: [] as VisibleSpot[] },
  reducers: {
    refreshVisibleSpots: (state, action: PayloadAction<VisibleSpot[]>) => {
      state.visibleSpots = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { refreshVisibleSpots } = visibleSpotsSlice.actions;

export default visibleSpotsSlice.reducer;
