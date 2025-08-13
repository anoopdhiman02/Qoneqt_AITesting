import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSimpleAppLaunch } from '../../utils/SimpleAppLaunchManager';
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

  // Error state
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

  // Loading state
  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  // Waiting for user state
  if (!userId) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.waitingText}>
          Waiting for authentication...
        </Text>
      </View>
    );
  }

  // Check if children exist before rendering
  if (!children) {
    console.warn('AppInitializer: No children provided');
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>
          No content to display
        </Text>
      </View>
    );
  }

  // Render children when ready
  return <>{children}</>;
};

// Default props to prevent undefined errors
AppInitializer.defaultProps = {
  children: null,
  onInitialize: () => {
    console.log('No initialization function provided');
  },
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    textAlign: 'center',
  },
  waitingText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    textAlign: 'center',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default AppInitializer;

// Alternative: Render Props Pattern Version
export const AppInitializerWithRenderProps = ({ onInitialize, render, fallback }) => {
  const userId = useAppStore(state => state.userId);
  const { isLaunched, isInitializing, initializeApp, error } = useSimpleAppLaunch(userId);

  useEffect(() => {
    if (!userId) return;

    if (!isLaunched && !isInitializing) {
      console.log(`🏁 Initializing app for user: ${userId}`);
      initializeApp(onInitialize);
    }
  }, [userId, isLaunched, isInitializing, initializeApp, onInitialize]);

  // Return loading states
  if (error || isInitializing || !userId) {
    return fallback ? fallback({ error, isInitializing, userId }) : (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>
          {error ? `Error: ${error}` : isInitializing ? 'Loading...' : 'Waiting for auth...'}
        </Text>
      </View>
    );
  }

  // Render content when ready
  return render ? render({ userId, isLaunched }) : null;
};

// Hook Version for more flexibility
export const useAppInitialization = () => {
  const userId = useAppStore(state => state.userId);
  const launchState = useSimpleAppLaunch(userId);
  const [initializationFunction, setInitializationFunction] = useState(null);

  const initialize = (initFn) => {
    setInitializationFunction(() => initFn);
  };

  useEffect(() => {
    if (!userId || !initializationFunction) return;

    if (!launchState.isLaunched && !launchState.isInitializing) {
      console.log(`🏁 Initializing app for user: ${userId}`);
      launchState.initializeApp(initializationFunction);
    }
  }, [userId, launchState, initializationFunction]);

  return {
    ...launchState,
    initialize,
    isReady: launchState.isLaunched && userId && !launchState.error,
  };
};

// Simple Wrapper Component
export const SimpleAppWrapper = ({ children, initializeFunction }) => {
  const { isReady, error, isInitializing, initialize } = useAppInitialization();

  // Set initialization function
  useEffect(() => {
    if (initializeFunction) {
      initialize(initializeFunction);
    }
  }, [initializeFunction, initialize]);

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>
          {isInitializing ? 'Loading...' : 'Waiting...'}
        </Text>
      </View>
    );
  }

  return children;
};