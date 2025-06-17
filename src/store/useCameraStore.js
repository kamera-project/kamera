import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { create } from 'zustand';

export const useCameraStore = create((set) => ({
  cameraPermission: null,
  chosenDevice: null,
  isRequesting: false,
  thumbnailUri: undefined,
  placedStickers: [],

  setCameraRef: (ref) => set({ cameraRef: ref }),
  setCameraPermission: (status) => set({ cameraPermission: status }),
  setChosenDevice: (device) => set({ chosenDevice: device }),
  setIsRequesting: (request) => set({ isRequesting: request }),
  setThumbnailUri: (uri) => set({ thumbnailUri: uri }),
  setPlacedStickers: (sticker) => set({ placedStickers: sticker }),
  getLatestPhoto: async () => {
    try {
      const photos = await CameraRoll.getPhotos({
        first: 1,
        assetType: 'Photos',
        groupTypes: 'All',
      });
      const uri = photos.edges[0]?.node?.image?.uri;
      if (uri) {
        set({ thumbnailUri: uri });
      }
    } catch (err) {
      console.error(`읽기 권한이 존재하지 않습니다(세부 에러사항:${err})`);
    }
  },
}));
