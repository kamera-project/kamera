import { useRef } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
export default function DraggableSticker({ index, emoji }) {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),

      onPanResponderRelease: () => {
        pan.extractOffset();
      },
    }),
  ).current;

  return (
    <Animated.View
      style={[
        styles.sticker,
        {
          // 화면 중앙에 초기 배치
          top: SCREEN_HEIGHT / 3 - styles.emojiText.fontSize / 2,
          left: SCREEN_WIDTH / 2 - styles.emojiText.fontSize / 2,
          transform: pan.getTranslateTransform(),
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Text style={styles.emojiText}>{emoji}</Text>
      <Text stlye={styles.emojiDelete}>x</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sticker: {
    position: 'absolute',
    zIndex: 10,
    // 중앙 정렬을 위한 추가 스타일
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 48,
    textAlign: 'center',
  },
  emojiDelete: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
