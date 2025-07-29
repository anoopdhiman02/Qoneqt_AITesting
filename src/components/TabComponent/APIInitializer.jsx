import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useSimpleAppLaunch } from '../../utils/SimpleAppLaunchManager'; // Use simple version
import { useAppStore } from '@/zustand/zustandStore';

const AppInitializer = ({ children, onInitialize }) => {
  const userId = useAppStore(state => state.userId);
  const { isLaunched, isInitializing, initializeApp, error } = useSimpleAppLaunch(userId);

  useEffect(() => {
    if (!userId) {
      console.log('⏳ Waiting for userId...');
      return;
    }

    if (!isLaunched && !isInitializing) {
      console.log(`🏁 Initializing app for user: ${userId}`);
      initializeApp(onInitialize);
    }
  }, [userId, isLaunched, isInitializing, initializeApp, onInitialize]);

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>
          Initialization failed: {error}
        </Text>
        <Text style={styles.waitingText}>
          Please restart the app
        </Text>
      </View>
    );
  }

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.waitingText}>
          Waiting for authentication...
        </Text>
      </View>
    );
  }

  return children;
};

const styles = {
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
  },
  waitingText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    textAlign: 'center',
    marginBottom: 8,
  },
};

export default AppInitializer;