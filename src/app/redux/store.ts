// app/redux/store.ts

import { configureStore } from "@reduxjs/toolkit";
import imageReducer from "./slices/imageSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    image: imageReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
