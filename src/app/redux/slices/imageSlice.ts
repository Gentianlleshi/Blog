// app/redux/slices/imageSlice.ts
"use client";
import { createSlice } from "@reduxjs/toolkit";

export const imageSlice = createSlice({
  name: "image",
  initialState: {
    imageId: "",
    imageUrl: "", // Add a field for storing the image URL
  },
  reducers: {
    setImageId: (state, action) => {
      state.imageId = action.payload;
    },
    setImageUrl: (state, action) => {
      state.imageUrl = action.payload; // Add a reducer for setting the image URL
    },
  },
});

export const { setImageId, setImageUrl } = imageSlice.actions;

export default imageSlice.reducer;
