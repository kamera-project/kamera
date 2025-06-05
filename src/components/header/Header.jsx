import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import FlashToggleIcon from "../../assets/svg/flash-auto.svg";
import FlipCameraIcon from "../../assets/svg/flip-camera.svg";

export default function CameraHeader() {

  const onPressFlash = () => {
    console.log('FlashToggleIcon');
  }
  const onPressCamera = () => {
    console.log('FlipCameraIcon');
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressFlash} style={styles.icon}>
        <FlashToggleIcon width={40} height={40} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressCamera} style={styles.icon}>
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
