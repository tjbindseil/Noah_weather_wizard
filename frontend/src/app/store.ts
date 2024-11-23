import { configureStore } from '@reduxjs/toolkit';
import mapViewReducer from './map_view_reducer';
import visibleSpotsReducer from './visible_spots_reducer';

export const store = configureStore({
  reducer: {
    visibleSpots: visibleSpotsReducer,
    mapView: mapViewReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
