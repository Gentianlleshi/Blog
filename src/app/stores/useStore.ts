import {create} from 'zustand'

// Define a state interface
interface StoreState {
  postsRefreshTrigger: number;
  triggerPostsRefresh: () => void;
}

// Use the interface in the create() method to enforce type safety
export const useStore = create<StoreState>((set) => ({
  postsRefreshTrigger: 0,
  triggerPostsRefresh: () => set((state) => ({ postsRefreshTrigger: state.postsRefreshTrigger + 1 })),
}));

export default useStore;