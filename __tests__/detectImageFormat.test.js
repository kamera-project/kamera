import { detectImageFormat } from '../src/utils/detectImageFormat';

describe('detectImageFormat()', () => {
  const base64 = 'R0lGOD8-This-Is-A-Text-For-Jest';
  it('base64에 따라 jpeg/png/gif 중 하나를 반환한다. 기본값으로는 jpeg를 반환한다. ', () => {
    expect(detectImageFormat(base64)).toBe('gif');
  });
});
