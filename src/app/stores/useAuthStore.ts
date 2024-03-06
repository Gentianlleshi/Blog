// app/stores/useAuthStore.ts

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  id: string | null; // Add ID to the state
  username: string | null;
  authToken: string | null;
  isAuthenticated: boolean;
  setId: (id: string) => void; // Method to set the user ID
  setUsername: (username: string) => void;
  setCredentials: (username: string, authToken: string, id: string) => void; // Include ID in setCredentials
  setAuthToken: (authToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      id: null, // Default value for ID
      username: null,
      authToken: null,
      isAuthenticated: false,
      setId: (id) => set((state) => ({ ...state, id })), // Implementation of setId
      setUsername: (username) => set((state) => ({ ...state, username })),
      setCredentials: (username, authToken, id) =>
        set({
          id,
          username,
          authToken,
          isAuthenticated: !!username && !!authToken,
        }),
      setAuthToken: (authToken) => set((state) => ({ ...state, authToken })),
      logout: () =>
        set({
          id: null,
          username: null,
          authToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
