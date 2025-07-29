
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  ActivityIndicator,
  AppState,
} from "react-native";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { router, SplashScreen } from "expo-router";
import { useLoadFonts } from "../assets/fonts/useFontLoaded";
import { LinearGradient } from "expo-linear-gradient";
import "react-native-get-random-values";
import { useAppStore } from "@/zustand/zustandStore";
import messaging from "@react-native-firebase/messaging";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import {
  getGetStartedSkipped,
  getIsLoggedIn,
  getStoreUserKycStatus,
  getUserData,
  getUserDeatils,
} from "@/localDB/LocalStroage";
import { globalColors } from "@/assets/GlobalColors";
import { googleConfiguration } from "@/utils/socialLogin";
import { getPrefsValue, setPrefsValue } from "@/utils/storage";
import { useDispatch } from "react-redux";
import {
  setAccessToken,
  setIsFirstTime,
} from "@/redux/slice/login/LoginUserSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "@/utils/axiosInstance";
import { InsertNotificationInfo } from "@/utils/InsertNotificationData";
import { checkIf24HoursPassed } from "@/utils/storeCureenData";
import axios from "axios";
import { BASE_GO_URL, BASE_URL } from "@/utils/constants";
import { storeDate } from "@/utils/storeCureenData";
import { userShowAnimatedToggle } from "@/zustand/AnimatedToggle";
import { setPostLocalData } from "@/redux/slice/home/HomePostSlice";
import "../utils/momentLocale";
import TrackPlayerService from "@/services/TrackPlayerService";
import TrackPlayer, { AppKilledPlaybackBehavior, Capability, State } from 'react-native-track-player';
import { setTokens } from "@/localDB/TokenManager";
import useDeviceId from "./hooks/useDeviceId";
import { handleNotificationPress } from '@/utils/notificationRedirect';
const { width, height } = Dimensions.get("window");

TrackPlayer.registerPlaybackService(() => TrackPlayerService);

// Silence deprecation warnings
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

// Configure messaging handlers outside component to prevent re-creation
const backgroundMessageHandler = async (remoteMessage) => {
  if (remoteMessage?.data) {
    setPrefsValue("message", JSON.stringify(remoteMessage));
  }
};

// Set up messaging handlers once
messaging().setBackgroundMessageHandler(backgroundMessageHandler);

const configureInitialNotification = () => {
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage?.data) {
        setPrefsValue("message", JSON.stringify(remoteMessage));
      }
    });
};

// Call once on module load
configureInitialNotification();

// ENHANCED: Add TrackPlayer initialization
const initializeTrackPlayer = async () => {
  try {
    // Check app state to prevent background initialization
    if (AppState.currentState !== 'active') {
      console.log('TrackPlayer setup skipped: App not in foreground');
      return;
    }

    let isSetup = false;
    try {
      const state: any = await TrackPlayer.getPlaybackState();
      isSetup = state !== State.None;
    } catch (error) {
      isSetup = false;
    }

    if (!isSetup) {
      await TrackPlayer.setupPlayer({
        maxCacheSize: 1024 * 10,
        autoHandleInterruptions: true,
        autoUpdateMetadata: true,
      });

      await TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
          Capability.Stop,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
        progressUpdateEventInterval: 2,
      });

      console.log('TrackPlayer initialized successfully');
    } else {
      console.log('TrackPlayer already initialized');
    }
  } catch (error) {
    console.log('TrackPlayer initialization error:', error);
  }
};

