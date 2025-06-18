# 📸 Kamera

<div align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=ios&logoColor=white" />
  <!-- <img src="https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white" /> -->
  <img src="https://img.shields.io/badge/MIT-License-yellow?style=for-the-badge" />
</div>

<br />

> **AI 기반 실시간 이미지 처리와 인터랙티브 스티커 기능을 갖춘 차세대 카메라 앱**

<div align="center">
  <img src="./assets/demo.gif" width="300" alt="Kamera Demo" />
</div>

---

## ✨ 핵심 기능

### 🎯 **실시간 이미지 처리**

- **Edge Detection**: Canny 알고리즘 기반 실시간 윤곽선 검출
- **Background Removal**: 흑백 임계값 처리로 배경 투명화
- **Overlay Blending**: 처리된 이미지를 원본에 실시간 오버레이

### 🎨 **인터랙티브 스티커 시스템**

- **Drag & Drop**: 부드러운 팬 제스처로 스티커 이동
- **Pinch to Scale**: 두 손가락 제스처로 크기 조절 (0.5x ~ 5x)
- **Dynamic Positioning**: 스케일에 따라 자동 조정되는 삭제 버튼
- **Multi-Sticker Support**: 여러 스티커 동시 배치 및 개별 제어

### 📱 **스마트 카메라 기능**

- **Dual Camera Support**: 전/후면 카메라 실시간 전환
- **Flash Control**: Auto/On/Off 모드 지원
- **Real-time Preview**: 지연 없는 실시간 프리뷰
- **Gesture Controls**: 탭, 스와이프 등 직관적인 제스처

### 🖼️ **갤러리 & 파일 관리**

- **Smart Gallery**: 최신 사진 자동 썸네일 표시
- **Grid View**: 반응형 그리드 레이아웃

---

## 🚀 시작하기

### 필수 요구사항

- Node.js >= 18.0.0
- React Native >= 0.74.0
- iOS >= 13.0
- Xcode >= 15.0 (iOS 개발 시)

### 설치

```bash
# 저장소 클론
git clone https://github.com/kamera-project/kamera.git
cd kamera

# 의존성 설치
npm install

# iOS 의존성 설치 (M1/M2 Mac)
cd ios && pod install && cd ..

# 개발 서버 실행
npm start

# 앱 실행
npm run ios     # iOS
npm run android # Android
```

---

## 🏗️ 프로젝트 구조

```
kamera/
├── 📱 src/
│   ├── 🎨 components/          # UI 컴포넌트
│   │   ├── camera/
│   │   │   └── DraggableSticker.js    # 드래그 가능한 스티커
│   │   ├── footer/
│   │   │   └── Footer.js              # 하단 액션 바
│   │   ├── gallery/
│   │   │   └── GalleryScreen.js       # 갤러리 화면
│   │   └── header/
│   │       └── Header.js              # 상단 툴바
│   │
│   ├── 🪝 hooks/               # 커스텀 React Hooks
│   │   └── useDraggableSticker.js     # 스티커 제어 로직
│   │
│   ├── 📱 screens/             # 화면 컴포넌트
│   │   ├── CameraScreen.js            # 메인 카메라 화면
│   │   └── GalleryScreen.js           # 갤러리 뷰
│   │
│   ├── 🗄️ store/              # 상태 관리 (Zustand)
│   │   └── useCameraStore.js          # 전역 상태 저장소
│   │
│   └── 🛠️ utils/              # 유틸리티 함수
│       ├── camera/
│       │   └── takePhoto.js           # 사진 촬영 로직
│       └── overlay/
│           └── transparentProcessor.js # 투명도 처리
│
├── 📦 package.json
└── 📖 README.md
```

---

## 🔧 기술 스택

### Core

- **React Native 0.74** - Cross-platform 모바일 프레임워크
- **React 18.3** - UI 라이브러리
- **Zustand** - 경량 상태 관리

### Camera & Media

- **react-native-vision-camera** - 고성능 카메라 API
- **react-native-webview** - 웹 기반 이미지 처리
- **@react-native-camera-roll/camera-roll** - 갤러리 접근

---

