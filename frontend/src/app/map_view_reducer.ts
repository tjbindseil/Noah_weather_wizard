import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const mapViewSlice = createSlice({
  name: 'map_view',
  initialState: {
    zoom: 13,
    center: { lat: 40.255014, lng: -105.615115 }, // TODO rename current center?
    desiredCenter: { lat: 40.255014, lng: -105.615115 },
    toggleToCenter: false,
  },
  reducers: {
    setZoom: (state, action: PayloadAction<number>) => {
      console.log(`setting zoom to: ${action.payload}`);
      state.zoom = action.payload;
    },
    setCenter: (state, action: PayloadAction<{ lat: number; lng: number }>) => {
      console.log(`setting center to: ${JSON.stringify(action.payload)}`);
      state.center = action.payload;
      state.desiredCenter = action.payload;
    },
    setDesiredCenter: (state, action: PayloadAction<{ lat: number; lng: number }>) => {
      console.log(`setting desiredCenter to: ${JSON.stringify(action.payload)}`);
      state.desiredCenter = action.payload;
    },
    center: (state) => {
      console.log('setting toggle');
      state.toggleToCenter = !state.toggleToCenter;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setZoom, setCenter, setDesiredCenter, center } = mapViewSlice.actions;

export default mapViewSlice.reducer;
