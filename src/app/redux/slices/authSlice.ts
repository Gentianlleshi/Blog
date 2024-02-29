// app/redux/slices/authSlice.ts
"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  username: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  username: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginState: (state, action: PayloadAction<AuthState>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.username = action.payload.username;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.username = "";
    },
  },
});

export const { setLoginState, logout } = authSlice.actions;

export default authSlice.reducer;
