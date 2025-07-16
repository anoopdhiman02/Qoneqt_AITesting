import React from 'react';
import { useAPIRefresh } from '@/utils/AppLaunchManager';

const RefreshManager = ({ children }) => {
  const { refreshAPI, refreshAllAPIs, isRefreshing, currentUserId } = useAPIRefresh();

  // Provide refresh functions through context or props
  const refreshContext = {
    refreshAPI,
    refreshAllAPIs,
    isRefreshing,
    currentUserId,
  };

  return React.cloneElement(children, { refreshContext });
};

export default RefreshManager;