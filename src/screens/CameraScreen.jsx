import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Button,
  Dimensions,
} from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import Footer from '../components/footer/Footer';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

export default function CameraScreen() {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [microphonePermission, setMicrophonePermission] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const backCamera = useCameraDevice('back');
  const frontCamera = useCameraDevice('front');

  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      let camStatus = await Camera.getCameraPermissionStatus();
      let micStatus = await Camera.getMicrophonePermissionStatus();

      if (
        typeof camStatus === 'undefined' &&
        typeof micStatus === 'undefined'
      ) {
        camStatus = 'not-determined';
        micStatus = 'not-determined';
      }

      setCameraPermission(camStatus);
      setMicrophonePermission(micStatus);
    })();
  }, []);

  async function requestPermissions() {
    setIsRequesting(true);

    const newCamStatus = await Camera.requestCameraPermission();
    setCameraPermission(newCamStatus);

    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
    }

    const newMicStatus = await Camera.requestMicrophonePermission();
    setMicrophonePermission(newMicStatus);
    setIsRequesting(false);
  }

  if (
    cameraPermission === null ||
    microphonePermission === null ||
    cameraPermission === 'denied' ||
    microphonePermission === 'denied' ||
    cameraPermission === 'not-determined' ||
    microphonePermission === 'not-determined'
  ) {
    return (
      <View style={styles.centerPosition}>
        <Text style={styles.titleText}>카메라 · 마이크 권한이 필요합니다.</Text>
        <Button
          title={
            isRequesting ? '권한 요청 중입니다...' : '카메라·마이크 권한 요청'
          }
          onPress={requestPermissions}
          disabled={isRequesting}
        />
      </View>
    );
  }

  const chosenDevice = backCamera || frontCamera;

  const handleTakePhoto = async () => {
    const photo = await cameraRef.current.takePhoto();
    await CameraRoll.saveAsset(`file://${photo.path}`, {
      type: 'photo',
    });
  }

  return (
    <View style={styles.overallBackground}>
      <Camera
        ref={cameraRef}
        device={chosenDevice}
        isActive={true}
        style={styles.cameraPosition}
        photo={true}
        video={false}
        audio={false}
      />
      <Footer onTakePhoto={handleTakePhoto} style={styles.footer} />
    </View>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  centerPosition: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overallBackground: {
    flex: 1,
    backgroundColor: 'white',
  },
  cameraPosition: {
    width: SCREEN_WIDTH,
    aspectRatio: 3 / 4,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  titleText: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
    color: 'black',
  },
  footer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
  },
});
