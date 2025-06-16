import { useState, useCallback } from 'react';
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
} from 'react-native-permissions';

export function usePhotoPermission() {
  const [status, setStatus] = useState(null);

  const refresh = useCallback(async () => {
    const state = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
    setStatus(state);
    return state;
  }, []);

  const ask = useCallback(async () => {
    const state = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    setStatus(state);
    return state;
  }, []);

  const goToSettings = () => openSettings();

  return { status, refresh, ask, goToSettings };
}
