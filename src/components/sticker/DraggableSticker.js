import React from 'react';
import {
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import useDraggableSticker from '../../hooks/useDraggableSticker';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const removeButtonSize = 50;

export default function DraggableSticker({ emoji, id }) {
  const { pan, panResponder, scale, removeSticker } = useDraggableSticker();
  const deleteButtonStyle = {
    position: 'absolute',
    top: scale.interpolate({
      inputRange: [0.5, 1, 5],
      outputRange: [5, -5, -105],
    }),
    right: scale.interpolate({
      inputRange: [0.5, 1, 5],
      outputRange: [5, -5, -105],
    }),
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  };
  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          transform: pan.getTranslateTransform(),
        },
      ]}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Text style={styles.emojiText}>{emoji}</Text>
      </Animated.View>
      <Animated.View style={deleteButtonStyle}>
        <TouchableOpacity onPress={() => removeSticker(id)}>
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 3.5,
    left: SCREEN_WIDTH / 2 - removeButtonSize / 2,
    zIndex: 10,
  },
  emojiText: {
    fontSize: 100,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
