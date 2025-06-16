import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import CameraPreview from './src/screens/CameraPreview';
import SplashScreen from 'react-native-splash-screen';

export default function App() {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  });

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.main}>
        <CameraPreview />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  main: {
    flex: 7,
    backgroundColor: 'white',
  },
});
