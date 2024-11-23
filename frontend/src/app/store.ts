import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    // includes information on what is favorited, hovered, and selected, or maybe user status has favorites?
    // not sure if we want to track all favorites or which of the shown spots are favorited
    //
    // hmm, i guerss all spots could have a forecasts
    //     visibleSpots: visibleSpotsReducer,
    //     userStatus: userStatusReducer, // includes login status and optional name
    //     mapView: mapViewReducer, // includes zoom and bounds
    // I think the below are too narrowly scoped to be of use here
    // latLngInput: latLngInputReducer,
    // forecastDropDown: forecastDropDownReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
