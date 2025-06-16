import { OpenCV, ObjectType, DataTypes } from 'react-native-fast-opencv';
import RNFS from 'react-native-fs';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useCameraStore } from '../../store/useCameraStore';

export const handleTakePhoto = async (cameraRef, flash) => {
  const photo = await cameraRef.current.takePhoto({
    flash,
    qualityPrioritization: 'speed',
    width: 640, // 또는 480
    height: 480, // 또는 360
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
