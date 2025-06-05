import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
// import HomeBtn from '../../assets/svg/HomeButton.png';
import HomeBtn from '../../assets/svg/HomeBtn.svg';
import Smile from '../../assets/svg/smile.svg';
import Goback from '../../assets/svg/goback.svg';
import Gallery from '../../assets/svg/gallery.svg';

export default function Footer() {
  return (
    <View style={styles.container}>
      {/* <Image
        style={{ height: 90, width: 90 }}
        source={HomeBtn}
      /> */}
      <Goback
        width={90}
        height={90}
      />
      <Gallery
        width={90}
        height={90}
      />
      <HomeBtn
        width={90}
        height={90}
      />
      <Smile
        width={90}
        height={90}
      />
      {/* <Text>home</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // ← 가로 배치
    justifyContent: 'space-around', // ← 아이콘 간 간격을 균등하게
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
});
