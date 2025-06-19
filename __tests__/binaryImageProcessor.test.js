import { binaryImageProcessor } from '../src/utils/overlay/binaryImageProcessor';

jest.mock('react-native-fs', () => ({
  readFile: jest.fn().mockResolvedValue('./photo.png'),
}));

jest.mock('react-native-fast-opencv', () => ({
  OpenCV: {
    base64ToMat: jest.fn().mockReturnValue('mock-src-mat'),
    createObject: jest.fn().mockReturnValue('mock-mat'),
    invoke: jest.fn(),
    toJSValue: jest.fn().mockReturnValue({
      base64: 'iVBORw0KGgoAAAANSUh60e6kgAAAABJRU5ErkJggg==',
    }),
    clearBuffers: jest.fn(),
  },
  ObjectType: {
    Mat: 'Mat',
  },
  DataTypes: {
    CV_8UC4: 'CV_8UC4',
    CV_8U: 'CV_8U',
  },
}));

describe('binaryImageProcessor', () => {
  it('Canny Edge 검출 결과 후 반환값의 base64 에는 iVBORw0K이 포함되어있어야한다.', async () => {
    const mockPhotoPath = '/path/to/photo.jpg';
    const result = await binaryImageProcessor(mockPhotoPath);
    expect(result).toContain('iVBORw0K');
  });
});
