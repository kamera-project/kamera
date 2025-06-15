// utils/useCannyFrameProcessor.js
import { useFrameProcessor } from 'react-native-vision-camera';
import { canny } from 'vision-camera-frame-processor-canny';
import { runOnJS } from 'react-native-reanimated';

/**
 * onMaskReady(maskBuffer: any) 을 JS 레벨로 호출해 줍니다.
 */
export function useCannyFrameProcessor(onMaskReady) {
  return useFrameProcessor((frame) => {
    'worklet';
    const mask = canny(frame, {
      lowThreshold: 30,
      highThreshold: 80,
      gaussianBlur: 3,
    });
    runOnJS(onMaskReady)(mask);
  }, []);
}
