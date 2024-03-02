import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  username: string | null;
  authToken: string | null;
  isAuthenticated: boolean;
  setCredentials: (username: string, authToken: string) => void;
  setAuthToken: (authToken: string) => void; // Action to set only the authToken
  logout: () => void;
}

export const useAuthStore = create(persist<AuthState>(
  (set) => ({
    username: null,
    authToken: null,
    isAuthenticated: false,
    setCredentials: (username, authToken) => 
      set({ username, authToken, isAuthenticated: true }),
    setAuthToken: (authToken) => 
      set((state) => ({ ...state, authToken })), // Implementation of setAuthToken
    logout: () => 
      set({ username: null, authToken: null, isAuthenticated: false }),
  }),
  {
    name: 'auth', // unique name for the storage (required)
    getStorage: () => localStorage, // storage provider
  },
));

export default useAuthStore;
