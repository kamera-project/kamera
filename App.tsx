import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
// import samplePreview from './src/assets/images/sample_preview.png';
// import Footer from './src/components/footer/Footer';

export default function App() {
  return (
    <View style={styles.screen}>
      {/* header 컴포넌트 */}
      <View style={styles.header}>
        <Text style={styles.title}>상단</Text>
      </View>

      <View style={styles.main}>
        {/* View style main 영역 */}
        {/* <Image
          source={samplePreview}
          style={styles.preview}
        /> */}
        {/* <Preview /> */}
        {/* <Guide /> */}
        {/* <Sticker /> */}
      </View>

      <View style={styles.footer}>
        {/* footer 컴포넌트 */}
        {/* <Footer /> */}

        {/* <Text style={styles.title}>하단1</Text> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'lightgray',
  },
  main: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'ash',
  },
  footer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
  },
  title: { fontSize: 24, marginBottom: 20 },
  preview: {
    // width: '100%', // 원하는 너비 (px 단위)
    height: '100%', // 원하는 높이 (px 단위)
    resizeMode: 'contain',
  },
});
