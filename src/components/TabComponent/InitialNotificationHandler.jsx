import React, { useEffect, useMemo } from 'react';
import { getPrefsValue, setPrefsValue } from '@/utils/storage';

const InitialNotificationHandler = ({ userId, isLaunched, onNotificationHandled }) => {
  // Memoize new data check
  const newData = useMemo(() => {
    return getPrefsValue("message");
  }, []);

  useEffect(() => {
    if (!newData || !isLaunched || !userId) return;

    const handleInitialNotification = async () => {
      try {
        console.log('Processing initial notification for user:', userId);
        
        const initialNotifications = JSON.parse(newData);
        
        // Call the handler passed from parent
        onNotificationHandled?.(initialNotifications);
        
        // Clear the message
        await setPrefsValue('message', '');
      } catch (error) {
        console.error('Initial notification handling error:', error);
        await setPrefsValue('message', '');
      }
    };

    const timer = setTimeout(handleInitialNotification, 1000);
    return () => clearTimeout(timer);
  }, [newData, isLaunched, userId, onNotificationHandled]);

  return null; // This component doesn't render anything
};

export default InitialNotificationHandler;