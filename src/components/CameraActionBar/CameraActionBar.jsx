import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import HomeButtonIcon from '../../assets/svg/HomeBtn.svg';
import StickerIcon from '../../assets/svg/smile.svg';
import GalleryIcon from '../../assets/svg/gallery.svg';
import { useCameraStore } from '../../store/useCameraStore';

export default function CameraActionBar({
  onTakePhoto,
  openGallery,
  onStickerPress,
}) {
  const thumbnailUri = useCameraStore((state) => state.thumbnailUri);
  function openStickerBook() {
    onStickerPress();
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={openGallery}>
        {thumbnailUri === undefined
          ? null
          : thumbnailUri
            ? <Image
              source={{ uri: thumbnailUri }}
              style={styles.icon}
            />
            : <GalleryIcon style={styles.icon} />
        }
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onTakePhoto}
        style={styles.captureBtnPressed}
      >
        <HomeButtonIcon style={styles.captureBtn} />
      </TouchableOpacity>

      <TouchableOpacity onPress={openStickerBook}>
        <StickerIcon style={styles.icon} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    width: 60,
    height: 60,
    marginVertical: 40,
    marginHorizontal: 8,
  },
  captureBtnPressed: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  captureBtn: {
    width: 65,
    height: 65,
    borderRadius: 28,
    marginVertical: 40,
  },
});
