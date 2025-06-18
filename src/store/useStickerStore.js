import { create } from 'zustand';

export const useStickerStore = create((set) => ({
  opacity: 0.5,
  setOpacity: (value) => set({ opacity: value }),
}));
