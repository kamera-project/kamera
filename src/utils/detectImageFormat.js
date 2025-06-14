export const detectImageFormat = (base64) => {
  if (base64.startsWith('/9j/')) return 'jpeg';
  if (base64.startsWith('iVBORw0KGgo')) return 'png';
  if (base64.startsWith('R0lGOD')) return 'gif';
  return 'jpeg';
};
