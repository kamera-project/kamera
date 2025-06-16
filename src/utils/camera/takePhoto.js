import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useCameraStore } from '../../store/useCameraStore';

export const handleTakePhoto = async (cameraRef, flash) => {
  const photo = await cameraRef.current.takePhoto({
    flash,
    qualityPrioritization: 'speed',
  });

  const uri = photo.path.startsWith('file://')
    ? photo.path
    : `file://${photo.path}`;
  useCameraStore.getState().setThumbnailUri(uri);
  await CameraRoll.saveAsset(`file://${photo.path}`, {
    type: 'photo',
  });

  return photo.path;
};
