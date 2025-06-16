import React, { useRef } from 'react';
import {
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useCameraStore } from '../../store/useCameraStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function DraggableSticker({ emoji, id }) {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const placedStickers = useCameraStore((state) => state.placedStickers);
  const setPlacedStickers = useCameraStore((state) => state.setPlacedStickers);
  const removeSticker = (id) => {
    setPlacedStickers(placedStickers.filter((sticker) => sticker.id !== id));
  };
  const lastDistance = useRef(null);
  const currentScale = useRef(1);
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

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length === 1) {
          pan.setValue({
            x: gestureState.dx,
            y: gestureState.dy,
          });
        } else if (touches.length === 2) {
          const [touch1, touch2] = touches;

          const dx = touch1.pageX - touch2.pageX;
          const dy = touch1.pageY - touch2.pageY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (lastDistance.current !== null) {
            const scaleChange = distance / lastDistance.current;
            const newScale = currentScale.current * scaleChange;
            const limitedScale = Math.min(Math.max(newScale, 0.5), 5);

            scale.setValue(limitedScale);
            currentScale.current = limitedScale;
          }

          lastDistance.current = distance;
        }
      },

      onPanResponderRelease: () => {
        // 드래그 종료 시 오프셋 추출
        pan.extractOffset();

        // 핀치 관련 변수 초기화
        lastDistance.current = null;
      },
    }),
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
    >
      {/* 스케일이 적용되는 이모지 */}
      <Animated.View style={{ transform: [{ scale }] }}>
        <Text style={styles.emojiText}>{emoji}</Text>
      </Animated.View>

      {/* 삭제 버튼 - 동적 위치 */}
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
    top: SCREEN_HEIGHT / 3 - 50,
    left: SCREEN_WIDTH / 2 - 50,
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
