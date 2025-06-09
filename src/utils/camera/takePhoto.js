import { OpenCV, ObjectType, DataTypes } from 'react-native-fast-opencv';
import RNFS from 'react-native-fs';

export async function handleTakePhoto(cameraRef) {
  const photo = await cameraRef.current.takePhoto({ flash: 'off' });
  let filePath = photo.path;
  const base64jpg = await RNFS.readFile(filePath, 'base64');
  const dataUriJpeg = `data:image/jpeg;base64,${base64jpg}`;

  const resp = await fetch(dataUriJpeg);
  if (!resp.ok) {
    throw new Error(`이미지 로드 실패: ${resp.status}`);
  }
  const blob = await resp.blob();
  const dataUrl = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
  const base64 = dataUrl.split(',')[1];

  const srcMat = OpenCV.base64ToMat(base64);

  const rotatedMat = OpenCV.createObject(
    ObjectType.Mat,
    0,
    0,
    DataTypes.CV_8UC4,
  );
  OpenCV.invoke('rotate', srcMat, rotatedMat, 0);

  const kernelSize = OpenCV.createObject(ObjectType.Size, 7, 7);
  // const kernelSize = OpenCV.createObject(ObjectType.Size, 11, 11);
  // const kernelSize = OpenCV.createObject(ObjectType.Size, 13, 13);
  // const kernelSize = OpenCV.createObject(ObjectType.Size, 15, 15);
  const blurredMat = OpenCV.createObject(
    ObjectType.Mat,
    0,
    0,
    DataTypes.CV_8UC4,
  );
  OpenCV.invoke('GaussianBlur', rotatedMat, blurredMat, kernelSize, 0);

  const dstMat = OpenCV.createObject(ObjectType.Mat, 0, 0, DataTypes.CV_8U);
  OpenCV.invoke('Canny', blurredMat, dstMat, 50, 80);
  // OpenCV.invoke('Canny', blurredMat, dstMat, 80, 160);
  // OpenCV.invoke('Canny', blurredMat, dstMat, 100, 200);
  // OpenCV.invoke('Canny', blurredMat, dstMat, 150, 300);

  const result = OpenCV.toJSValue(dstMat);
  OpenCV.clearBuffers();
  return `data:image/png;base64,${result.base64}`;
}
