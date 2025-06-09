import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import FlashToggleIcon from "../../assets/svg/flash-auto.svg";
import FlipCameraIcon from "../../assets/svg/flip-camera.svg";
import { useCameraDevice } from "react-native-vision-camera";
import { useCameraStore } from "../../store/useCameraStore";

export default function CameraHeader() {
  const backCamera = useCameraDevice('back');
  const frontCamera = useCameraDevice('front');
  const chosenDevice = useCameraStore((state) => state.chosenDevice);
  const setChosenDevice = useCameraStore((state) => state.setChosenDevice);

  const onPressFlash = () => {
    console.log('FlashToggleIcon');
  }
  const onToggleCamera = () => {
    setChosenDevice(chosenDevice.position === 'back' ? frontCamera : backCamera);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressFlash} style={styles.icon}>
        <FlashToggleIcon width={40} height={40} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onToggleCamera} style={styles.icon}>
        <FlipCameraIcon width={40} height={40} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    padding: 8,
  }
});
