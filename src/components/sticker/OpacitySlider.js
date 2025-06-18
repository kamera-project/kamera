import React, { useRef, useState } from 'react';
import { View, Text, PanResponder, StyleSheet } from 'react-native';
import { useStickerStore } from '../../store/useStickerStore';

const SLIDER_HEIGHT = 240;
const THUMB_SIZE = 25;
const TRACK_WIDTH = 8;
const DRAG_RANGE = SLIDER_HEIGHT - THUMB_SIZE;
const SLIDER_SCALE = 1.1;

export default function CustomOpacitySlider() {
  const opacity = useStickerStore((state) => state.opacity);
  const setOpacity = useStickerStore((state) => state.setOpacity);

  const [thumbY, setThumbY] = useState((1 - opacity) * DRAG_RANGE);
  const startY = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startY.current = thumbY;
      },
      onPanResponderMove: (_, { dy }) => {
        let newY = startY.current + dy;
        newY = Math.max(0, Math.min(newY, DRAG_RANGE));
        setThumbY(newY);
        const newOpacity = 1 - newY / DRAG_RANGE;
        setOpacity(Number(newOpacity.toFixed(2)));
      },
    }),
  ).current;

  return (
    <View style={styles.overlay}>
      <View style={styles.sliderWrapper}>
        <Text style={styles.value}>{opacity.toFixed(1) * 100}</Text>
        <View style={[styles.track, { height: SLIDER_HEIGHT }]} />
        <View
          {...panResponder.panHandlers}
          style={[styles.thumb, { top: thumbY + THUMB_SIZE * 0.66 }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: '30%',
    left: '6%',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 20,
    transform: [{ scale: SLIDER_SCALE }],
  },
  label: {
    color: '#FFF',
    marginRight: 4,
    fontWeight: 'bold',
  },
  value: {
    textAlign: 'center',
    left: '25%',
    top: '-1%',
    width: 30,
    color: '#FFF',
    marginRight: 12,
    fontWeight: 'bold',
  },
  sliderWrapper: {
    width: THUMB_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  track: {
    width: TRACK_WIDTH,
    backgroundColor: '#aaa',
    borderRadius: TRACK_WIDTH / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});
