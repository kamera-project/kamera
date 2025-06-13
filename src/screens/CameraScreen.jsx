import React, { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  Image,
} from 'react-native';

import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { WebView } from 'react-native-webview';
import Footer from '../components/footer/Footer';
import { useCameraStore } from '../store/useCameraStore';
import { handleTakePhoto } from '../utils/camera/takePhoto';
import { transparentProcessorHTML } from '../utils/overlay/transparentProcessor';
import CameraHeader from '../components/header/Header';
import GalleryScreen from './GalleryScreen';

export default function CameraScreen() {
  const [flash, setFlash] = useState('auto');
  const cameraRef = useRef(null);
  const webViewRef = useRef(null);
  const [processedUri, setProcessedUri] = useState(null);
  const [transparentOverlay, setTransparentOverlay] = useState(null);
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);

  const cameraPermission = useCameraStore((state) => state.cameraPermission);
  const setCameraPermission = useCameraStore(
    (state) => state.setCameraPermission,
  );
  const chosenDevice = useCameraStore((state) => state.chosenDevice);
  const setChosenDevice = useCameraStore((state) => state.setChosenDevice);

  const isRequesting = useCameraStore((state) => state.isRequesting);
  const setIsRequesting = useCameraStore((state) => state.setIsRequesting);
  const thumbnailUri = useCameraStore((state) => state.thumbnailUri);
  const getLatestPhoto = useCameraStore((state) => state.getLatestPhoto);

  const backCamera = useCameraDevice('back');
  const frontCamera = useCameraDevice('front');
  const initialCameraMode = backCamera || frontCamera;

  useEffect(() => {
    if (initialCameraMode) {
      setChosenDevice(initialCameraMode);
    }
  }, [initialCameraMode, setChosenDevice]);

  useEffect(() => {
    (async () => {
      let camStatus = await Camera.getCameraPermissionStatus();

      if (typeof camStatus === 'undefined') {
        camStatus = 'not-determined';
      }
      setCameraPermission(camStatus);
      await getLatestPhoto();
    })();
  }, []);

  async function requestPermissions() {
    setIsRequesting(true);
    const newCamStatus = await Camera.requestCameraPermission();
    setCameraPermission(newCamStatus);
    setIsRequesting(false);
  }

  if (
    cameraPermission === null ||
    cameraPermission === 'denied' ||
    cameraPermission === 'not-determined'
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

  async function onTakePhoto() {
    try {
      const edgeBase64 = await handleTakePhoto(cameraRef, flash);
      setProcessedUri(`data:image/png;base64,${edgeBase64}`);

      setTimeout(() => {
        if (webViewRef.current) {
          webViewRef.current.postMessage(edgeBase64);
        } else {
        }
      }, 100);
    } catch (err) { }
  }

  const onWebViewMessage = (event) => {
    const transparentImage = event.nativeEvent.data;
    setTransparentOverlay(transparentImage);
  };

  const resetPhoto = () => {
    setProcessedUri(null);
    setTransparentOverlay(null);
  };

  const onToggleFlash = () => {
    setFlash(prev => (prev === 'auto' ? 'on' : prev === 'on' ? 'off' : 'auto'));
  }

  const openGallery = () => setIsGalleryVisible(true);
  const closeGallery = () => setIsGalleryVisible(false);

  const isFront = chosenDevice.position === 'front';

  return (
    <View style={styles.overallBackground}>
      <CameraHeader flash={flash} onToggleFlash={onToggleFlash} />
      <View>
        <Camera
          ref={cameraRef}
          device={chosenDevice}
          isActive={true}
          style={styles.cameraPosition}
          photo={true}
          video={false}
          audio={false}
        />

        {processedUri && !transparentOverlay && (
          <WebView
            ref={webViewRef}
            source={{ html: transparentProcessorHTML }}
            onMessage={onWebViewMessage}
            style={{
              width: 1,
              height: 1,
              position: 'absolute',
            }}
            javaScriptEnabled
            onLoad={() => {
              const base64Only = processedUri.split(',')[1];
              webViewRef.current.postMessage(base64Only);
            }}
          />
        )}

        {processedUri && !transparentOverlay && (
          <Text style={styles.processingText}>오버레이 생성 중...</Text>
        )}

        {transparentOverlay && (
          <Image
            source={{ uri: transparentOverlay }}
            resizeMode="cover"
            style={[
              styles.cameraPosition,
              {
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: 0.3,
                backgroundColor: 'transparent',
                transform: isFront ? [{ scaleX: -1 }] : undefined,
              },
            ]}
          />
        )}

        {transparentOverlay && (
          <View style={styles.resetButtonContainer}>
            <Button title="RESET" color="#FFF" onPress={resetPhoto} />
          </View>
        )}
      </View>
      <Footer onTakePhoto={onTakePhoto} thumbnailUri={thumbnailUri} openGallery={openGallery} />
      <GalleryScreen visible={isGalleryVisible} onClose={closeGallery} />
    </View>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { width, height } = Dimensions.get('window');

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
  processingText: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
  resetButtonContainer: {
    position: 'absolute',
    bottom: 0,
    right: width * 0.05,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: 6,
  },
});
