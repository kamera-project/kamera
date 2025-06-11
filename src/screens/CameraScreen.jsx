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

export default function CameraScreen() {
  const cameraRef = useRef(null);
  const webViewRef = useRef(null);
  const [processedUri, setProcessedUri] = useState(null);
  const [transparentOverlay, setTransparentOverlay] = useState(null);

  const cameraPermission = useCameraStore((state) => state.cameraPermission);
  const setCameraPermission = useCameraStore(
    (state) => state.setCameraPermission,
  );
  const chosenDevice = useCameraStore((state) => state.chosenDevice);
  const setChosenDevice = useCameraStore((state) => state.setChosenDevice);

  const isRequesting = useCameraStore((state) => state.isRequesting);
  const setIsRequesting = useCameraStore((state) => state.setIsRequesting);

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
      const edgeBase64 = await handleTakePhoto(cameraRef);
      setProcessedUri(`data:image/png;base64,${edgeBase64}`);

      setTimeout(() => {
        if (webViewRef.current) {
          webViewRef.current.postMessage(edgeBase64);
        } else {
        }
      }, 100);
    } catch (err) {}
  }

  const onWebViewMessage = (event) => {
    const transparentImage = event.nativeEvent.data;
    setTransparentOverlay(transparentImage);
  };

  const resetPhoto = () => {
    setProcessedUri(null);
    setTransparentOverlay(null);
  };

  if (transparentOverlay) {
    return (
      <View style={styles.overallBackground}>
        {/* 카메라 프리뷰 */}
        <Camera
          ref={cameraRef}
          device={chosenDevice}
          isActive={true}
          style={styles.cameraPosition}
          photo={true}
          video={false}
          audio={false}
        />

        {/* 투명 오버레이 */}
        <Image
          source={{ uri: transparentOverlay }}
          style={[
            styles.cameraPosition,
            {
              position: 'absolute',
              opacity: 0.6, // 투명도 조절
              backgroundColor: 'transparent',
            },
          ]}
          resizeMode='cover'
          fadeDuration={0}
        />

        {/* 다시 촬영 버튼 대신 하단 goback 버튼 */}
        <View style={styles.resetButtonContainer}>
          <Button
            title='RESET'
            color='#FFF'
            onPress={resetPhoto}
          />
        </View>

        <Footer onTakePhoto={onTakePhoto} />
      </View>
    );
  }

  // 에지 검출 후 투명 처리 전
  if (processedUri && !transparentOverlay) {
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

        <WebView
          ref={webViewRef}
          source={{ html: transparentProcessorHTML }}
          onMessage={onWebViewMessage}
          style={{ width: 1, height: 1, position: 'absolute' }}
          javaScriptEnabled={true}
          onLoad={() => {
            // WebView가 로드되면 바로 메시지 전송
            const base64Only = processedUri.split(',')[1];
            webViewRef.current.postMessage(base64Only);
          }}
        />
        <Text style={styles.processingText}>오버레이 생성 중...</Text>
      </View>
    );
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
      <Footer onTakePhoto={onTakePhoto} />
    </View>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1, width: SCREEN_WIDTH },
  fullScreen: { flex: 1, width: SCREEN_WIDTH, backgroundColor: '#000' },
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
    top: '66%',
    right: 20,
  },
});
