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
  
  const uri = `file://${photo.path}`;
  useCameraStore.getState().setThumbnailUri(uri);
  await CameraRoll.saveAsset(`file://${photo.path}`, {
    type: 'photo',
  });

  const base64jpg = await RNFS.readFile(photo.path, 'base64');
  const srcMat = OpenCV.base64ToMat(base64jpg);
  const rotatedMat = OpenCV.createObject(
    ObjectType.Mat,
    0,
    0,
    DataTypes.CV_8UC4,
  );
  OpenCV.invoke('rotate', srcMat, rotatedMat, 0);
  const dstMat = OpenCV.createObject(ObjectType.Mat, 0, 0, DataTypes.CV_8U);
  // OpenCV.invoke('Canny', rotatedMat, dstMat, 80, 120);
  OpenCV.invoke('Canny', rotatedMat, dstMat, 120, 180);

  const result = OpenCV.toJSValue(dstMat);
  OpenCV.clearBuffers();

  return result.base64;
}
