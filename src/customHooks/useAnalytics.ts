import { useCallback, useEffect } from 'react';
import { usePathname } from 'expo-router';
import analytics from '@react-native-firebase/analytics';

export function useScreenTracking(screenName) {
  const pathname = usePathname();

  useEffect(() => {
    const logScreenView = async () => {
      const name = screenName || pathname.replace('/', '') || 'index';
      
      await analytics().logScreenView({
        screen_name: name,
        screen_class: name,
      });
    };

    logScreenView();
  }, [pathname, screenName]);
}

export const logEvent = async (eventName, params = {}) => {
  try {
    await analytics().logEvent(eventName, params);
    console.log(`Logged event: ${eventName}`, params);
  } catch (error) {
    console.error(`Failed to log event: ${eventName}`, error);
  }
};