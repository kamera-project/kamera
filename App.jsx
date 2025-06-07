import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import CameraHeader from './src/components/header/Header';
import samplePreview from './src/assets/images/sample_preview.png';
import Footer from './src/components/footer/Footer';
import CameraScreen from './src/screens/CameraScreen';

export default function App() {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.header}>
        <CameraHeader />
      </SafeAreaView>

      <View style={styles.main}>
        <CameraScreen />
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
