import { useRef } from 'react';
import { Animated, PanResponder } from 'react-native';
import { useCameraStore } from '../store/useCameraStore';

export default function useDraggableSticker() {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const placedStickers = useCameraStore((state) => state.placedStickers);
  const setPlacedStickers = useCameraStore((state) => state.setPlacedStickers);
  const setShowSlider = useCameraStore((state) => state.setShowSlider);
  const removeSticker = (id) => {
    setPlacedStickers(placedStickers.filter((sticker) => sticker.id !== id));
    setPlacedStickers(placedStickers.filter((sticker) => sticker.id !== id));
    console.log(`placedStickers 개수 ${placedStickers.length}`);
    if (placedStickers.length === 1) {
      setShowSlider(false);
    }
  };
  const lastDistance = useRef(null);
  const currentScale = useRef(1);
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
        pan.extractOffset();
        lastDistance.current = null;
      },
    }),
  ).current;

  return { pan, panResponder, scale, removeSticker };
}
