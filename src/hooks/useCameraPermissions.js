import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useEffect, useRef, useState } from 'react';

export function useCameraPermissions() {
  const cameraRef = useRef(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const backCamera = useCameraDevice('back');
  const frontCamera = useCameraDevice('front');
  const chosenDevice = backCamera || frontCamera;
  useEffect(() => {
    (async () => {
      let camStatus = await Camera.getCameraPermissionStatus();

      if (typeof camStatus === 'undefined') {
        camStatus = 'not-determined';
      }

      setCameraPermission(camStatus);
    })();
  }, []);

  async function requestPermissions() {
    setIsRequesting(true);
    const newCamStatus = await Camera.requestCameraPermission();
    setCameraPermission(newCamStatus);
    setIsRequesting(false);
  }

  return {
    cameraPermission,
    isRequesting,
    cameraRef,
    chosenDevice,
    requestPermissions,
  };
}
