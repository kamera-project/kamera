import { OpenCV, ObjectType, DataTypes } from 'react-native-fast-opencv';
import RNFS from 'react-native-fs';

export const binaryImageProcessor = async (photoPath) => {
  const base64jpg = await RNFS.readFile(photoPath, 'base64');
  const srcMat = OpenCV.base64ToMat(base64jpg);
  const rotatedMat = OpenCV.createObject(
    ObjectType.Mat,
    0,
    0,
    DataTypes.CV_8UC4,
  );
  OpenCV.invoke('rotate', srcMat, rotatedMat, 0);
  const dstMat = OpenCV.createObject(ObjectType.Mat, 0, 0, DataTypes.CV_8U);
  OpenCV.invoke('Canny', rotatedMat, dstMat, 120, 180);

  const result = OpenCV.toJSValue(dstMat);
  OpenCV.clearBuffers();

  return result.base64;
};
