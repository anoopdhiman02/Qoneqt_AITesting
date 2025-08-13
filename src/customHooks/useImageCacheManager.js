import { useEffect } from 'react';
import { AppState } from 'react-native';
import { clearImageDimensionsCache, getCacheStats } from '../utils/ImageHelper';

export const useImageCacheManager = () => {
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background') {
        clearImageDimensionsCache();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Cleanup on unmount
    return () => {
      subscription?.remove();
      const stats = getCacheStats();
      if (stats.size > 20) {
        clearImageDimensionsCache();
      }
    };
  }, []);
};