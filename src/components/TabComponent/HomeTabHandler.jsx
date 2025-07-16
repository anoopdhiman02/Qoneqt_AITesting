import React, { useState, useRef, useCallback } from 'react';
import { InteractionManager } from 'react-native';
import useHomeViewModel from '@/app/(features)/(home)/viewModel/HomeViewModel';
import { useScrollStore } from '@/zustand/scrollStore';

const useHomeTabHandler = () => {
  const { onRefreshHandler } = useHomeViewModel();
  const scrollToTop = useScrollStore(state => state.scrollToTop);
  
  const [tapCount, setTapCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const timerRef = useRef(null);

  const handleHomeTabPress = useCallback(() => {
    if (tapCount === 1) {
      // Prevent multiple refresh calls
      if (isRefreshing) {
        console.log('Refresh already in progress, skipping');
        return;
      }

      setIsRefreshing(true);
      
      // Double-tap detected
      InteractionManager.runAfterInteractions(() => {
        try {
          scrollToTop();
          onRefreshHandler();
        } catch (error) {
          console.error('Home refresh error:', error);
        } finally {
          // Reset refresh flag
          setTimeout(() => setIsRefreshing(false), 2000);
        }
      });
      
      setTapCount(0);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    } else {
      // First tap
      setTapCount(1);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setTapCount(0);
        timerRef.current = null;
      }, 500);
    }
  }, [tapCount, onRefreshHandler, scrollToTop, isRefreshing]);

  return {
    handleHomeTabPress,
    isRefreshing,
  };
};

export default useHomeTabHandler;