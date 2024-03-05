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


// // src/stores/useImageStore.ts
// import {create }from 'zustand';

// interface ImageState {
//   imageId: string;
//   setImageId: (id: string) => void;
//   previewImage: any; // Add the previewImage property
// }

// export const useImageStore = create<ImageState>(set => ({
//   imageId: '',
//   setImageId: (id) => set(() => ({ imageId: id })),
//   previewImage: null,
//   setPreviewImage: (imageData: any) => set({ previewImage: imageData }),
// }));



// src/stores/useImageStore.ts
import {create }from 'zustand';

interface ImageState {
  imageId: string;
  imageUrl: string; // Add imageUrl to the state
  setImageData: (id: string, url: string) => void; // Method to update both ID and URL
  previewImage: any;
  setPreviewImage: (imageData: any) => void;
}

export const useImageStore = create<ImageState>((set) => ({
  imageId: '',
  imageUrl: '', // Initialize imageUrl
  setImageData: (id, url) => set(() => ({ imageId: id, imageUrl: url })), // Implement setImageData
  previewImage: null,
  setPreviewImage: (imageData) => set({ previewImage: imageData }),
}));