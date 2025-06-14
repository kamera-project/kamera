// takephoto 에서 uri 를 받아온다
// uri를 투명처리를 할 transparentProcessor.js (웹뷰) (투명, 굵기 처리)

import React, { useEffect, useRef, useState, useCallback } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  PanResponder,
} from 'react-native';

import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { WebView } from 'react-native-webview';
import Footer from '../components/footer/Footer';
import { useCameraStore } from '../store/useCameraStore';
import { handleTakePhoto } from '../utils/camera/takePhoto';
import { transparentProcessorHTML } from '../utils/overlay/transparentProcessor';
import CameraHeader from '../components/header/Header';

export default function CameraScreen() {
  const [flash, setFlash] = useState('auto');
  const cameraRef = useRef(null);
  const webViewRef = useRef(null);
  const [processedUri, setProcessedUri] = useState(null);
  const [transparentOverlay, setTransparentOverlay] = useState(null);
  const [placedStickers, setPlacedStickers] = useState([]);

  // Bottom Sheet state 추가
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const bottomSheetHeight = useRef(new Animated.Value(0)).current;

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
  const stickerList = [
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
    })();
  }, []);

  async function requestPermissions() {
    setIsRequesting(true);
    const newCamStatus = await Camera.requestCameraPermission();
    setCameraPermission(newCamStatus);
    setIsRequesting(false);
  }

  const openStickerSheet = useCallback(() => {
    console.log('sticker function');
    setIsBottomSheetVisible(true);
    Animated.timing(bottomSheetHeight, {
      toValue: SCREEN_HEIGHT * 0.35,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, []);

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
    console.log('Selected sticker:', sticker);
    console.log(typeof sticker);
    // 여기에 스티커 선택 후 로직 추가
    closeBottomSheet();
    setPlacedStickers([...placedStickers, sticker]);
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

        <Footer
          onTakePhoto={onTakePhoto}
          thumbnailUri={thumbnailUri}
          onStickerPress={openStickerSheet} // 스티커 버튼 핸들러 추가
        />

        {/* Bottom Sheet 추가*/}
        {renderBottomSheet()}
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
  const onToggleFlash = () => {
    setFlash((prev) =>
      prev === 'auto' ? 'on' : prev === 'on' ? 'off' : 'auto',
    );
  };

  // 기본
  return (
    <View style={styles.overallBackground}>
      <CameraHeader
        flash={flash}
        onToggleFlash={onToggleFlash}
      />
      <Camera
        ref={cameraRef}
        device={chosenDevice}
        isActive={true}
        style={styles.cameraPosition}
        photo={true}
        video={false}
        audio={false}
      />
      {/* 선택한 스티커 랜더링 */}
      {placedStickers.map((sticker, index) => (
        <View
          key={index}
          style={styles.centerStickerContainer}
        >
          <Text style={styles.stickerText}>{sticker}</Text>
        </View>
      ))}

      <Footer
        onTakePhoto={onTakePhoto}
        thumbnailUri={thumbnailUri}
        onStickerPress={openStickerSheet} // 스티커 버튼 핸들러 추가
      />

      {/* Bottom Sheet 추가 */}
      {renderBottomSheet()}
    </View>
  );
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
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

// Bottom Sheet 스타일 추가
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
    width: 40,
    height: 4,
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
