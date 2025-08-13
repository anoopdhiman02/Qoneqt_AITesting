
import { InteractionManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';

class AppLaunchManager {
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
    if (!AppLaunchManager.instance) {
      AppLaunchManager.instance = new AppLaunchManager();
    }
    return AppLaunchManager.instance;
  }

  async isFreshLaunchOrUserChanged(userId) {
    try {
      const currentSessionId = Date.now().toString();
      
      // Get items individually to avoid any array issues
      const lastSessionId = await AsyncStorage.getItem(this.SESSION_KEY);
      const lastUserId = await AsyncStorage.getItem(this.USER_ID_KEY);
      
      const userIdChanged = lastUserId !== userId;
      const isFreshSession = !lastSessionId;
      
      if (isFreshSession || userIdChanged) {
        // Set items individually to avoid multiSet issues
        try {
          await AsyncStorage.setItem(this.SESSION_KEY, currentSessionId);
          await AsyncStorage.setItem(this.USER_ID_KEY, userId ? String(userId) : '');
        } catch (setError) {
          console.warn('Error setting storage items:', setError);
          // Continue even if storage fails
        }
        
        if (userIdChanged) {
          console.log(`👤 User ID changed from ${lastUserId} to ${userId}`);
          this.currentUserId = userId;
          this.isAppLaunched = false;
          this.isInitializing = false;
          this.initializationPromise = null;
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking fresh launch or user change:', error);
      // Return true to force initialization on error
      return true;
    }
  }

  async initializeApp(userId, initFunction) {
    const shouldInitialize = await this.isFreshLaunchOrUserChanged(userId);
    
    if (!shouldInitialize && this.isAppLaunched && this.currentUserId === userId) {
      console.log('App already initialized for current user');
      return Promise.resolve();
    }

    if (this.isInitializing && this.currentUserId === userId && this.initializationPromise) {
      console.log('App initialization in progress for current user, waiting...');
      return this.initializationPromise;
    }

    this.currentUserId = userId;
    this.isInitializing = true;
    this.initializationPromise = this.performInitialization(initFunction);
    
    return this.initializationPromise;
  }

  async performInitialization(initFunction) {
    try {
      console.log(`🚀 Starting app initialization for user: ${this.currentUserId}...`);
      
      await AsyncStorage.setItem(this.LAUNCH_FLAG_KEY, 'true');
      
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
      console.error('App initialization failed:', error);
      
      this.isAppLaunched = false;
      this.isInitializing = false;
      await AsyncStorage.removeItem(this.LAUNCH_FLAG_KEY);
      
      throw error;
    }
  }

  async forceReinitialize(userId, initFunction) {
    console.log(`🔄 Force re-initializing for user: ${userId}`);
    
    this.isAppLaunched = false;
    this.isInitializing = false;
    this.initializationPromise = null;
    this.currentUserId = userId;
    
    // Remove items individually to avoid multiRemove issues
    try {
      await AsyncStorage.removeItem(this.LAUNCH_FLAG_KEY);
      await AsyncStorage.removeItem(this.SESSION_KEY);
      await AsyncStorage.removeItem(this.USER_ID_KEY);
    } catch (error) {
      console.warn('Error clearing storage during force reinitialize:', error);
    }
    
    return this.initializeApp(userId, initFunction);
  }

  async reset() {
    this.isAppLaunched = false;
    this.isInitializing = false;
    this.initializationPromise = null;
    this.currentUserId = null;
    
    // Remove items individually to avoid multiRemove issues
    try {
      await AsyncStorage.removeItem(this.LAUNCH_FLAG_KEY);
      await AsyncStorage.removeItem(this.SESSION_KEY);
      await AsyncStorage.removeItem(this.USER_ID_KEY);
    } catch (error) {
      console.warn('Error clearing storage during reset:', error);
    }
    
    console.log('App launch manager reset');
  }

  getStatus() {
    return {
      isAppLaunched: this.isAppLaunched,
      isInitializing: this.isInitializing,
      currentUserId: this.currentUserId,
    };
  }
}

export const appLaunchManager = AppLaunchManager.getInstance();

// React Hook for App Launch Management
export const useAppLaunch = (userId) => {
  const [isLaunched, setIsLaunched] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const initializeApp = useCallback(async (initFunction) => {
    if (!userId) {
      console.log('No userId provided, skipping initialization');
      return;
    }

    try {
      setError(null);
      setIsInitializing(true);
      
      await appLaunchManager.initializeApp(userId, initFunction);
      
      setIsLaunched(true);
      setIsInitializing(false);
      setCurrentUserId(userId);
    } catch (err) {
      console.error('App launch initialization failed:', err);
      setError(err instanceof Error ? err.message : 'Initialization failed');
      setIsInitializing(false);
    }
  }, [userId]);

  const forceReinitialize = useCallback(async (initFunction) => {
    if (!userId) {
      console.log('No userId provided, skipping force re-initialization');
      return;
    }

    try {
      setError(null);
      setIsInitializing(true);
      
      await appLaunchManager.forceReinitialize(userId, initFunction);
      
      setIsLaunched(true);
      setIsInitializing(false);
      setCurrentUserId(userId);
    } catch (err) {
      console.error('Force re-initialization failed:', err);
      setError(err instanceof Error ? err.message : 'Re-initialization failed');
      setIsInitializing(false);
    }
  }, [userId]);

  const resetLaunch = useCallback(async () => {
    try {
      await appLaunchManager.reset();
      setIsLaunched(false);
      setIsInitializing(false);
      setError(null);
      setCurrentUserId(null);
    } catch (err) {
      console.error('Error resetting launch:', err);
      setError('Reset failed');
    }
  }, []);

  useEffect(() => {
    const status = appLaunchManager.getStatus();
    
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

// API Manager Class
class AppLaunchAPIManager {
  constructor() {
    this.apiCallStatus = new Map();
    this.currentUserId = null;
  }
  
  setUserId(userId) {
    if (this.currentUserId !== userId) {
      console.log(`🔄 API Manager: User ID changed from ${this.currentUserId} to ${userId}`);
      this.resetAllAPIs();
      this.currentUserId = userId;
    }
  }

  async callAPI(apiName, apiFunction, options = {}) {
    const { forceRefresh = false, retryOnError = true, userId } = options;
    
    if (userId && this.currentUserId !== userId) {
      this.setUserId(userId);
    }
    
    const status = this.apiCallStatus.get(apiName);
    const isNewUser = status?.userId && status.userId !== this.currentUserId;
    
    if (status?.called && !forceRefresh && !status.error && !isNewUser) {
      console.log(`${apiName} already called successfully for user ${this.currentUserId}, skipping`);
      return null;
    }

    if (status?.calling && !isNewUser) {
      console.log(`${apiName} currently being called for user ${this.currentUserId}, skipping`);
      return null;
    }

    if (status?.error && !retryOnError && !isNewUser) {
      console.log(`${apiName} has previous error and retry disabled, skipping`);
      return null;
    }

    this.apiCallStatus.set(apiName, { 
      called: false, 
      calling: true, 
      userId: this.currentUserId 
    });

    try {
      console.log(`📡 Calling ${apiName} for user ${this.currentUserId}...`);
      const result = await apiFunction();
      
      this.apiCallStatus.set(apiName, { 
        called: true, 
        calling: false, 
        userId: this.currentUserId 
      });
      console.log(`✅ ${apiName} completed successfully for user ${this.currentUserId}`);
      
      return result;
    } catch (error) {
      console.error(`❌ ${apiName} failed for user ${this.currentUserId}:`, error);
      
      this.apiCallStatus.set(apiName, { 
        called: false, 
        calling: false, 
        error,
        userId: this.currentUserId 
      });
      
      throw error;
    }
  }

  wasAPICalled(apiName, userId) {
    const status = this.apiCallStatus.get(apiName);
    const checkUserId = userId || this.currentUserId;
    return status?.called && status?.userId === checkUserId || false;
  }

  resetAPI(apiName) {
    this.apiCallStatus.delete(apiName);
  }

  resetAllAPIs() {
    console.log('🧹 Resetting all API calls for new user');
    this.apiCallStatus.clear();
  }

  resetAPIsForUser(userId) {
    console.log(`🧹 Resetting API calls for user: ${userId}`);
    
    for (const [apiName, status] of this.apiCallStatus.entries()) {
      if (status.userId === userId) {
        this.apiCallStatus.delete(apiName);
      }
    }
  }

  getAPIStatus(apiName) {
    return this.apiCallStatus.get(apiName) || { called: false, calling: false };
  }

  getAllStatuses() {
    return Object.fromEntries(this.apiCallStatus);
  }

  getCurrentUserId() {
    return this.currentUserId;
  }
}

export const appLaunchAPIManager = new AppLaunchAPIManager();

// Hook for API Refresh
export const useAPIRefresh = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshAPI = useCallback(async (apiName, apiFunction, userId) => {
    if (!userId) {
      console.log('No userId available for API refresh');
      return;
    }

    try {
      setIsRefreshing(true);
      
      appLaunchAPIManager.resetAPI(apiName);
      
      await appLaunchAPIManager.callAPI(
        apiName, 
        apiFunction, 
        { forceRefresh: true, userId }
      );
      
      console.log(`✅ ${apiName} refreshed successfully`);
    } catch (error) {
      console.error(`❌ ${apiName} refresh failed:`, error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const refreshAllAPIs = useCallback(async (userId) => {
    if (!userId) {
      console.log('No userId available for full refresh');
      return;
    }

    try {
      setIsRefreshing(true);
      appLaunchAPIManager.resetAPIsForUser(userId);
      console.log(`🔄 All APIs reset for user: ${userId}`);
    } catch (error) {
      console.error('❌ API refresh failed:', error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const getAPIStatuses = useCallback(() => {
    return appLaunchAPIManager.getAllStatuses();
  }, []);

  return {
    refreshAPI,
    refreshAllAPIs,
    getAPIStatuses,
    isRefreshing,
  };
};