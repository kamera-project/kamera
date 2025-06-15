import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  Image,
  Animated,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { WebView } from 'react-native-webview';
import Footer from '../components/footer/Footer';
import { useCameraStore } from '../store/useCameraStore';
import { handleTakePhoto } from '../utils/camera/takePhoto';
import { transparentProcessorHTML } from '../utils/overlay/transparentProcessor';
import CameraHeader from '../components/header/Header';
import GalleryScreen from './GalleryScreen';
import DraggableSticker from '../components/sticker/DraggableSticker';
import * as Svg from '../assets/svg';

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
  const placedStickers = useCameraStore((state) => state.placedStickers);
  const setPlacedStickers = useCameraStore((state) => state.setPlacedStickers);
  const chosenDevice = useCameraStore((state) => state.chosenDevice);
  const setChosenDevice = useCameraStore((state) => state.setChosenDevice);

  const isRequesting = useCameraStore((state) => state.isRequesting);
  const setIsRequesting = useCameraStore((state) => state.setIsRequesting);
  const thumbnailUri = useCameraStore((state) => state.thumbnailUri);
  const getLatestPhoto = useCameraStore((state) => state.getLatestPhoto);

  const backCamera = useCameraDevice('back');
  const frontCamera = useCameraDevice('front');
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const bottomSheetHeight = useRef(new Animated.Value(0)).current;
  const initialCameraMode = backCamera || frontCamera;
  const stickerList = [
    <Svg.Vector1
      width={50}
      height={50}
    />,
    <Svg.Vector2
      width={50}
      height={50}
    />,
    <Svg.Vector3
      width={50}
      height={50}
    />,
    <Svg.Vector4
      width={50}
      height={50}
    />,
    <Svg.Vector5
      width={50}
      height={50}
    />,
    '😀',
    '😎',
    '🎉',
    '❤️',
    '⭐',
    '🌈',
    '🎨',
    '🎭',
    '🎪',
    '🎯',
    '🎲',
    '🎸',
    '🎤',
    '🎧',
    '🎮',
    '🎬',
    '🎺',
    '🥳',
  ];

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
  const openStickerSheet = () => {
    setIsBottomSheetVisible(true);
    Animated.timing(bottomSheetHeight, {
      toValue: SCREEN_HEIGHT * 0.35,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeBottomSheet = () => {
    Animated.timing(bottomSheetHeight, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setIsBottomSheetVisible(false);
    });
  };

  const handleStickerSelect = (sticker) => {
    const newSticker = {
      id: Date.now() + Math.random(),
      emoji: sticker,
    };
    setPlacedStickers([...placedStickers, newSticker]);
    closeBottomSheet();
  };

  const renderBottomSheet = () => (
    <Modal
      visible={isBottomSheetVisible}
      transparent={true}
      animationType='none'
    >
      <TouchableOpacity
        style={bottomSheetStyles.modalOverlay}
        activeOpacity={1}
        onPress={closeBottomSheet}
      >
        <Animated.View
          style={[
            bottomSheetStyles.bottomSheet,
            {
              height: bottomSheetHeight,
            },
          ]}
        >
          <TouchableOpacity activeOpacity={1}>
            <View style={bottomSheetStyles.handle} />
            <Text style={bottomSheetStyles.title}>스티커 선택</Text>
            <ScrollView
              style={bottomSheetStyles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              <View style={bottomSheetStyles.stickerGrid}>
                {stickerList.map((sticker, index) => (
                  <TouchableOpacity
                    key={index}
                    style={bottomSheetStyles.stickerItem}
                    onPress={() => handleStickerSelect(sticker)}
                  >
                    <Text style={bottomSheetStyles.stickerText}>{sticker}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );

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
      setProcessedUri(`data:i234234242345mage/png;base64,${edgeBase64}`);

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
    setPlacedStickers([]);
  };

  const onToggleFlash = () => {
    setFlash((prev) =>
      prev === 'auto' ? 'on' : prev === 'on' ? 'off' : 'auto',
    );
  };

  const openGallery = () => setIsGalleryVisible(true);
  const closeGallery = () => setIsGalleryVisible(false);

  const isFront = chosenDevice.position === 'front';

  return (
    <View style={styles.overallBackground}>
      <CameraHeader
        flash={flash}
        onToggleFlash={onToggleFlash}
      />
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
        {/* {placedStickers.map((sticker, index) => (
          <View
            key={index}
            style={styles.centerStickerContainer}
          >
            <Text style={styles.stickerText}>{sticker}</Text>
          </View>
        ))} */}
        {placedStickers.map((sticker, index) => (
          <DraggableSticker
            key={index}
            emoji={sticker.emoji}
            id={sticker.id}
          />
        ))}
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
            resizeMode='cover'
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
            <Button
              title='RESET'
              color='#FFF'
              onPress={resetPhoto}
            />
          </View>
        )}
      </View>
      <Footer
        onTakePhoto={onTakePhoto}
        thumbnailUri={thumbnailUri}
        openGallery={openGallery}
        onStickerPress={openStickerSheet}
      />
      <GalleryScreen
        visible={isGalleryVisible}
        onClose={closeGallery}
      />
      {renderBottomSheet()}
    </View>
  );
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
    right: SCREEN_WIDTH * 0.05,
    paddingVertical: SCREEN_HEIGHT * 0.015,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    borderRadius: 6,
  },
  centerStickerContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    zIndex: 10,
  },
  stickerText: {
    fontSize: 60,
  },
});
const bottomSheetStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  handle: {
    SCREEN_WIDTH: 40,
    SCREEN_HEIGHT: 4,
    backgroundColor: '#DDDDDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  stickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  stickerItem: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  stickerText: {
    fontSize: 36,
  },
});
