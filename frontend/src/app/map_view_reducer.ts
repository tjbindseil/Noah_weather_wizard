import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LatLng } from 'leaflet';

export const mapViewSlice = createSlice({
  name: 'map_view',
  initialState: {
    zoom: 13,
    center: new LatLng(40.255014, -105.615115),
    desiredCenter: new LatLng(40.255014, -105.615115),
  },
  reducers: {
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setCenter: (state, action: PayloadAction<LatLng>) => {
      state.center = action.payload;
    },
    setDesiredCenter: (state, action: PayloadAction<LatLng>) => {
      state.desiredCenter = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setZoom, setCenter, setDesiredCenter } = mapViewSlice.actions;

export default mapViewSlice.reducer;
