import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const mapViewSlice = createSlice({
  name: 'map_view',
  initialState: {
    zoom: 13,
    center: { lat: 40.255014, lng: -105.615115 },
    desiredCenter: { lat: 40.255014, lng: -105.615115 },
    toggleToCenter: false,
    mapBounds: { sw: { lat: 0, lng: 0 }, ne: { lat: 0, lng: 0 } },
  },
  reducers: {
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setCenter: (state, action: PayloadAction<{ lat: number; lng: number }>) => {
      state.center = action.payload;

      // we set this here because otherwise its hard to implement the center button in the latlng input thing
      state.desiredCenter = action.payload;
    },
    setDesiredCenter: (state, action: PayloadAction<{ lat: number; lng: number }>) => {
      state.desiredCenter = action.payload;
      state.toggleToCenter = !state.toggleToCenter;
    },
    setMapBounds: (
      state,
      action: PayloadAction<{ sw: { lat: number; lng: number }; ne: { lat: number; lng: number } }>,
    ) => {
      state.mapBounds = action.payload;
    },
  },
});

export const { setZoom, setCenter, setDesiredCenter, setMapBounds } = mapViewSlice.actions;

export default mapViewSlice.reducer;
