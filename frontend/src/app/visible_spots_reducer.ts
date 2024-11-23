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
  initialState: [] as VisibleSpot[],
  reducers: {
    refreshVisibleSpots: (state, action: PayloadAction<VisibleSpot[]>) => {
      state;
      state = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { refreshVisibleSpots } = visibleSpotsSlice.actions;

export default visibleSpotsSlice.reducer;
