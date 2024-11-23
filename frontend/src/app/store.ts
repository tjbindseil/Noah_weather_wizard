import { configureStore } from '@reduxjs/toolkit';
import mapViewReducer from './map_view_reducer';
import visibleSpotsReducer from './visible_spots_reducer';

export const store = configureStore({
  reducer: {
    visibleSpots: visibleSpotsReducer,
    mapView: mapViewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
