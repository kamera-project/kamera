import { useState, useCallback, useEffect } from 'react';
import {
  request,
  openSettings,
  PERMISSIONS,
  check,
} from 'react-native-permissions';

export function usePhotoPermission() {
  const [photoPermissionStatus, setPhotoPermissionStatus] = useState(null);

  const refresh = useCallback(async () => {
    const state = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
    setPhotoPermissionStatus(state);
    return state;
  }, []);

  const requestGalleryPermissions = useCallback(async () => {
    const state = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    setPhotoPermissionStatus(state);
    return state;
  }, []);

  const openAppSettings = () => openSettings();

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    photoPermissionStatus,
    requestGalleryPermissions,
    openAppSettings,
    refresh,
  };
}
