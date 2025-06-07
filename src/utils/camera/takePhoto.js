import { CameraRoll } from '@react-native-camera-roll/camera-roll';

export const handleTakePhoto = async (cameraRef) => {
  const photo = await cameraRef.current.takePhoto();
  await CameraRoll.saveAsset(`file://${photo.path}`, {
    type: 'photo',
  });
};
