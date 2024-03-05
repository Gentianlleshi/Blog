import {create} from 'zustand'

const useStore = create((set) => ({
  postsRefreshTrigger: 0,
  triggerPostsRefresh: () => set((state) => ({ postsRefreshTrigger: state.postsRefreshTrigger + 1 })),
}))
export default useStore;