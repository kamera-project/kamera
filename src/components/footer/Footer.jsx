import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import HomeBtn from './HomeButton';
import Sticker from './Sticker';
import Goback from '../../assets/svg/goback.svg';
import Gallery from './Gallery';

export default function Footer() {
  function openGallery() {
    alert('gallery clicked!!');
  }
  function takePhoto() {
    alert('shot button clicked!!');
  }
  function openStickerBook() {
    alert('sticker book clicked!!');
  }

  return (
    <SafeAreaView
      style={{ width: '100%', height: '20%', justifyContent: 'center' }}
    >
      <View style={styles.container}>
        <View style={styles.firstSpace} />
        {/* <View style={styles.grid}><Goback /></View> */}
        <View>
          <Gallery
            galleryClick={openGallery}
            style={styles.icons}
          />
        </View>
        <View style={styles.secondSpace} />
        <View style={styles.iconsHome}>
          <HomeBtn
            homeBtnClick={takePhoto}
            style={styles.icons}
          />
        </View>
        <View style={styles.ThridSpace} />
        <View>
          <Sticker
            stickerClick={openStickerBook}
            style={styles.icons}
          />
        </View>
        <View style={styles.fourthSpace} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  firstSpace: {
    width: '10%',
  },
  secondSpace: {
    width: '10%',
  },
  ThridSpace: {
    width: '10%',
  },
  fourthSpace: {
    width: '10%',
  },
  fifthSpace: {
    width: '10%',
  },
  iconsHome: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
