import { create } from 'zustand';

export const useCameraStore = create((set) => ({
  cameraPermission: null,
  chosenDevice: null,
  isRequesting: false,
  setCameraRef: (ref) => set({ cameraRef: ref }),
  setCameraPermission: (status) => set({ cameraPermission: status }),
  setChosenDevice: (device) => set({ chosenDevice: device }),
  setIsRequesting: (request) => set({ isRequesting: request }),
}));