const index = () => {
  const dispatch = useDispatch();
  const fontsLoaded = useLoadFonts();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use stable selectors to prevent unnecessary re-renders
  const { setUserId } = useAppStore();
  const { setIsFlex } = userShowAnimatedToggle();
 // Prevent multiple initializations
 const initializationRef = useRef(false);
 const dynamicLinkUnsubscribeRef = useRef(null);
 const trackPlayerInitRef = useRef(false);
 // Memoize SDK configuration
 const configureSDKs = useCallback(async () => {
  if (initializationRef.current) return;
  initializationRef.current = true;
  try {
    // Initialize TrackPlayer first
    if (!trackPlayerInitRef.current) {
      await initializeTrackPlayer();
      trackPlayerInitRef.current = true;
    }
    
    googleConfiguration();
    axiosInstance.setDispatch(dispatch);
  } catch (error) {
    console.error('SDK configuration error:', error);
  }
}, [dispatch]);

// Configure SDKs once
useEffect(() => {
  configureSDKs();
}, [configureSDKs]);


  // Initialize TrackPlayer once
  useEffect(() => {
    const initTrackPlayer = async () => {
      if (!trackPlayerInitRef.current) {
        await initializeTrackPlayer();
        trackPlayerInitRef.current = true;
      }
    };
    
    

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        initTrackPlayer();
      }
    };
  
    const subscription = AppState.addEventListener('change', handleAppStateChange);
  
    return () => {
      subscription.remove();
    };
  }, []);

  // Handle app state changes for TrackPlayer
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        await TrackPlayer.stop();
      }
    });

    return () => subscription.remove();
  }, []);

