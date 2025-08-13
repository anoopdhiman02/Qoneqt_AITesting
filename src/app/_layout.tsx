import { Linking, StyleSheet } from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import RealmCustomProvider from "../context/RealmCustomProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider, useDispatch } from "react-redux";
import { Store } from "@/redux/store";
import Toast from "react-native-toast-message";
import "react-native-get-random-values";
import ServerErrorModal from "@/components/modal/ServerErrorModel";
import { useGlobalStatusStore } from "@/zustand/StatusStore";
import * as Sentry from "@sentry/react-native";
import messaging from "@react-native-firebase/messaging";
import { getIsLoggedIn, getUserDeatils } from "@/localDB/LocalStroage";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { SplashScreen } from "expo-router";
import useNotificationHandler from "./useNotificationHandler";
import { InsertNotificationInfo } from "@/utils/InsertNotificationData";
import { useAppStore } from "@/zustand/zustandStore";
import { globalColors } from "@/assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";
import "../utils/momentLocale";
import { Buffer } from 'buffer';
global.Buffer = Buffer;

// Import your API initialization hooks
import UpdateFcmTokenHook from '@/customHooks/UpdateFcmTokenHook';
import useCheckAppVersionHook from '@/customHooks/CheckAppVersionHook';
import { fetchMyProfileDetails} from '@/redux/reducer/Profile/FetchProfileDetailsApi';
import { onFetchMyUserFeeds } from '@/redux/reducer/Profile/FetchUserFeeds';
import axiosInstance from '@/utils/axiosInstance';
import { calculateHeight } from "@/utils/ImageHelper";
import { setMyUserFeedData } from "@/redux/slice/profile/ProfileMyFeedsSlice";


