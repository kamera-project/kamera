import React, { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Button,
  Modal,
  Dimensions,
  Image,
  SafeAreaView,
  Pressable,
} from 'react-native';

import {
  Camera,
  useCameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';
import { WebView } from 'react-native-webview';
import Footer from '../components/footer/Footer';
import { useCameraStore } from '../store/useCameraStore';
import { handleTakePhoto } from '../utils/camera/takePhoto';
import { transparentProcessorHTML } from '../utils/overlay/transparentProcessor';
import CameraHeader from '../components/header/Header';
import GalleryScreen from './GalleryScreen';
import { detectImageFormat } from '../utils/detectImageFormat';
import { binaryImageProcessor } from '../utils/overlay/binaryImageProcessor';

export default function CameraScreen() {
  const [flash, setFlash] = useState('auto');
  const cameraRef = useRef(null);
  const webViewRef = useRef(null);
  const [processedUri, setProcessedUri] = useState(null);
  const [transparentOverlay, setTransparentOverlay] = useState(null);
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
  const format = useCameraFormat(chosenDevice, [
    { aspectRatio: { width: 16, height: 9 } }, // 16:9 비율로 설정
  ]);

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
      const photoPath = await handleTakePhoto(cameraRef, flash);
      const edgeBase64 = await binaryImageProcessor(photoPath);
      const edgedFormat = detectImageFormat(edgeBase64);
      setProcessedUri(`data:image/${edgedFormat};base64,${edgeBase64}`);

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
        <Camera
          ref={cameraRef}
          device={chosenDevice}
          isActive={true}
          style={styles.cameraPosition}
          photo={true}
          video={false}
          audio={false}
          resizeMode='cover'
        />
        <Image
          source={{ uri: transparentOverlay }}
          style={[
            styles.cameraPosition,
            {
              position: 'absolute',
              opacity: 0.6,
              backgroundColor: 'transparent',
            },
          ]}
          resizeMode='cover'
          fadeDuration={0}
        />
        <View style={styles.resetButtonContainer}>
          <Button
            title='RESET'
            color='#FFF'
            onPress={resetPhoto}
          />
        </View>
        <Footer
          onTakePhoto={onTakePhoto}
          thumbnailUri={thumbnailUri}
        />
        <View style={{ marginTop: 400 }}>
          <Modal
            animationType='slide'
            visible={isModalVisible}
            transparent={true}
          >
            <View style={styles.modalView}>
              <View>
                <Text style={styles.modalTextStyle}>
                  Modal이 출력되는 영역입니다.
                </Text>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    );
  }

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
          resizeMode='cover'
        />

        <WebView
          ref={webViewRef}
          source={{ html: transparentProcessorHTML }}
          onMessage={onWebViewMessage}
          style={{ width: 1, height: 1, position: 'absolute' }}
          javaScriptEnabled={true}
          onLoad={() => {
            const base64Only = processedUri.split(',')[1];
            webViewRef.current.postMessage(base64Only);
          }}
        />
        <Text style={styles.processingText}>오버레이 생성 중...</Text>
      </View>
    );
  }
  const onPressModalOpen = () => {
    console.log('팝업을 여는 중입니다.');
    setIsModalVisible(true);
  };

  const onPressModalClose = () => {
    setIsModalVisible(false);
  };
  const onToggleFlash = () => {
    setFlash((prev) =>
      prev === 'auto' ? 'on' : prev === 'on' ? 'off' : 'auto',
    );
  };

  const openGallery = () => setIsGalleryVisible(true);
  const closeGallery = () => setIsGalleryVisible(false);

  return (
    <SafeAreaView style={styles.overallBackground}>
      <CameraHeader
        flash={flash}
        onToggleFlash={onToggleFlash}
      />
      <View style={{ flex: 7 }}>
        <Camera
          ref={cameraRef}
          device={chosenDevice}
          isActive={true}
          style={styles.cameraPosition}
          photo={true}
          video={false}
          audio={false}
          resizeMode='cover'
        />
      </View>
      <Footer
        onTakePhoto={onTakePhoto}
        thumbnailUri={thumbnailUri}
        openGallery={openGallery}
        onPressModalOpen={onPressModalOpen}
        onPressModalClose={onPressModalClose}
      />
      <View style={styles.container}>
        <View style={styles.viewContainer}>
          <Text style={styles.textStyle}>화면을 출력하는 영역입니다~!</Text>
          <Pressable onPress={onPressModalOpen}>
            <Text style={styles.textStyle}>Modal Open!</Text>
          </Pressable>
        </View>

        <View style={{ marginTop: 400 }}>
          <Modal
            animationType='slide'
            visible={isModalVisible}
            transparent={true}
          >
            <View style={styles.modalView}>
              <View>
                <Text style={styles.modalTextStyle}>
                  Modal이 출력되는 영역입니다.
                </Text>
              </View>
              <Pressable onPress={onPressModalClose}>
                <Text>Modal Close!</Text>
              </Pressable>
            </View>
          </Modal>
        </View>
      </View>
      <GalleryScreen
        visible={isGalleryVisible}
        onClose={closeGallery}
      />
    </SafeAreaView>
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
    flex: 7,
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
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#17191c',
  },

  /**
   * 일반 화면 영역
   */
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
  },
  viewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 400,
  },

  /**
   * 모달 화면 영역
   */
  modalView: {
    marginTop: 230,
    margin: 30,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTextStyle: {
    color: '#17191c',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
  },
});