// Optimize dynamic link handler
const handleDynamicLink = useCallback(async (link) => {
  if (link?.url) {
    try {
      const url = new URL(link.url);
      const referralCode = url.searchParams.get("join_by");
      if (referralCode) {
        await setPrefsValue("referral_code", referralCode);
      }
    } catch (error) {
      console.error("Dynamic link handling error:", error);
    }
  }
}, []);


   // Set up dynamic links once
   useEffect(() => {
    if (dynamicLinkUnsubscribeRef.current) return;
    
    const setupDynamicLinks = async () => {
      try {
        dynamicLinkUnsubscribeRef.current = dynamicLinks().onLink(handleDynamicLink);
        const initialLink = await dynamicLinks().getInitialLink();
        if (initialLink) {
          await handleDynamicLink(initialLink);
        }
      } catch (error) {
        console.error("Dynamic links setup error:", error);
      }
    };

    setupDynamicLinks();

    return () => {
      if (dynamicLinkUnsubscribeRef.current) {
        dynamicLinkUnsubscribeRef.current();
        dynamicLinkUnsubscribeRef.current = null;
      }
    };
  }, [handleDynamicLink]);

  const refreshTokenIfNeeded = useCallback(async () => {
    try {
      const [refreshToken, userId] = await Promise.all([
        AsyncStorage.getItem("ref_token"),
        AsyncStorage.getItem("user_id")
      ]);
      
      const userInfo = useAppStore.getState().userInfo || {};
      const deviceInfo = await useDeviceId();
      const acc_Token = await AsyncStorage.getItem("acc_token")
      const response = await axios.post(`${BASE_GO_URL}update-tokens`, {
        refresh_token:refreshToken,
        user_id: userInfo?.id || userId,
        access_token:acc_Token,
        device_id: deviceInfo,
      });
      const accessToken = response?.data?.data?.accessToken || response?.data?.accessToken || response?.data?.AccessToken;
      const newRefreshToken = response?.data?.data?.refreshToken || response?.data?.refreshToken;
      
      if (!accessToken) {
        return false;
      }

      await AsyncStorage.multiSet([
        ["acc_token", accessToken],
        ["ref_token", newRefreshToken],
      ]);
      setTokens({ accessToken: accessToken, refreshToken: newRefreshToken });
      storeDate();

      if (dispatch) {
        dispatch(setAccessToken(accessToken));
      }
      return true;
    } catch (error) {
      console.error("Token refresh error:", error);
      return false;
    }
  }, [dispatch]);

  // Optimize notification handling
  const handleNotificationRedirect = useCallback(async ({ remoteMessage, userData }) => {
    try {
      const screen = remoteMessage?.data?.type || "post";
      const isExpired = await checkIf24HoursPassed();
      
      if (isExpired) {
        await refreshTokenIfNeeded();
      }
      console.log("Notification1");
      await InsertNotificationInfo({
        user_id: userData,
        push_id: remoteMessage?.data?.push_id,
        type: screen,
        data: remoteMessage?.data,
      });
      handleNotificationPress(remoteMessage?.data);
      // router.replace("/DashboardScreen");
    } catch (error) {
      console.error("Notification redirect error:", error);
      router.replace("/DashboardScreen");
    }
  }, [refreshTokenIfNeeded]);

  // Optimize logged-in user initialization
  const initLoggedInUser = useCallback(async () => {
    try {
      // Batch all async operations
      const [
        userData,
        userDetails,
        kycStatus,
        loginType,
        homePostsData,
        notificationData,
      ] = await Promise.all([
        getUserData(),
        getUserDeatils(),
        getStoreUserKycStatus(),
        AsyncStorage.getItem("user_login_type"),
        getPrefsValue("homePostData"),
        getPrefsValue("message"),
      ]);

      // Set user ID immediately
      if (userData?.userId) {
        setUserId(userData.userId);
      }

      // Handle cached home posts
      if (homePostsData) {
        try {
          const parsedHomeData = JSON.parse(homePostsData);
          if (Array.isArray(parsedHomeData)) {
            dispatch(setPostLocalData({ UpdatedData: parsedHomeData }));
          }
        } catch (error) {
          console.error("Home posts data parsing error:", error);
        }
      }

      // Handle notifications
      if (notificationData) {
        try {
          const parsedNotification = JSON.parse(notificationData);
          console.log("parsedNotification", parsedNotification);
          await handleNotificationRedirect({
            remoteMessage: parsedNotification,
            userData: userDetails?.id,
          });
          return; // Exit early to prevent double navigation
        } catch (error) {
          console.error("Notification handling error:", error);
        }
      }

      // Default navigation
       router.replace("/DashboardScreen");
      // router.replace("/SelectPreferences");
    } catch (error) {
      console.error("Init logged user error:", error);
      router.replace("/DashboardScreen");
    }
  }, [dispatch, handleNotificationRedirect, setUserId]);

  // Main initialization logic
  const prepareAndRedirect = useCallback(async () => {
    if (!fontsLoaded || isInitialized) return;
    
    setIsInitialized(true);

    try {
      await SplashScreen.hideAsync();

      // Batch all storage operations
      const [
        isLoggedIn,
        getStartedSkip,
        referralCode,
        isFirst,
        isFlexData,
      ] = await Promise.all([
        getIsLoggedIn(),
        getGetStartedSkipped(),
        getPrefsValue("referral_code"),
        getPrefsValue("isFirst"),
        AsyncStorage.getItem("isFlex"),
      ]);

      // Set app state
      dispatch(setIsFirstTime(isFirst === "true"));
      const flex = !isFlexData || isFlexData === "" ? true : JSON.parse(isFlexData);
      setIsFlex(flex);

      // Navigate based on login status
      if (isLoggedIn === true) {
        await initLoggedInUser();
      } else {
        const targetRoute: any = referralCode 
          ? { pathname: "/LoginScreen", params: { referCode: referralCode } }
          : getStartedSkip ? "/LoginScreen" : "/(getStarted)";
        
        router.replace(targetRoute);
      }
    } catch (error) {
      console.error("Preparation error:", error);
      router.replace("/LoginScreen");
    }
  }, [fontsLoaded, isInitialized, dispatch, setIsFlex, initLoggedInUser]);

  // Single effect for initialization
  useEffect(() => {
    prepareAndRedirect();
  }, [prepareAndRedirect]);

  // Prevent SplashScreen from auto-hiding
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);


  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        start={{ x: 0.1, y: 0.5 }}
        end={{ x: -0.1, y: -2 }}
        style={StyleSheet.absoluteFill}
        colors={[globalColors.neutral1, globalColors.slateBlueShade20]}
      >
        <View
          style={{
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            resizeMode="contain"
            style={{ height: height * 0.13, width: width * 0.7 }}
            source={require("../assets/image/Qoneqt_icon.png")}
          />
          <Image
            resizeMode="contain"
            style={{ height: height * 0.08, width: width * 0.7, marginTop: 10 }}
            source={require("../assets/image/Qoneqt_name.png")}
          />
          <ActivityIndicator size={"large"} color={"#ffffff"} />
        </View>
      </LinearGradient>
    </View>
  );
};

export default index;