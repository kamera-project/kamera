import React, { useState } from 'react';
import { View, Switch, Text, StyleSheet } from 'react-native';

export default function OverlaySwitch() {
  const [isFeatureOn, setIsFeatureOn] = useState(false);

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
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 20,
  },
  label: {
    color: '#FFF',
    marginRight: 8,
    fontWeight: 'bold',
  },
});
