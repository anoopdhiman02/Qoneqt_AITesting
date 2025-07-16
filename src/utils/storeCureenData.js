import AsyncStorage from '@react-native-async-storage/async-storage';
// Save current date
export const storeDate = async () => {
    const now = new Date().toISOString(); // always use ISO format
    await AsyncStorage.setItem('lastSavedDate', now);
  };

  const isMoreThan24Hours = (oldDateString) => {
    const oldDate = new Date(oldDateString);
    const now = new Date();
  
    const diffInMs = now - oldDate;
    const hours = diffInMs / (1000 * 60 * 60);
    return hours >= 22;
  };
  
  // Get and check if 24 hours passed
  export const checkIf24HoursPassed = async () => {
    const storedDate = await AsyncStorage.getItem('lastSavedDate');
    if (storedDate) {
      const isExpired = isMoreThan24Hours(storedDate);
      return isExpired;
    }
    return false; // If no date saved, treat as expired
  };