import * as ImagePicker from "expo-image-picker";
import { useCallback } from "react";

export function useImagePicker() {
  const requestPermission = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === "granted";
  }, []);

  const pickImage = useCallback(
    async (multiImage: boolean = false) => {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        alert("Ứng dụng cần quyền truy cập thư viện ảnh.");
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsMultipleSelection: multiImage,
        selectionLimit: multiImage ? 0 : 1,
        quality: 1,
      });

      if (!result.canceled) {
        return multiImage ? result.assets : result.assets[0];
      }
      return null;
    },
    [requestPermission]
  );

  return { pickImage };
}
