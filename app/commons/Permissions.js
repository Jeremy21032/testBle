import { PermissionsAndroid } from "react-native";
import DeviceInfo from "react-native-device-info";
import { PERMISSIONS, requestMultiple } from "react-native-permissions";

export const requestPermissions = async () => {
    const apiLevel = await DeviceInfo.getApiLevel();
    if (Platform.OS === "android") {
      if (apiLevel < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted;
      } else {
        const result = await requestMultiple(
           [ PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
            PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
        );
  
        const isAllPermissionGranted =
          result['android.permission.BLUETOOTH_CONNECT'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.BLUETOOTH_SCAN'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.ACCESS_FINE_LOCATION'] ===
            PermissionsAndroid.RESULTS.GRANTED;
        console.warn("permissions: ", isAllPermissionGranted);
        return isAllPermissionGranted;
      }
    }
  };
  