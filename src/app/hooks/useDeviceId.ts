import { getUniqueId } from 'react-native-device-info';


export default async function useDeviceId() {
    const deviceId =  getUniqueId();
    return deviceId;
}