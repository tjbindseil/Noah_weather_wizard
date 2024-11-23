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

export interface VisibleSpot {
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
      const previouslySelectedSpotIds = state.visibleSpots
        .filter((visibleSpot) => visibleSpot.selected)
        .map((visibleSpot) => visibleSpot.spot.id);
      state.visibleSpots = action.payload;
      state.visibleSpots.forEach((visibleSpot) => {
        if (previouslySelectedSpotIds.includes(visibleSpot.spot.id)) {
          visibleSpot.selected = true;
        }
      });
    },
    setHoveredSpot: (state, action: PayloadAction<HoveredSpot>) => {
      state.hoveredSpot = action.payload;
    },
    clearHoveredSpot: (state) => {
      state.hoveredSpot = clearedHoveredSpot;
    },
    toggleSpotSelection: (state, action: PayloadAction<number>) => {
      state.visibleSpots = state.visibleSpots.map((visibleSpot) => {
        if (visibleSpot.spot.id === action.payload) {
          return {
            ...visibleSpot,
            selected: !visibleSpot.selected,
          };
        } else {
          return visibleSpot;
        }
      });
    },
  },
});

export const { refreshVisibleSpots, setHoveredSpot, clearHoveredSpot, toggleSpotSelection } =
  visibleSpotsSlice.actions;

export default visibleSpotsSlice.reducer;
