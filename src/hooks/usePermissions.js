import { useState, useCallback } from 'react';
import { request, openSettings, PERMISSIONS } from 'react-native-permissions';

export function usePhotoPermission() {
  const [photoPermissionStatus, setPhotoPermissionStatus] = useState(null);

  const requestGalleryPermissions = useCallback(async () => {
    const state = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    setPhotoPermissionStatus(state);
    return state;
  }, []);

  const openAppSettings = () => openSettings();

  return { photoPermissionStatus, requestGalleryPermissions, openAppSettings };
}
