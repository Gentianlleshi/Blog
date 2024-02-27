// src/redux/slices/imageSlice.ts
"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ImageState {
  imageId: string;
}

const initialState: ImageState = {
  imageId: "",
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setImageId(state, action: PayloadAction<string>) {
      state.imageId = action.payload;
    },
  },
});

export const { setImageId } = imageSlice.actions;
export default imageSlice.reducer;
