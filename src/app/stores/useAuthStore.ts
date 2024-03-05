import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  username: string | null;
  authToken: string | null;
  isAuthenticated: boolean, // Added new state variable
  setUsername: (username: string) => void;
  setCredentials: (username: string, authToken: string) => void;
  setAuthToken: (authToken: string) => void; // Action to set only the authToken
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      username: null,
      authToken: null,
      isAuthenticated: false,
      setIsAuthenticated: (isAuthenticated: AuthState['isAuthenticated']) => set(() => ({
        isAuthenticated,
      })), 
      setUsername: (username) => set((state) => ({ ...state, username })), // Implementation of setUsername
      setCredentials: (username, authToken) =>
        set({ username, authToken, isAuthenticated: !!username && !!authToken }),
      setAuthToken: (authToken) => set((state) => ({ ...state, authToken })), // Implementation of setAuthToken
      logout: () =>
        set({ username: null, authToken: null, isAuthenticated: false }),
    }),
    {
      name: "auth", // unique name for the storage (required)
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;