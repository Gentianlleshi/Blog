// src/redux/store.ts

import { configureStore } from "@reduxjs/toolkit";
import imageReducer from "./slices/imageSlice";

export const store = configureStore({
  reducer: {
    image: imageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;