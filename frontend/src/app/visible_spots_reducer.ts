import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Spot } from 'ww-3-models-tjb';

interface HoveredSpot {
  spotId: number;
  fromMap: boolean;
}
const clearedHoveredSpot = {
  spotId: -1,
  fromMap: false,
} as HoveredSpot;

interface VisibleSpot {
  spot: Spot;
  selected: boolean;
  favorite: boolean;
  // forecast: Forecast;
}

export const visibleSpotsSlice = createSlice({
  name: 'visible_spots',
  initialState: {
    visibleSpots: [] as VisibleSpot[],
    hoveredSpot: clearedHoveredSpot,
  },
  reducers: {
    refreshVisibleSpots: (state, action: PayloadAction<VisibleSpot[]>) => {
      state.visibleSpots = action.payload;
    },
    setHoveredSpot: (state, action: PayloadAction<HoveredSpot>) => {
      state.hoveredSpot = action.payload;
    },
    clearHoveredSpot: (state) => {
      state.hoveredSpot = clearedHoveredSpot;
    },
  },
});

// Action creators are generated for each case reducer function
export const { refreshVisibleSpots, setHoveredSpot, clearHoveredSpot } = visibleSpotsSlice.actions;

export default visibleSpotsSlice.reducer;
