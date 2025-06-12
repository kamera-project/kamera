import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import FlashAutoIcon from "../../assets/svg/flash-auto.svg";
import FlashOnIcon from "../../assets/svg/flash-on.svg";
import FlashOffIcon from "../../assets/svg/flash-off.svg";
import FlipCameraIcon from "../../assets/svg/flip-camera.svg";
import { useCameraDevice } from "react-native-vision-camera";
import { useCameraStore } from "../../store/useCameraStore";

export default function CameraHeader({ flash, onToggleFlash }) {
  const backCamera = useCameraDevice('back');
  const frontCamera = useCameraDevice('front');
  const chosenDevice = useCameraStore((state) => state.chosenDevice);
  const setChosenDevice = useCameraStore((state) => state.setChosenDevice);

  const onToggleCamera = () => {
    setChosenDevice(chosenDevice.position === 'back' ? frontCamera : backCamera);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onToggleFlash} style={styles.icon}>
        {flash === 'auto' && <FlashAutoIcon width={40} height={40} />}
        {flash === 'on' && <FlashOnIcon width={40} height={40} />}
        {flash === 'off' && <FlashOffIcon width={40} height={40} />}
      </TouchableOpacity>
      <TouchableOpacity onPress={onToggleCamera} style={styles.icon}>
        <FlipCameraIcon width={46} height={46} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,

  },
  icon: {
    width: 48,
    height: 48,
    marginHorizontal: 8,
  },
});
