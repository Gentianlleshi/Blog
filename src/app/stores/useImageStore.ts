// // src/stores/useImageStore.ts
// import create from 'zustand';

// interface ImageState {
//   imageId: string;
//   imageUrl: string;
//   setImageId: (id: string) => void;
//   setImageUrl: (url: string) => void;
// }

// export const useImageStore = create<ImageState>((set) => ({
//   imageId: '',
//   imageUrl: '',
//   setImageId: (id) => set(() => ({ imageId: id })),
//   setImageUrl: (url) => set(() => ({ imageUrl: url })),
// }));


// src/stores/useImageStore.ts
import {create }from 'zustand';

interface ImageState {
  imageId: string;
  setImageId: (id: string) => void;
}

export const useImageStore = create<ImageState>(set => ({
  imageId: '',
  setImageId: (id) => set(() => ({ imageId: id })),
}));