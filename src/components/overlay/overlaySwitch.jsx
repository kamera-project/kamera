import React from 'react';
import { View, Switch, Text, StyleSheet } from 'react-native';
import { useCameraStore } from '../../store/useCameraStore';

export default function OverlaySwitch() {
  const isFeatureOn = useCameraStore((state) => state.isFeatureOn);
  const setIsFeatureOn = useCameraStore((state) => state.setIsFeatureOn);

  return (
    <View style={styles.overlay}>
      <Text style={styles.label}>{isFeatureOn ? 'ON' : 'OFF'}</Text>
      <Switch
        value={isFeatureOn}
        onValueChange={setIsFeatureOn}
        thumbColor='#FFF'
        trackColor={{ true: '#4CAF50', false: '#888' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 15,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 20,
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  label: {
    color: '#FFF',
    marginRight: 8,
    fontWeight: 'bold',
  },
});
