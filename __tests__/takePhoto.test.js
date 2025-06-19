describe('handleTakePhoto()', () => {
  const flash = 'auto';

  it('사진 촬영이 완료되면 photo.path를 반환한다.', async () => {
    const cameraRef = {
      current: {
        takePhoto: jest.fn().mockResolvedValue({
          path: './__tests__/photo.jpg',
        }),
      },
    };

    jest.mock('../src/store/useCameraStore', () => ({
      useCameraStore: {
        getState: () => ({
          isOverlaySwitchOn: true,
          setThumbnailUri: jest.fn(),
        }),
      },
    }));

    jest.mock('@react-native-camera-roll/camera-roll', () => ({
      CameraRoll: {
        saveAsset: jest.fn().mockResolvedValue(true),
      },
    }));

    const { handleTakePhoto } = require('../src/utils/camera/takePhoto');
    const result = await handleTakePhoto(cameraRef, flash);
    expect(result).toBe('./__tests__/photo.jpg');
  });
});
