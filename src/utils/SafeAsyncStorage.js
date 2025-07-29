
import AsyncStorage from '@react-native-async-storage/async-storage';

class SafeAsyncStorage {
  // Safe get item
  static async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.warn(`Error getting item "${key}":`, error);
      return null;
    }
  }

  // Safe set item
  static async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, String(value));
      return true;
    } catch (error) {
      console.warn(`Error setting item "${key}":`, error);
      return false;
    }
  }

  // Safe remove item
  static async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing item "${key}":`, error);
      return false;
    }
  }

  // Safe remove multiple items
  static async removeMultipleItems(keys) {
    try {
      // Remove items one by one to avoid multiRemove issues
      const results = await Promise.allSettled(
        keys.map(key => AsyncStorage.removeItem(key))
      );
      
      const failures = results.filter(result => result.status === 'rejected');
      if (failures.length > 0) {
        console.warn('Some items failed to remove:', failures);
      }
      
      return results.every(result => result.status === 'fulfilled');
    } catch (error) {
      console.warn('Error removing multiple items:', error);
      return false;
    }
  }

  // Safe multi get
  static async multiGet(keys) {
    try {
      const results = await Promise.allSettled(
        keys.map(key => AsyncStorage.getItem(key))
      );
      
      return keys.map((key, index) => {
        const result = results[index];
        return [key, result.status === 'fulfilled' ? result.value : null];
      });
    } catch (error) {
      console.warn('Error getting multiple items:', error);
      return keys.map(key => [key, null]);
    }
  }

  // Safe multi set
  static async multiSet(keyValuePairs) {
    try {
      // Validate and convert keyValuePairs to proper format
      const validPairs = keyValuePairs.map(pair => {
        if (!Array.isArray(pair) || pair.length !== 2) {
          throw new Error(`Invalid key-value pair: ${JSON.stringify(pair)}`);
        }
        const [key, value] = pair;
        return [String(key), String(value)];
      });

      // Use individual setItem calls instead of multiSet to avoid format issues
      const results = await Promise.allSettled(
        validPairs.map(([key, value]) => AsyncStorage.setItem(key, value))
      );
      
      const failures = results.filter(result => result.status === 'rejected');
      if (failures.length > 0) {
        console.warn('Some items failed to set:', failures);
      }
      
      return results.every(result => result.status === 'fulfilled');
    } catch (error) {
      console.warn('Error setting multiple items:', error);
      return false;
    }
  }

  // Clear all storage
  static async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.warn('Error clearing storage:', error);
      return false;
    }
  }

  // Get all keys
  static async getAllKeys() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys || [];
    } catch (error) {
      console.warn('Error getting all keys:', error);
      return [];
    }
  }
}

export default SafeAsyncStorage;

// Updated AppLaunchManager using SafeAsyncStorage
export class SafeAppLaunchManager {
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
    if (!SafeAppLaunchManager.instance) {
      SafeAppLaunchManager.instance = new SafeAppLaunchManager();
    }
    return SafeAppLaunchManager.instance;
  }

  async isFreshLaunchOrUserChanged(userId) {
    try {
      const currentSessionId = Date.now().toString();
      const lastSessionId = await SafeAsyncStorage.getItem(this.SESSION_KEY);
      const lastUserId = await SafeAsyncStorage.getItem(this.USER_ID_KEY);
      
      const userIdChanged = lastUserId !== userId;
      const isFreshSession = !lastSessionId;
      
      if (isFreshSession || userIdChanged) {
        // Set items safely
        await SafeAsyncStorage.multiSet([
          [this.SESSION_KEY, currentSessionId],
          [this.USER_ID_KEY, userId || '']
        ]);
        
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
      return true;
    }
  }

  async reset() {
    this.isAppLaunched = false;
    this.isInitializing = false;
    this.initializationPromise = null;
    this.currentUserId = null;
    
    await SafeAsyncStorage.removeMultipleItems([
      this.LAUNCH_FLAG_KEY,
      this.SESSION_KEY,
      this.USER_ID_KEY
    ]);
    
    console.log('Safe app launch manager reset');
  }

  async forceReinitialize(userId, initFunction) {
    console.log(`🔄 Force re-initializing for user: ${userId}`);
    
    this.isAppLaunched = false;
    this.isInitializing = false;
    this.initializationPromise = null;
    this.currentUserId = userId;
    
    await SafeAsyncStorage.removeMultipleItems([
      this.LAUNCH_FLAG_KEY,
      this.SESSION_KEY,
      this.USER_ID_KEY
    ]);
    
    return this.initializeApp(userId, initFunction);
  }

  // ... rest of the methods remain the same
}

// Usage example:
// Replace AsyncStorage with SafeAsyncStorage in your existing code
// import SafeAsyncStorage from './SafeAsyncStorage';
// const value = await SafeAsyncStorage.getItem('key');
// await SafeAsyncStorage.setItem('key', 'value');
// await SafeAsyncStorage.removeMultipleItems(['key1', 'key2', 'key3']);