## 📸 주요 코드 예시

### 스티커 드래그 & 스케일

```javascript
// 커스텀 훅 사용
const { pan, scale, panResponder, removeSticker } = useDraggableSticker(id);

// 제스처 처리
onPanResponderMove: (evt, gestureState) => {
  const touches = evt.nativeEvent.touches;
  if (touches.length === 1) {
    // 드래그
    pan.setValue({ x: gestureState.dx, y: gestureState.dy });
  } else if (touches.length === 2) {
    // 핀치 줌
    const newScale = calculateScale(touches);
    scale.setValue(newScale);
  }
};
```

### 이미지 오버레이 처리

```javascript
// WebView를 통한 Canvas 처리
const transparentProcessorHTML = `
  <canvas id="canvas"></canvas>
  <script>
    // Canny Edge Detection
    const edges = cv.Canny(src, 50, 150);
    // 투명도 적용
    const transparent = applyTransparency(edges);
  </script>
`;
```

### 사진 촬영 및 저장

```javascript
const handleTakePhoto = async () => {
  const photo = await cameraRef.current.takePhoto({
    flash: flashMode,
    qualityPrioritization: 'quality',
  });

  // 스티커와 함께 합성
  await CameraRoll.saveAsset(finalImage);
};
```

---

## 🎯 로드맵

### Phase 1 (완료) ✅

- [x] 기본 카메라 기능 구현
- [x] 드래그 가능한 스티커 시스템
- [x] 실시간 이미지 필터링
- [x] 갤러리 통합

### Phase 2 (예정) 🚧

- [ ] 앱스토어 배포
- [ ] 카카오톡 공유 연동
- [ ] 커스텀 스티커 업로드
- [ ] 필터 프리셋 저장

---

## 🤝 기여하기

### 개발 환경 설정

```bash
# 개발 브랜치 생성
git checkout -b feature/your-feature-name

# 코드 품질 검사
npm run lint

# 테스트 실행
npm test

# 빌드 확인
npm run build
```

### 기여 가이드라인

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 커밋 컨벤션

- `Feat:` 새로운 기능 추가
- `Fix:` 버그 수정
- `Docs:` 문서 수정
- `Style:` 코드 포맷팅, 세미콜론 누락 등
- `Refactor:` 코드 리팩토링
- `Test:` 테스트 코드 추가
- `Chore:` 빌드 업무, 패키지 매니저 수정 등

---

## 📱 스크린샷

<div align="center">
  <img src="./assets/screenshot1.png" width="200" alt="메인 카메라" />
  <img src="./assets/screenshot2.png" width="200" alt="스티커 편집" />
  <img src="./assets/screenshot3.png" width="200" alt="갤러리 뷰" />
  <img src="./assets/screenshot4.png" width="200" alt="이미지 필터" />
</div>

---

## 📄 라이선스

MIT License

Copyright (c) 2025 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

---

## 👥 팀

- **[Bob 오혜성]** - _Initial work_ - [GitHub](https://github.com/your-username)
- **[Rio 성경식]** - _Initial work_ - [GitHub](https://github.com/your-username)

---

📚 참고 자료

- React Native Vision Camera 문서
- Zustand 공식 가이드
- 이미지 처리 알고리즘 참고

---

<div align="center">
  <h3>🚀 Kamera를 사용해주셔서 감사합니다!</h3>
  <p>더 나은 카메라 앱을 만들기 위해 계속 노력하겠습니다.</p>
  <br />
  <a href="https://github.com/your-username/kamera/stargazers">
    <img src="https://img.shields.io/github/stars/your-username/kamera?style=for-the-badge" alt="Stars" />
  </a>
  <a href="https://github.com/your-username/kamera/network/members">
    <img src="https://img.shields.io/github/forks/your-username/kamera?style=for-the-badge" alt="Forks" />
  </a>
  <a href="https://github.com/your-username/kamera/issues">
    <img src="https://img.shields.io/github/issues/your-username/kamera?style=for-the-badge" alt="Issues" />
  </a>
  <br />
  <br />
  <p>Made with ❤️ and ☕ by the Kamera Team</p>
</div>
