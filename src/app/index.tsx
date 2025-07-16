import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ActivityIndicator, LogBox, AppState, FlatList } from 'react-native';
import { useRouter, SplashScreen } from 'expo-router';
import { useAppStore } from '@/zustand/zustandStore';
import { 
  getIsLoggedIn, 
  getUserDeatils, 
  getGetStartedSkipped, 
  getUserData, 
  getStoreUserKycStatus 
} from '@/localDB/LocalStroage';
import { globalColors } from '@/assets/GlobalColors';
import { useLoadFonts } from '../assets/fonts/useFontLoaded';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setIsFirstTime } from '@/redux/slice/login/LoginUserSlice';
import { getPrefsValue } from '@/utils/storage';
import { userShowAnimatedToggle } from '@/zustand/AnimatedToggle';
import { setPostLocalData } from '@/redux/slice/home/HomePostSlice';
import { InsertNotificationInfo } from '@/utils/InsertNotificationData';
import { fontFamilies } from '@/assets/fonts';
import TrackPlayer, { AppKilledPlaybackBehavior, Capability, State } from 'react-native-track-player';
import TrackPlayerService from '@/services/TrackPlayerService';
import { checkIf24HoursPassed } from '@/utils/storeCureenData';
import { refreshTokenIfNeeded } from '@/utils/tokenUtils'; // You'll need to extract this function
import PostLoaderComponent from '@/components/PostLoaderComponent';
import PostHeaderLoader from '@/components/modules/PostHeaderLoader';

const { width, height } = Dimensions.get("window");
LogBox.ignoreAllLogs(true);

TrackPlayer.registerPlaybackService(() => TrackPlayerService);

// Initialize TrackPlayer
const initializeTrackPlayer = async () => {
  try {
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

export default function IndexScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const fontsLoaded = useLoadFonts();
  const { setUserId } = useAppStore();
  const { setIsFlex } = userShowAnimatedToggle();
  
  const [authState, setAuthState] = useState({
    isChecking: true,
    isLoggedIn: false,
    userDetails: null,
    shouldNavigate: false,
    isInitialized: false
  });
  
  const navigationTriggered = useRef(false);
  const trackPlayerInitRef = useRef(false);
  const initializationRef = useRef(false);

  // Initialize TrackPlayer once
  useEffect(() => {
    const initTrackPlayer = async () => {
      if (!trackPlayerInitRef.current) {
        await initializeTrackPlayer();
        trackPlayerInitRef.current = true;
      }
    };
    
    initTrackPlayer();
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

  // Handle notification redirect
  const handleNotificationRedirect = useCallback(async ({ remoteMessage, userData }) => {
    try {
      const screen = remoteMessage?.data?.type || "post";
      const isExpired = await checkIf24HoursPassed();
      
      if (isExpired) {
        // You'll need to implement this function or import it
        // await refreshTokenIfNeeded();
      }
      
      await InsertNotificationInfo({
        user_id: userData,
        push_id: remoteMessage?.data?.push_id,
        type: screen,
        data: remoteMessage?.data,
      });
      
      // Navigate to tabs instead of direct dashboard
      router.replace("/DashboardScreen");
    } catch (error) {
      console.error("Notification redirect error:", error);
      router.replace("/DashboardScreen");
    }
  }, [router]);

  // Initialize logged in user
  const initLoggedInUser = useCallback(async () => {
    try {
      const [
        userData,
        userDetails,
        kycStatus,
        loginType,
        isNewUser,
        homePostsData,
        notificationData,
      ] = await Promise.all([
        getUserData(),
        getUserDeatils(),
        getStoreUserKycStatus(),
        AsyncStorage.getItem("user_login_type"),
        AsyncStorage.getItem("isNewUser"),
        getPrefsValue("homePostData"),
        getPrefsValue("message"),
      ]);

      // Set user ID for the layout initialization
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
          await handleNotificationRedirect({
            remoteMessage: parsedNotification,
            userData: userDetails?.id,
          });
          return;
        } catch (error) {
          console.error("Notification handling error:", error);
        }
      }

      // Navigate to tabs (layout will handle initialization)
      router.replace(isNewUser === "true" ? "/DashboardScreen" : "/SelectPreferences");
      
    } catch (error) {
      console.error("Init logged user error:", error);
      router.replace("/DashboardScreen");
    }
  }, [dispatch, handleNotificationRedirect, setUserId, router]);

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!fontsLoaded || initializationRef.current) return;
      
      initializationRef.current = true;
      
      try {
        console.log('🔍 Checking authentication status...');
        
        // Hide splash screen
        await SplashScreen.hideAsync();
        
        // Get all required data
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
        
        console.log('🔐 Auth Status:', { isLoggedIn, hasReferralCode: !!referralCode });
        
        setAuthState({
          isChecking: false,
          isLoggedIn,
          userDetails: null,
          shouldNavigate: true,
          isInitialized: true
        });
        
        // Handle navigation
        if (isLoggedIn === true) {
          await initLoggedInUser();
        } else {
          const targetRoute: any = referralCode 
            ? { pathname: "/LoginScreen", params: { referCode: referralCode } }
            : getStartedSkip ? "/LoginScreen" : "/(getStarted)";
          
          router.replace(targetRoute);
        }
        
      } catch (error) {
        console.error('❌ Error checking auth status:', error);
        setAuthState({
          isChecking: false,
          isLoggedIn: false,
          userDetails: null,
          shouldNavigate: false,
          isInitialized: true
        });
        router.replace("/LoginScreen");
      }
    };

    checkAuthStatus();
  }, [fontsLoaded, dispatch, setIsFlex, initLoggedInUser, router]);

  // Prevent splash screen auto-hide
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  // Cleanup TrackPlayer
  useEffect(() => {
    return () => {
      TrackPlayer.reset();
    };
  }, []);

  // Show loading screen
  if (authState.isChecking || !authState.isInitialized) {
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
  }

  // Fallback
  return (
    <View style={styles.container}>

      <FlatList
        ListHeaderComponent={
          <PostHeaderLoader 
            containerStyle={{ 
              width: Dimensions.get('window').width * 0.89, 
              marginTop: "4%",
              marginBottom: "4%" 
            }} 
          />
        }
        data={Array.from({ length: 2 })}
        renderItem={() => (
          <PostLoaderComponent 
            containerStyle={{ 
              width: Dimensions.get('window').width * 0.89, 
              marginTop: "4%", 
              marginBottom: "4%" 
            }} 
          />
        )}
      />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: globalColors.neutral1 || '#000',
    paddingTop: 30
  },
  text: {
    color: globalColors.neutralWhite || '#fff',
    fontSize: 16,
    fontFamily: fontFamilies.medium || 'Nunito-Medium',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: globalColors.neutral1 || '#000',
    paddingVertical: 20,
    justifyContent: 'center',
  },

});