import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useCameraStore } from '../../store/useCameraStore';

export const handleTakePhoto = async (cameraRef) => {
  const photo = await cameraRef.current.takePhoto();
  const uri = `file://${photo.path}`;

  useCameraStore.getState().setThumbnailUri(uri);

  await CameraRoll.saveAsset(`file://${photo.path}`, {
    type: 'photo',
  });
};
