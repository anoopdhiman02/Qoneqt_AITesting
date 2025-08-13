
import { InteractionManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';

// Simple storage helpers that only use individual operations
const StorageHelper = {
  async safeGet(key) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.warn(`Error getting ${key}:`, error);
      return null;
    }
  },

  async safeSet(key, value) {
    try {
      await AsyncStorage.setItem(key, String(value || ''));
      return true;
    } catch (error) {
      console.warn(`Error setting ${key}:`, error);
      return false;
    }
  },

  async safeRemove(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing ${key}:`, error);
      return false;
    }
  },

  async removeMultiple(keys) {
    const results = [];
    for (const key of keys) {
      const result = await this.safeRemove(key);
      results.push(result);
    }
    return results;
  }
};

class SimpleAppLaunchManager {
  static instance = null;
  
  constructor() {
    this.isAppLaunched = false;
    this.isInitializing = false;
    this.initializationPromise = null;
    this.currentUserId = null;
    this.LAUNCH_FLAG_KEY = '@app_launched_flag';
    this.SESSION_KEY = '@app_session_id';
    this.USER_ID_KEY = '@current_user_id';
  }
  
  static getInstance() {
    if (!SimpleAppLaunchManager.instance) {
      SimpleAppLaunchManager.instance = new SimpleAppLaunchManager();
    }
    return SimpleAppLaunchManager.instance;
  }

  async isFreshLaunchOrUserChanged(userId) {
    try {
      console.log(`🔍 Checking launch status for user: ${userId}`);
      
      const currentSessionId = Date.now().toString();
      
      // Get stored values individually
      const lastSessionId = await StorageHelper.safeGet(this.SESSION_KEY);
      const lastUserId = await StorageHelper.safeGet(this.USER_ID_KEY);
      
      console.log(`📊 Last session: ${lastSessionId}, Last user: ${lastUserId}`);
      
      const userIdChanged = lastUserId !== String(userId);
      const isFreshSession = !lastSessionId;
      
      if (isFreshSession || userIdChanged) {
        console.log(`🔄 Fresh launch or user changed: Fresh=${isFreshSession}, UserChanged=${userIdChanged}`);
        
        // Set new values individually
        await StorageHelper.safeSet(this.SESSION_KEY, currentSessionId);
        await StorageHelper.safeSet(this.USER_ID_KEY, userId);
        
        if (userIdChanged) {
          console.log(`👤 User ID changed from ${lastUserId} to ${userId}`);
          this.currentUserId = userId;
          this.isAppLaunched = false;
          this.isInitializing = false;
          this.initializationPromise = null;
        }
        
        return true;
      }
      
      console.log(`✅ No change detected, skipping initialization`);
      return false;
    } catch (error) {
      console.error('Error checking fresh launch or user change:', error);
      return true; // Force initialization on error
    }
  }

  async initializeApp(userId, initFunction) {
    console.log(`🚀 Initialize app called for user: ${userId}`);
    
    if (!userId) {
      console.log('❌ No userId provided');
      return Promise.resolve();
    }

    const shouldInitialize = await this.isFreshLaunchOrUserChanged(userId);
    
    if (!shouldInitialize && this.isAppLaunched && this.currentUserId === userId) {
      console.log('✅ App already initialized for current user');
      return Promise.resolve();
    }

    if (this.isInitializing && this.currentUserId === userId && this.initializationPromise) {
      console.log('⏳ App initialization in progress for current user, waiting...');
      return this.initializationPromise;
    }

    this.currentUserId = userId;
    this.isInitializing = true;
    this.initializationPromise = this.performInitialization(initFunction);
    
    return this.initializationPromise;
  }

  async performInitialization(initFunction) {
    try {
      console.log(`🏁 Starting app initialization for user: ${this.currentUserId}...`);
      
      await StorageHelper.safeSet(this.LAUNCH_FLAG_KEY, 'true');
      
      await new Promise(resolve => {
        InteractionManager.runAfterInteractions(() => {
          setTimeout(resolve, 100);
        });
      });

      await initFunction();
      
      this.isAppLaunched = true;
      this.isInitializing = false;
      
      console.log(`✅ App initialization completed for user: ${this.currentUserId}`);
      
    } catch (error) {
      console.error('❌ App initialization failed:', error);
      
      this.isAppLaunched = false;
      this.isInitializing = false;
      await StorageHelper.safeRemove(this.LAUNCH_FLAG_KEY);
      
      throw error;
    }
  }

  async forceReinitialize(userId, initFunction) {
    console.log(`🔄 Force re-initializing for user: ${userId}`);
    
    this.isAppLaunched = false;
    this.isInitializing = false;
    this.initializationPromise = null;
    this.currentUserId = userId;
    
    // Remove items individually
    await StorageHelper.removeMultiple([
      this.LAUNCH_FLAG_KEY,
      this.SESSION_KEY,
      this.USER_ID_KEY
    ]);
    
    return this.initializeApp(userId, initFunction);
  }

  async reset() {
    console.log('🧹 Resetting app launch manager');
    
    this.isAppLaunched = false;
    this.isInitializing = false;
    this.initializationPromise = null;
    this.currentUserId = null;
    
    // Remove items individually
    await StorageHelper.removeMultiple([
      this.LAUNCH_FLAG_KEY,
      this.SESSION_KEY,
      this.USER_ID_KEY
    ]);
    
    console.log('✅ App launch manager reset completed');
  }

  getStatus() {
    return {
      isAppLaunched: this.isAppLaunched,
      isInitializing: this.isInitializing,
      currentUserId: this.currentUserId,
    };
  }
}

export const simpleAppLaunchManager = SimpleAppLaunchManager.getInstance();

// React Hook for Simple App Launch Management
export const useSimpleAppLaunch = (userId) => {
  const [isLaunched, setIsLaunched] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const initializeApp = useCallback(async (initFunction) => {
    if (!userId) {
      console.log('❌ No userId provided, skipping initialization');
      return;
    }

    try {
      setError(null);
      setIsInitializing(true);
      
      await simpleAppLaunchManager.initializeApp(userId, initFunction);
      
      setIsLaunched(true);
      setIsInitializing(false);
      setCurrentUserId(userId);
    } catch (err) {
      console.error('❌ App launch initialization failed:', err);
      setError(err instanceof Error ? err.message : 'Initialization failed');
      setIsInitializing(false);
    }
  }, [userId]);

  const forceReinitialize = useCallback(async (initFunction) => {
    if (!userId) {
      console.log('❌ No userId provided, skipping force re-initialization');
      return;
    }

    try {
      setError(null);
      setIsInitializing(true);
      
      await simpleAppLaunchManager.forceReinitialize(userId, initFunction);
      
      setIsLaunched(true);
      setIsInitializing(false);
      setCurrentUserId(userId);
    } catch (err) {
      console.error('❌ Force re-initialization failed:', err);
      setError(err instanceof Error ? err.message : 'Re-initialization failed');
      setIsInitializing(false);
    }
  }, [userId]);

  const resetLaunch = useCallback(async () => {
    try {
      await simpleAppLaunchManager.reset();
      setIsLaunched(false);
      setIsInitializing(false);
      setError(null);
      setCurrentUserId(null);
    } catch (err) {
      console.error('❌ Error resetting launch:', err);
      setError('Reset failed');
    }
  }, []);

  useEffect(() => {
    const status = simpleAppLaunchManager.getStatus();
    
    if (status.currentUserId && status.currentUserId !== userId && userId) {
      console.log(`👤 User ID changed detected: ${status.currentUserId} → ${userId}`);
      setIsLaunched(false);
      setIsInitializing(false);
      setCurrentUserId(userId);
    } else {
      setIsLaunched(status.isAppLaunched);
      setIsInitializing(status.isInitializing);
      setCurrentUserId(status.currentUserId);
    }
  }, [userId]);

  return {
    isLaunched,
    isInitializing,
    error,
    currentUserId,
    initializeApp,
    forceReinitialize,
    resetLaunch,
    userIdChanged: currentUserId !== userId,
  };
};

// Simple API Manager Class
class SimpleAPIManager {
  constructor() {
    this.apiCallStatus = new Map();
    this.currentUserId = null;
  }
  
  setUserId(userId) {
    if (this.currentUserId !== String(userId)) {
      console.log(`🔄 API Manager: User ID changed from ${this.currentUserId} to ${userId}`);
      this.resetAllAPIs();
      this.currentUserId = String(userId);
    }
  }

  async callAPI(apiName, apiFunction, options = {}) {
    const { forceRefresh = false, retryOnError = true, userId } = options;
    
    if (userId && this.currentUserId !== String(userId)) {
      this.setUserId(userId);
    }
    
    const statusKey = `${apiName}_${this.currentUserId}`;
    const status = this.apiCallStatus.get(statusKey);
    
    if (status?.called && !forceRefresh && !status.error) {
      console.log(`✅ ${apiName} already called successfully for user ${this.currentUserId}, skipping`);
      return null;
    }

    if (status?.calling) {
      console.log(`⏳ ${apiName} currently being called for user ${this.currentUserId}, skipping`);
      return null;
    }

    if (status?.error && !retryOnError) {
      console.log(`❌ ${apiName} has previous error and retry disabled, skipping`);
      return null;
    }

    this.apiCallStatus.set(statusKey, { 
      called: false, 
      calling: true, 
      userId: this.currentUserId 
    });

    try {
      console.log(`📡 Calling ${apiName} for user ${this.currentUserId}...`);
      const result = await apiFunction();
      
      this.apiCallStatus.set(statusKey, { 
        called: true, 
        calling: false, 
        userId: this.currentUserId 
      });
      console.log(`✅ ${apiName} completed successfully for user ${this.currentUserId}`);
      
      return result;
    } catch (error) {
      console.error(`❌ ${apiName} failed for user ${this.currentUserId}:`, error);
      
      this.apiCallStatus.set(statusKey, { 
        called: false, 
        calling: false, 
        error,
        userId: this.currentUserId 
      });
      
      throw error;
    }
  }

  resetAllAPIs() {
    console.log('🧹 Resetting all API calls for new user');
    this.apiCallStatus.clear();
  }

  resetAPI(apiName) {
    const statusKey = `${apiName}_${this.currentUserId}`;
    this.apiCallStatus.delete(statusKey);
  }

  getAllStatuses() {
    return Object.fromEntries(this.apiCallStatus);
  }
}

export const simpleAPIManager = new SimpleAPIManager();