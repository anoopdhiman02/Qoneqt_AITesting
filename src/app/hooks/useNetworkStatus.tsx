// hooks/useNetworkStatus.js
import { useEffect, useState, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';

const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  const recheckNetwork = useCallback(() => {
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected && state.isInternetReachable !== false);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected && state.isInternetReachable !== false);
    });

    // Fetch initial state
    recheckNetwork();

    return () => unsubscribe();
  }, [recheckNetwork]);

  return { isConnected, recheckNetwork };
};

export default useNetworkStatus;
