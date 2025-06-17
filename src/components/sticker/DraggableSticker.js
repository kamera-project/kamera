import React from 'react';
import {
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import useDraggableSticker from '../../hooks/useDraggableSticker';
import { useStickerStore } from '../../store/useStickerStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const removeButtonSize = 50;

export default function DraggableSticker({ emoji, id }) {
  const { pan, panResponder, scale, removeSticker } = useDraggableSticker();
  const opacity = useStickerStore((state) => state.opacity);
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
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(102, 101, 101, 0.7)',
    opacity,
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
      <Animated.View style={{ transform: [{ scale }], opacity }}>
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
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
