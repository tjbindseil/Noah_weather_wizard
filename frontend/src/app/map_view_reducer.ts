import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const CENTER_LAT_KEY = 'CENTER_LAT_KEY';
const CENTER_LNG_KEY = 'CENTER_LNG_KEY';
const ZOOM_KEY = 'ZOOM_KEY';

const getInitialStateFromCookies = () => {
  const lat = isNaN(Number(Cookies.get(CENTER_LAT_KEY)))
    ? 40.255014
    : Number(Cookies.get(CENTER_LAT_KEY));
  const lng = isNaN(Number(Cookies.get(CENTER_LNG_KEY)))
    ? -105.615115
    : Number(Cookies.get(CENTER_LNG_KEY));
  const zoom = isNaN(Number(Cookies.get(ZOOM_KEY))) ? 13 : Number(Cookies.get(ZOOM_KEY));

  return {
    zoom,
    center: { lat, lng },
    desiredCenter: { lat, lng },
    toggleToCenter: false,
    mapBounds: { sw: { lat: 0, lng: 0 }, ne: { lat: 0, lng: 0 } },
  };
};

export const mapViewSlice = createSlice({
  name: 'map_view',
  initialState: getInitialStateFromCookies(),
  reducers: {
    setZoom: (state, action: PayloadAction<number>) => {
      // save to cookies as well
      const newZoom = action.payload;
      Cookies.set(ZOOM_KEY, newZoom.toString());

      state.zoom = newZoom;
    },
    setCenter: (state, action: PayloadAction<{ lat: number; lng: number }>) => {
      const newCenter = action.payload;

      Cookies.set(CENTER_LAT_KEY, newCenter.lat.toString());
      Cookies.set(CENTER_LNG_KEY, newCenter.lng.toString());

      state.center = newCenter;

      // we set this here because otherwise its hard to implement the center button in the latlng input thing
      state.desiredCenter = newCenter;
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
