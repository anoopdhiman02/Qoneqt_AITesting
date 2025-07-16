// utils/GlobalNavigationManager.js
import { router } from "expo-router";

class GlobalNavigationManager {
  isNavigating: boolean;
  currentPath: null;
  navigationHistory: any[];
  pendingNavigation: null;
  debounceDelay: number;
  constructor() {
    this.isNavigating = false;
    this.currentPath = null;
    this.navigationHistory = [];
    this.pendingNavigation = null;
    this.debounceDelay = 300;
  }

  // Initialize with current path
  initialize(initialPath) {
    this.currentPath = initialPath;
    this.navigationHistory = [initialPath];
  }

  // Update current path when route changes
  updateCurrentPath(newPath) {
    if (this.currentPath !== newPath) {
      this.currentPath = newPath;
      this.navigationHistory.push(newPath);
      
      // Keep history limited to last 10 routes
      if (this.navigationHistory.length > 10) {
        this.navigationHistory.shift();
      }
    }
    this.isNavigating = false;
  }

  // Safe navigation with duplicate prevention
  safeNavigate(path, params = {}, options = {}) {
    // Normalize path
    const normalizedPath = this.normalizePath(path);
    
    // Prevent navigation to same screen
    if (this.currentPath === normalizedPath) {
      console.log(`Already on screen: ${normalizedPath}`);
      return false;
    }

    // Prevent rapid navigations
    if (this.isNavigating) {
      console.log("Navigation already in progress, ignoring...");
      return false;
    }

    // Clear any pending navigation
    if (this.pendingNavigation) {
      clearTimeout(this.pendingNavigation);
    }

    this.isNavigating = true;

    // Debounced navigation
    this.pendingNavigation = setTimeout(() => {
      try {
        const navigationMethod = options.replace ? 'replace' : 'push';
        
        if (Object.keys(params).length > 0) {
          router[navigationMethod]({
            pathname: normalizedPath,
            params: params
          });
        } else {
          router[navigationMethod](normalizedPath);
        }
        
        console.log(`Navigated to: ${normalizedPath}`);
        
        // Update current path after successful navigation
        setTimeout(() => {
          this.updateCurrentPath(normalizedPath);
        }, 100);
        
      } catch (error) {
        console.error('Navigation error:', error);
        this.isNavigating = false;
      }
    }, options.delay || this.debounceDelay);

    return true;
  }

  // Navigate with push
  push(path, params = {}) {
    return this.safeNavigate(path, params, { replace: false });
  }

  // Navigate with replace
  replace(path, params = {}) {
    return this.safeNavigate(path, params, { replace: true });
  }

  // Go back with safety check
  goBack() {
    if (this.isNavigating) {
      return false;
    }

    try {
      this.isNavigating = true;
      router.back();
      
      // Update current path from history
      setTimeout(() => {
        if (this.navigationHistory.length > 1) {
          this.navigationHistory.pop(); // Remove current
          this.currentPath = this.navigationHistory[this.navigationHistory.length - 1];
        }
        this.isNavigating = false;
      }, 100);
      
      return true;
    } catch (error) {
      console.error('Go back error:', error);
      this.isNavigating = false;
      return false;
    }
  }

  // Normalize path (remove leading slash inconsistencies)
  normalizePath(path) {
    if (!path) return '/';
    return path.startsWith('/') ? path : `/${path}`;
  }

  // Check if currently navigating
  isCurrentlyNavigating() {
    return this.isNavigating;
  }

  // Get current path
  getCurrentPath() {
    return this.currentPath;
  }

  // Get navigation history
  getHistory() {
    return [...this.navigationHistory];
  }

  // Reset navigation state (useful for debugging)
  reset() {
    this.isNavigating = false;
    this.currentPath = null;
    this.navigationHistory = [];
    
    if (this.pendingNavigation) {
      clearTimeout(this.pendingNavigation);
      this.pendingNavigation = null;
    }
  }

  // Force navigation (bypass all checks - use carefully)
  forceNavigate(path, params = {}, options = {}) {
    this.reset();
    return this.safeNavigate(path, params, options);
  }

  // Configure debounce delay
  setDebounceDelay(delay) {
    this.debounceDelay = delay;
  }
}

// Create singleton instance
export const globalNavigation = new GlobalNavigationManager();

// React hook for using global navigation
import { useCallback, useEffect } from 'react';
import { usePathname } from 'expo-router';

export const useGlobalNavigation = () => {
  const pathname = usePathname();

  // Update global navigation with current path
  useEffect(() => {
    if (pathname) {
      globalNavigation.updateCurrentPath(pathname);
    }
  }, [pathname]);

  // Initialize on first mount
  useEffect(() => {
    if (pathname && !globalNavigation.getCurrentPath()) {
      globalNavigation.initialize(pathname);
    }
  }, []);

  const navigate = useCallback((path, params = {}) => {
    return globalNavigation.push(path, params);
  }, []);

  const replace = useCallback((path, params = {}) => {
    return globalNavigation.replace(path, params);
  }, []);

  const goBack = useCallback(() => {
    return globalNavigation.goBack();
  }, []);

  const forceNavigate = useCallback((path, params = {}, options = {}) => {
    return globalNavigation.forceNavigate(path, params, options);
  }, []);

  return {
    navigate,
    replace,
    goBack,
    forceNavigate,
    currentPath: pathname,
    isNavigating: globalNavigation.isCurrentlyNavigating(),
    history: globalNavigation.getHistory(),
  };
};

// Navigation Provider Component (Optional - for context)
import React, { createContext, useContext } from 'react';

const NavigationContext = createContext(null);

export const NavigationProvider = ({ children }) => {
  const navigation = useGlobalNavigation();
  
  return (
    <NavigationContext.Provider value={navigation}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    // Fallback to hook if not using provider
    return useGlobalNavigation();
  }
  return context;
};