import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import CameraHeader from './src/components/header/Header';
import CameraScreen from './src/screens/CameraScreen';

export default function App() {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.header}>
        <CameraHeader />
      </SafeAreaView>

      <SafeAreaView style={styles.main}>
        <CameraScreen />
      </SafeAreaView>
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
    backgroundColor: 'white',
  },
  title: { fontSize: 24, marginBottom: 20 },
  preview: {
    height: '100%',
    resizeMode: 'contain',
  },
});
