import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { handleTakePhoto } from '../src/utils/camera/takePhoto';

jest.mock('@react-native-camera-roll/camera-roll', () => ({
  CameraRoll: { saveAsset: jest.fn().mockResolvedValue('saved-id') },
}));

const mockCameraRef = () => ({
  current: {
    takePhoto: jest.fn().mockResolvedValue({ path: '/hello/photoTest.jpg' }),
  },
});

describe('사진 촬영 및 저장을 테스트 합니다.', () => {
  afterEach(() => jest.clearAllMocks());
  const cameraRef = mockCameraRef();

  it('사진이 제대로 찍히는지 확인한다.', async () => {
    const result = await handleTakePhoto(cameraRef, 'auto');

    expect(cameraRef.current.takePhoto).toHaveBeenCalledTimes(1);
    expect(result).toBe('/hello/photoTest.jpg');
  });

  it('handleTakePhoto 안에서 saveAsset 이 동작하는지 확인한다.', async () => {
    const cameraRef = mockCameraRef();
    await handleTakePhoto(cameraRef, 'auto');

    expect(CameraRoll.saveAsset).toHaveBeenCalledTimes(1);
    expect(CameraRoll.saveAsset).toHaveBeenCalledWith(
      'file:///hello/photoTest.jpg',
      { type: 'photo' },
    );
  });
});
