import React, { memo, useCallback, useMemo, useEffect, useState, useRef } from 'react';
import { Tabs } from 'expo-router';
import { useHomePostStore } from '@/zustand/HomePostStore';
import { usePostDetailStore } from '@/zustand/PostDetailStore';
import { useAppStore } from '@/zustand/zustandStore';
import useKeyboardVisible from '../hooks/useKeyboardVisible';
import BottomTabComponent from '../(screens)/BottomTabComponent';
import { icons } from './../../components/atom/BottomTab/TabIcons';
import useNetworkStatus from '../hooks/useNetworkStatus';
import TrackPlayer from 'react-native-track-player';
import { useScrollStore } from '@/zustand/scrollStore';




// Enhanced keyboard visibility hook with debouncing
const useStableKeyboardVisible = () => {
  const keyboardVisible = useKeyboardVisible();
  const [stableKeyboardVisible, setStableKeyboardVisible] = useState(keyboardVisible);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
       setStableKeyboardVisible(keyboardVisible);
    }, 1000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [keyboardVisible]);

  return stableKeyboardVisible;
};

// Home Tab Handler
const useHomeTabHandler = () => {
  const [tapCount, setTapCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const timerRef = useRef(null);
  const lastTapRef = useRef(0);
  const scrollToTop = useScrollStore((state: any) => state.scrollToTop);


  const handleHomeTabPress = useCallback(() => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    
    if (timeSinceLastTap < 100) {
      return;
    }
    
    lastTapRef.current = now;
    if (tapCount === 1 && timeSinceLastTap < 500) {
scrollToTop();
      if (isRefreshing) {
        console.log('Refresh already in progress, skipping');
        return;
      }
      
      setIsRefreshing(true);
      
      // Add your actual refresh logic here
      setTimeout(() => {
        setIsRefreshing(false);
      }, 2000);
      
      setTapCount(0);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    } else {
      setTapCount(1);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setTapCount(0);
      }, 500);
    }

  }, [tapCount, isRefreshing]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { handleHomeTabPress, isRefreshing };
};

// Tab Layout Component
const TabLayout = () => {
  const stableKeyboardVisible = useStableKeyboardVisible();
  const { handleHomeTabPress } = useHomeTabHandler();
  const [navigationMounted, setNavigationMounted] = useState(false);
  
  const setSelectedTab = useHomePostStore(state => state.setSelectedTab);
  const { isComment } = usePostDetailStore();
  const userId = useAppStore(state => state.userId);
  const {isConnected, recheckNetwork} = useNetworkStatus();

  // Wait for navigation to be fully mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavigationMounted(true);
      console.log('🚀 Tab navigation fully mounted');
    }, 300);

    return () => {
      clearTimeout(timer);
      TrackPlayer.stop();
      TrackPlayer.reset();
      // TrackPlayer.remove();
    };
  }, []);

  useEffect(() => {
    if (navigationMounted && userId) {
      console.log('✅ Tabs ready for user:', userId);
    }
  }, [navigationMounted, userId]);

  // Log when tabs are ready
  useEffect(() => {
    if (navigationMounted && userId) {
      console.log('✅ Tabs ready for user:', userId);
    }
  }, [navigationMounted, userId]);

  const lastTabPressRef = useRef(0);
  const handleTabPress = useCallback((e) => {
    
    const now = Date.now();
    if (now - lastTabPressRef.current < 300) {
      return;
    }
    lastTabPressRef.current = now;
    
    setSelectedTab(0);
    handleHomeTabPress();
  }, [setSelectedTab, handleHomeTabPress]);

  const screenOptions = useMemo(() => ({
    headerShown: false,
    tabBarStyle: {
      display: isComment ? 'none' : stableKeyboardVisible ? 'none' : 'flex',
    },
    swipeEnabled: navigationMounted,
    lazy: false,
  }), [stableKeyboardVisible, isComment, navigationMounted]);

  const tabBarComponent = useCallback((props) => (
    <BottomTabComponent 
      {...props} 
      navigationReady={navigationMounted}
      keyboardVisible={stableKeyboardVisible} 
      isComment={isComment}
      isConnected={isConnected}
      recheckNetwork={recheckNetwork}
    />
  ), [stableKeyboardVisible, isComment, navigationMounted, isConnected, recheckNetwork]);


  return (
    <Tabs
      tabBar={tabBarComponent}
      screenOptions={screenOptions}
      backBehavior="initialRoute"
      sceneContainerStyle={{ backgroundColor: 'transparent' }}
      // Remove initialRouteName to prevent auto-navigation
      // initialRouteName="(Dashboard)/DashboardScreen"
    >
      <Tabs.Screen
        name="(Dashboard)/DashboardScreen"
        options={{ 
          title: "Home",
          lazy: false
        }}
        listeners={{
          tabPress: (e) => {
            setSelectedTab(0);
            handleHomeTabPress(); // Handle custom double-tap behavior
          },
        }}
      />
      <Tabs.Screen
        name="SearchScreen"
        options={{ 
          title: "Search",
          lazy: false
        }}
      />
      <Tabs.Screen
        name="CreateUI"
        options={{
          title: "Create",
          tabBarIcon: () => icons["CreateUI"],
          lazy: false
        }}
      />
      <Tabs.Screen
        name="AllGroupListScreen"
        options={{
          title: "Group",
          tabBarIcon: () => icons["Sub-Group"],
          lazy: false
        }}
      />
      <Tabs.Screen
        name="ChatListScreen"
        options={{
          title: "Chats",
          tabBarIcon: () => icons["Chats"],
          lazy: false
        }}
      />
    </Tabs>
  );
};

export default memo(TabLayout);