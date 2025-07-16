import React, { useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import notifee, { EventType } from '@notifee/react-native';

const NotificationManager = ({ onNotificationReceived, onNotificationPressed }) => {
  const hasSetupListeners = useRef(false);
  const unsubscribeRefs = useRef([]);
  const notifDataRef = useRef(null);

  const sendNotification = useCallback(async (remoteMessage) => {
    try {
      const title = remoteMessage.notification?.title || 'New Notification';
      const body = remoteMessage.notification?.body || 'You have a new message!';
      const data = remoteMessage.data || {};

      if (Platform.OS === 'ios') {
        await notifee.displayNotification({
          title,
          body,
          data,
          ios: { categoryId: 'post' },
        });
      } else {
        await Notifications.scheduleNotificationAsync({
          content: { title, body, sound: 'default', data },
          trigger: null,
        });
      }
    } catch (error) {
      console.error('Notification display error:', error);
    }
  }, []);

  const notificationHandler = useCallback(async (remoteMessage) => {
    if (!remoteMessage?.type) {
      console.log('No notification type, skipping');
      return;
    }

    try {
      console.log("Processing notification:", remoteMessage.type);
      onNotificationPressed?.(remoteMessage);
    } catch (error) {
      console.error('Notification handler error:', error);
    }
  }, [onNotificationPressed]);

  useEffect(() => {
    if (hasSetupListeners.current) return;

    const setupNotificationListeners = () => {
      console.log('📱 Setting up notification listeners...');
      hasSetupListeners.current = true;

      // Firebase messaging - foreground messages
      const unsubscribeMessage = messaging().onMessage(async (remoteMessage) => {
        console.log('Received foreground message:', remoteMessage?.messageId);
        
        if (remoteMessage?.messageId && 
            notifDataRef.current?.messageId === remoteMessage.messageId) {
          console.log('Duplicate message ID, skipping');
          return;
        }
        
        notifDataRef.current = remoteMessage;
        onNotificationReceived?.(remoteMessage);
      });

      // Expo notifications - when user taps notification
      const subscriptionResponse = Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response?.notification?.request?.content;
        if (data?.data) {
          console.log('Notification response received:', data.data.type);
          notificationHandler(data.data);
        }
      });

      // Notifee foreground events
      const unsubscribeForeground = notifee.onForegroundEvent(({ type, detail }) => {
        switch (type) {
          case EventType.DISMISSED:
            console.log('User dismissed notification', detail.notification?.id);
            break;
          case EventType.PRESS:
            if (detail?.notification?.data) {
              console.log('Notifee notification pressed:', detail.notification.data.type);
              notificationHandler(detail.notification.data);
            }
            break;
        }
      });

      unsubscribeRefs.current = [
        unsubscribeMessage,
        () => subscriptionResponse.remove(),
        unsubscribeForeground
      ];
    };

    setupNotificationListeners();

    return () => {
      unsubscribeRefs.current.forEach(unsubscribe => {
        try {
          unsubscribe();
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      });
      unsubscribeRefs.current = [];
      hasSetupListeners.current = false;
    };
  }, [onNotificationReceived, notificationHandler]);

  return null; // This component doesn't render anything
};

export default NotificationManager;