Sentry.init({
  dsn: "https://1d692cafbf78b18ace3dd1d997d5ba40@o4508255818022912.ingest.us.sentry.io/4508255836569600",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

// App Initialization Component
const AppInitializer = ({ children }) => {
  const userId = useAppStore(state => state.userId);
  const [initState, setInitState] = useState({
    isLaunched: false,
    isInitializing: false,
    error: null,
    hasAttempted: false,
    shouldNavigate: false
  });
  
  const initializationRef = useRef(false);
  const userIdRef = useRef(null);
  const dispatch = useDispatch();
  const { onUpdateFcmHandler } = UpdateFcmTokenHook();
  const { checkAppVersion } = useCheckAppVersionHook();
  const initializationStatusRef = useRef(new Map());

  const initializeAPIs = useCallback(async (userId) => {
    
    if (!userId) {
      return;
    }

    const userStatus = initializationStatusRef.current.get(userId);
    if (userStatus === 'in-progress') {
      return;
    }
    if (userStatus === 'completed') {
      return;
    }

    initializationStatusRef.current.set(userId, 'in-progress');
    
    try {
      axiosInstance.setDispatch(dispatch);

      const apiPromises = [
        (async () => {
          console.log('📡 Calling checkAppVersion...');
          await checkAppVersion();
          console.log('✅ checkAppVersion completed');
        })(),
        (async () => {
          console.log('📡 Calling updateFcmToken...');
          await onUpdateFcmHandler();
          console.log('✅ updateFcmToken completed');
        })(),
        (async () => {
          console.log('📡 Calling fetchMyProfileDetails...');
          // @ts-ignore
          await dispatch(fetchMyProfileDetails({ profile: userId, userId }));
          console.log('✅ fetchMyProfileDetails completed');
        })(),
        (async () => {
          console.log('📡 Calling fetchMyUserFeeds...');
          if(userId){
            // @ts-ignore
           var userFeedData: any = await dispatch(onFetchMyUserFeeds({ userId, profileId: userId, lastCount: 0 }));
           if(userFeedData.payload.success){
             var newData = await Promise.all(userFeedData?.payload?.data?.map(async (item) => {
                              if(item?.file_type == "image"){
                                return {
                                  ...item,
                                  display_height: (await Promise.all(calculateHeight(item)))
                                };
                              }
                              return {
                                ...item
                              };
                            }));
            if(newData.length > 0){
              dispatch(setMyUserFeedData(newData));
            }
          }
          }
          console.log('✅ fetchMyUserFeeds completed');
        })(),
      ];

      const results = await Promise.allSettled(apiPromises);
      const failures = results.filter(result => result.status === 'rejected');
      if (failures.length > 0) {
        console.warn(`⚠️ ${failures.length} API calls failed:`, failures);
      }
      initializationStatusRef.current.set(userId, 'completed');
    } catch (error) {
      console.error(`❌ API initialization failed for user ${userId}:`, error);
      initializationStatusRef.current.delete(userId);
      throw error;
    }
  }, [dispatch, checkAppVersion, onUpdateFcmHandler, userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    if (initializationRef.current && userIdRef.current === userId) {
      return;
    }

    if (initState.hasAttempted && userIdRef.current === userId) {
      return;
    }

    if (!initState.isInitializing) {
      
      initializationRef.current = true;
      userIdRef.current = userId;
      
      setInitState(prev => ({
        ...prev,
        isInitializing: true,
        hasAttempted: true,
        error: null
      }));
      
      initializeAPIs(userId)
        .then(() => {
          setInitState(prev => ({
            ...prev,
            isLaunched: true,
            isInitializing: false,
            shouldNavigate: true
          }));
        })
        .catch((err) => {
          console.error('❌ App initialization failed:', err);
          setInitState(prev => ({
            ...prev,
            error: err.message || 'Initialization failed',
            isInitializing: false
          }));
          initializationRef.current = false;
          userIdRef.current = null;
        });
    }
  }, [userId]);

  // Reset initialization state when user changes
  useEffect(() => {
    if (userIdRef.current && userIdRef.current !== userId) {
      console.log('👤 User changed, resetting initialization state');
      initializationRef.current = false;
      userIdRef.current = null;
      setInitState({
        isLaunched: false,
        isInitializing: false,
        error: null,
        hasAttempted: false,
        shouldNavigate: false
      });
    }
  }, [userId]);

  // Return the initialization state to be used by the layout
  return children(initState);
};

// Main Layout Component
const _layout = () => {
  const { serverErrorStatus } = useGlobalStatusStore();
  useNotificationHandler();

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      // Load resources
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate loading
      await SplashScreen.hideAsync();
    }
    prepare();
  }, []);

  useEffect(() => {
    const handleDynamicLink = async (link) => {
      if (link && link.url) {
        const url = new URL(link.url);
        const referralCode = url.searchParams.get("join_by");
        if (referralCode) {
          try {
            await SplashScreen.hideAsync();
            router.replace({
              pathname: "/LoginScreen",
              params: { referCode: referralCode },
            });
          } catch (error) {
            console.log("error", error);
          }
        }
      }
    };

    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    dynamicLinks().getInitialLink().then(handleDynamicLink);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribeOnNotificationOpenedApp =
      messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log('unsubscribeOnNotificationOpenedApp', remoteMessage);
        handleNotificationRedirect(remoteMessage);
      });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('getInitialNotification', remoteMessage);
          handleNotificationRedirect(remoteMessage);
        }
      });

    return () => {
      unsubscribeOnNotificationOpenedApp();
    };
  }, []);

  useEffect(() => {
    const handleDeepLink = (event) => {
      const url = event.url;
      // handleDeepLinking(url);
    };
    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => {
      subscription.remove();
    };
  }, []);

  const handleNotificationRedirect = async (remoteMessage) => {
    if (!remoteMessage?.data) return;

    const { type, profile_id, post_id, group_id, comment_id, loop_id } =
      remoteMessage.data;
    const UserDetails = await getUserDeatils();
    InsertNotificationInfo({
      user_id: UserDetails?.id,
      push_id: remoteMessage?.data?.push_id,
      type: type,
      data: remoteMessage?.data,
    });
    console.log("remoteMessage", type);
    switch (type) {
      case "personal_chat":
        router.push({
          pathname: "/UserChatScreen",
          params: { id: profile_id || 2, from: 1, isNotification: "true"},
        });
        break;
      case "user_view":
        router.push({
          pathname: "/profile/[id]",
          params: { id: profile_id || 2, isProfile: "true" },
        });
        break;
      case "kyc_verify_redirect":
        router.push({ pathname: "/DashboardScreen" });
        break;
      case "post":
        router.push({
          pathname: "/post/[id]",
          params: { id: post_id, isNotification: "true" },
        });
        break;
      case "channel_chat":
        router.push({
          pathname: "/ChannelChatScreen",
          params: {
            id: remoteMessage?.data?.channel_id || remoteMessage?.data?.id,
            from: 2,
            isNotification: "true",
          },
        });
      case "like":
        router.push({
          pathname: "/post/[id]",
          params: { id: post_id, isNotification: "true" },
        });
        break;
      case "comment":
        router.push({
          pathname: "/post/[id]",
          params: { id: post_id, isNotification: "true" },
        });
        break;
      case "reply":
        router.push({
          pathname: "/post/[id]",
          params: { id: post_id, isNotification: "true" },
        });
        break;
      case "cmt_user_tag":
        router.push({
          pathname: "/post/[id]",
          params: { id: post_id, isNotification: "true" },
        });
        break;
      case "reply_user_tag":
        router.push({
          pathname: "/post/[id]",
          params: {
            id: post_id,
            commentId: comment_id,
            isNotification: "true",
          },
        });
        break;
      case "kyc_verified":
        router.replace("/DashboardScreen");
        break;
      case "group":
        router.push({
          pathname: "/groups/[slug]",
          params: { slug: loop_id || group_id || "india" },
        });
        break;
      case "profile_follow":
        router.push({
          pathname: "/profile/[id]",
          params: { id: profile_id, isProfile: "true" },
        });
        break;
      case "accept_request":
        router.push({ pathname: "/groups", params: { groupId: loop_id } });
        break;
      case "loop_join":
        router.push({ pathname: "/groups", params: { groupId: loop_id } });
        break;
      case "remove_group_member":
        router.push({ pathname: "/groups", params: { groupId: loop_id } });
        break;
      case "loop_request":
        router.push({ pathname: "/groups", params: { groupId: loop_id } });
        break;
      case "join_request":
        router.push({ pathname: "/groups", params: { groupId: loop_id } });
        break;
      case "refer_user":
        router.push({
          pathname: "/refer-and-earn",
          params: {
            isNotification: "true",
          },
        });
        break;
      default:
        router.replace("/DashboardScreen");
        break;
    }
  };

  const handleDeepLinking = async (data) => {
    try {
      const isLoggedIn = await getIsLoggedIn();
      const url = new URL(data);
      const referralCode = url.searchParams.get("join_by");
      if (isLoggedIn) {
        const pattern = /^qoneqt:\/\/([^\/]+)\/([^\/]+)$/;
        const match = data.match(pattern);
        var pathname: any = `${match[1] ? "/" + match[1] : "/DashboardScreen"}`;

        if (match[1] == "groups") {
          router.replace({
            pathname: "/groups/[slug]",
            params: { slug: match[2] },
          });
        } else {
          router.replace({ pathname: pathname, params: { id: match[2] } });
        }
      } else {
        router.replace({
          pathname: "/LoginScreen",
          params: { referCode: referralCode },
        });
      }
    } catch (error) {
      console.error("Error handling deep link:", error);
    }
  };


  return (
    <>
      <Provider store={Store}>
        <RealmCustomProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AppInitializer>
              {(initState) => (
                <>
                  <ServerErrorModal visible={serverErrorStatus} />
                  <Stack
                    screenOptions={{ 
                      headerShown: false, 
                      gestureEnabled: false, 
                      animation: "slide_from_right" 
                    }}
                  >
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(getStarted)" />
                    <Stack.Screen name="(tabs)" />
                  </Stack>
                </>
              )}
            </AppInitializer>
          </GestureHandlerRootView>
        </RealmCustomProvider>
      </Provider>
      <Toast />
      <StatusBar style="dark" />
    </>
  );
};

export default Sentry.wrap(_layout);

const styles = StyleSheet.create({
  noInternetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  noInternetText: {
    fontSize: 18,
    color: globalColors.neutralWhite,
    fontFamily: fontFamilies.bold,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  waitingText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    textAlign: 'center',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
  },
});