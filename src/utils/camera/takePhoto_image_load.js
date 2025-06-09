// utils/camera/testEdge.js

import { Image as RNImage } from 'react-native';
import cannyEdgeDetector from 'canny-edge-detector';
import { Image } from 'image-js';

/**
 * 번들된 로컬 이미지에서 Canny 엣지(실루엣)만 뽑아
 * data:image/png;base64,... URI 로 반환합니다.
 */
export async function handleTakePhoto() {
  // 1) 이미지 에셋 참조
  const asset = require('/Users/rio/vanila/kamera/src/assets/images/my-image.png');
  const { uri } = RNImage.resolveAssetSource(asset);
  // uri 예시: 'asset:/my-image.png' 또는 'file:///...'

  // 2) fetch → arrayBuffer → Uint8Array
  const resp = await fetch(uri);
  if (!resp.ok) {
    throw new Error(`이미지 로드 실패: ${resp.status}`);
  }
  const arrayBuffer = await resp.arrayBuffer();
  const u8arr = new Uint8Array(arrayBuffer);

  // 3) image-js 로딩 → 리사이즈 → 그레이 → Canny
  const img = await Image.load(u8arr);
  const small = img.resize({ width: 200 }); // 너비 200px 로 리사이즈
  const grey = small.grey(); // 그레이 스케일
  const edges = cannyEdgeDetector(grey); // Canny 엣지 검출
  const sil = edges.invert(); // 반전(흰 배경에 검은 선)

  // 4) data URI 로 반환 (PNG)
  return sil.toDataURL(); // 'data:image/png;base64,...'
}
