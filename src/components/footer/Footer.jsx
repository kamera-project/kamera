import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import HomeBtn from './HomeButton';
import Sticker from './Sticker';
import Gallery from './Gallery';

export default function Footer({
  onTakePhoto,
  thumbnailUri,
  onStickerPress, // prop 이름을 onStickerPress로 통일
}) {
  function openGallery() {
    alert('gallery clicked!!');
  }

  function openStickerBook() {
    console.log('openStickerBook called');
    console.log('onStickerPress:', onStickerPress);

    if (onStickerPress) {
      onStickerPress();
    } else {
      alert('sticker book clicked!!');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.row}>
        <TouchableOpacity onPress={openGallery}>
          {thumbnailUri ? (
            <Image
              source={{ uri: thumbnailUri }}
              style={styles.icon}
            />
          ) : (
            <Gallery style={styles.icon} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onTakePhoto}
          style={styles.captureBtnPressed}
        >
          <HomeBtn style={styles.captureBtn} />
        </TouchableOpacity>

        <TouchableOpacity onPress={openStickerBook}>
          <Sticker style={styles.icon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
    height: '15%',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 16,
    position: 'relative',
  },
  icon: {
    width: 48,
    height: 48,
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'red',
  },
});
