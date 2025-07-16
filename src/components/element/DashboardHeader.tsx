import {
  Dimensions,
  ImageBackground,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { 
  useEffect, 
  useState, 
  useRef, 
  memo, 
  useCallback, 
  useMemo 
} from "react";
import { router } from "expo-router";
import { NotificationIcon, QRIcon, UserIcon } from "@/assets/DarkIcon";
import { Image } from "expo-image";
import { globalColors } from "@/assets/GlobalColors";
import { ImageUrlConcated } from "@/utils/ImageUrlConcat";
import {
  Camera,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import useCreatePostViewModel from "@/viewModels/CreatePostViewModel";
import Button1 from "../buttons/Button1";
import CryptoJS from "crypto-js";
import AnimatedToggle from "../AnimatedToggle";
import { showToast } from "../atom/ToastMessageComponent";
import { ChatTabIcon, ChatIcon } from "@/assets/DarkIcon";
import { useAppSelector } from "@/utils/Hooks";
import { useAppStore } from "@/zustand/zustandStore";
import { onFetchEventPostDetail } from "@/redux/reducer/post/EventPostDetailsApi";
import { useDispatch } from "react-redux";
import { logEvent} from "@/customHooks/useAnalytics";

const { width, height } = Dimensions.get("window");

// Performance optimized styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileButton: {
    marginLeft: "5%",
    marginTop: "2%",
    height: 45,
    width: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    borderRadius: 30,
    width: 35,
    height: 35,
    borderColor: globalColors.slateBlueTint20,
    borderWidth: 0.5,
    backgroundColor: globalColors.neutralWhite,
  },
  userIcon: {
    shadowColor: globalColors.darkOrchidShade80,
    height: 35,
    width: 35,
  },
  topRightIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    right: "3.5%",
  },
  qrIconContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  qrIconInner: {
    alignItems: "center",
    justifyContent: "center",
    width: 25,
    height: 25,
    position: "relative",
    borderWidth: 1,
    borderColor: "transparent",
  },
  qrCorner: {
    position: "absolute",
    width: 8,
    height: 8,
    borderColor: "#fff",
  },
  qrCornerTopLeft: {
    top: 2,
    left: 2,
    borderTopWidth: 1,
    borderLeftWidth: 1,
  },
  qrCornerTopRight: {
    top: 2,
    right: 2,
    borderTopWidth: 1,
    borderRightWidth: 1,
  },
  qrCornerBottomLeft: {
    bottom: 2,
    left: 2,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
  },
  qrCornerBottomRight: {
    bottom: 2,
    right: 2,
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
  notificationButton: {
    padding: 8,
    alignItems: "center",
  },
  cameraModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  scannerBackground: {
    backgroundColor: globalColors.warmPink,
    borderRadius: 5,
    width: "100%",
    paddingVertical: "8%",
    alignItems: "center",
    height: height * 0.6,
  },
  scannerCameraWrapper: {
    backgroundColor: globalColors.darkOrchidShade40,
    alignItems: "center",
    marginTop: height * 0.1,
  },
  cameraStyle: {
    width: (width * 70) / 100,
    height: (width * 100 * (120 / 180)) / 100,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: globalColors.bgDark2,
  },
  borderOverlay: {
    position: "absolute",
    width: (width * 70) / 100,
    height: (width * 100 * (120 / 180)) / 100,
  },
  cornerBorder: {
    position: "absolute",
    backgroundColor: globalColors.neutralWhite,
  },
  cornerBorderHorizontal: {
    width: 30,
    height: 5,
  },
  cornerBorderVertical: {
    width: 5,
    height: 30,
  },
  goBackBtnWrapper: {
    width: "70%",
    alignSelf: "center",
  },
});

// Memoized components for better performance
const MemoizedUserIcon = memo(UserIcon);
const MemoizedQRIcon = memo(QRIcon);
const MemoizedNotificationIcon = memo(NotificationIcon);
const MemoizedAnimatedToggle = memo(AnimatedToggle);
const MemoizedButton1 = memo(Button1);

// Optimized Profile Image Component
const ProfileImage = memo(({ profileImage }: any) => {
  const imageSource = useMemo(() => {
    if (!profileImage || profileImage.length === 0) return null;
    
    return {
      uri: profileImage.startsWith("file") 
        ? profileImage 
        : ImageUrlConcated(profileImage),
    };
  }, [profileImage]);

  if (!imageSource) {
    return (
      <View style={styles.userIcon}>
        <MemoizedUserIcon width={35} height={35} />
      </View>
    );
  }

  return (
    <Image
      style={styles.profileImage}
      contentFit="cover"
      contentPosition="center"
      source={imageSource}
    />
  );
}, (prevProps: any, nextProps: any) => {
  return prevProps.profileImage === nextProps.profileImage;
});

// Optimized QR Scanner Icon with Corner Decorations
const QRScannerIcon = memo(({ onPress, isDisabled }: any) => {
  const containerStyle = useMemo(() => ({
    ...styles.qrIconContainer,
    opacity: isDisabled ? 0.2 : 1,
  }), [isDisabled]);

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={isDisabled}
    >
      <View style={styles.qrIconInner}>
        <MemoizedQRIcon />
        <View style={[styles.qrCorner, styles.qrCornerTopLeft]} />
        <View style={[styles.qrCorner, styles.qrCornerTopRight]} />
        <View style={[styles.qrCorner, styles.qrCornerBottomLeft]} />
        <View style={[styles.qrCorner, styles.qrCornerBottomRight]} />
      </View>
    </TouchableOpacity>
  );
});

// Optimized Camera Scanner Borders
const ScannerBorders = memo(() => {
  const borderPositions = useMemo(() => [
    // Top Left Corner
    { style: [styles.cornerBorder, styles.cornerBorderHorizontal, { top: -10, left: -10 }] },
    { style: [styles.cornerBorder, styles.cornerBorderVertical, { top: -10, left: -10 }] },
    // Top Right Corner
    { style: [styles.cornerBorder, styles.cornerBorderHorizontal, { top: -10, right: -10 }] },
    { style: [styles.cornerBorder, styles.cornerBorderVertical, { top: -10, right: -10 }] },
    // Bottom Left Corner
    { style: [styles.cornerBorder, styles.cornerBorderHorizontal, { bottom: -10, left: -10 }] },
    { style: [styles.cornerBorder, styles.cornerBorderVertical, { bottom: -10, left: -10 }] },
    // Bottom Right Corner
    { style: [styles.cornerBorder, styles.cornerBorderHorizontal, { bottom: -10, right: -10 }] },
    { style: [styles.cornerBorder, styles.cornerBorderVertical, { bottom: -10, right: -10 }] },
  ], []);

  return (
    <View style={styles.borderOverlay}>
      {borderPositions.map((border, index) => (
        <View key={index} style={border.style} />
      ))}
    </View>
  );
});

// Camera Modal Component
const CameraModal = memo(({ 
  visible, 
  onClose, 
  device, 
  codeScanner 
}: any) => {
  const cameraRef = useRef<Camera>(null);

  const backgroundImageSource = useMemo(() => 
    require("../../assets/image/Scanner.png"), []
  );

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.cameraModalContainer}>
        <ImageBackground
          style={styles.scannerBackground}
          source={backgroundImageSource}
        >
          <View style={styles.scannerCameraWrapper}>
            {device && (
              <Camera
                style={styles.cameraStyle}
                device={device}
                isActive={visible}
                ref={cameraRef}
                photo={true}
                codeScanner={codeScanner}
              />
            )}
            <ScannerBorders />
          </View>
          
          <View style={styles.goBackBtnWrapper}>
            <MemoizedButton1
              title="Go back"
              onPress={onClose}
              isLoading={false}
            />
          </View>
        </ImageBackground>
      </View>
    </Modal>
  );
});

interface DashboardHeaderProps {
  profileImage: string;
  onToggle: (data: boolean) => void;
  isflex: boolean;
  modalShown: boolean;
  setModalShown: (shown: boolean) => void;
  userId: string;
}

const DashboardHeader = memo<DashboardHeaderProps>(({
  profileImage,
  onToggle,
  isflex,
  modalShown,
  setModalShown,
  userId,
}) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const { device } = useCreatePostViewModel();
  const dispatch = useDispatch();

  // State management
  const [modalVisible, setModalVisible] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  
  // Refs for debouncing and state management
  const buttonVisibleRef = useRef(false);
  const scannerRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Store selectors with memoization
  const userLoginType = useAppStore(useCallback(state => state.userLoginType, []));
  const profileDetailResponse = useAppSelector(state => state.myProfileData);
  
  // Memoized profile details
  const profileDetails: any = useMemo(() => {
    return profileDetailResponse?.data|| {};
  }, [profileDetailResponse?.data]);

  const showQRScanner = useMemo(() => {
    return profileDetails?.leaderboard === 1;
  }, [profileDetails?.leaderboard]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, []);

  // Optimized event handler for post creation
  const onEventCreate = useCallback(({ postData, fromEventID }) => {
    //@ts-ignore
    // dispatch(onFetchEventPostDetail({
    //   postId: postId,
    //   eventId: fromEventID,
    //   userId: userId,
    // }));
    
    router.push({
      pathname: "/CreateEventPostScreen",
      params: { postData: postData, fromEventID: fromEventID },
    });
  }, [dispatch, userId]);

  // Optimized QR code processing
  const processScannedCode = useCallback((scannedValue) => {
    try {
      if (scannedValue?.includes("profile")) {
        const profile_id = scannedValue.split("/").pop();
        router.push({
          pathname: "/profile/[id]",
          params: {
            id: profile_id,
            isProfile: "true",
            isNotification: "false",
          },
        });
      } else if (scannedValue?.includes("post")) {
        const postId = scannedValue.split("/").pop().split("?")[0];
        const fromEventID = scannedValue.split("fromevent=")[1];
        onEventCreate({ postData: postId, fromEventID });
      } else {
        // Handle encrypted posts
        try {
          const newPost = scannedValue.split("/").pop().split("?")[0];
          const fromEventID = scannedValue.split("fromevent=")[1];
          const encryptionKey = "pet-balloon-post-id";;
          const decryptedBytes = CryptoJS.AES.decrypt(decodeURIComponent(newPost), encryptionKey);
                  const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
                onEventCreate({ postData : decryptedText, fromEventID });
        } catch (error) {
          console.error("Decryption error:", error);
          showToast({ type: "error", text1: "Invalid QR code" });
        }
      }
    } catch (error) {
      console.error("Error processing scanned code:", error);
      showToast({ type: "error", text1: "Failed to process QR code" });
    }
  }, [onEventCreate]);

  // Optimized code scanner with debouncing
  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],
    onCodeScanned: (codes) => {
      if (hasScanned) return;
      
      setHasScanned(true);
      setModalVisible(false);
      
      const scannedValue = codes[0]?.value;
      if (scannedValue) {
        processScannedCode(scannedValue);
      }

      // Reset scan state after delay
      scanTimeoutRef.current = setTimeout(() => {
        setHasScanned(false);
      }, 3000);
    },
  });

  // Optimized permission and scanner handlers
  const handleOpenScanner = useCallback(async () => {
    if (!hasPermission) {
      const permissionGranted = await requestPermission();
      if (permissionGranted) {
        setModalVisible(true);
      } else {
        showToast({ type: "error", text1: "Camera permission denied" });
      }
    } else {
      setModalVisible(true);
    }
  }, [hasPermission, requestPermission]);

  const handleCloseScanner = useCallback(() => {
    setModalVisible(false);
    setHasScanned(false);
  }, []);

  // Optimized button press handlers with debouncing
  const handleProfilePress = useCallback(() => {
    if (buttonVisibleRef.current) return;
    
    buttonVisibleRef.current = true;
    logEvent("profile_click", {
      userId: userId,
    });
    router.push("/ProfileScreen");
    
    timeoutRef.current = setTimeout(() => {
      buttonVisibleRef.current = false;
    }, 200);
  }, []);

  const handleQRPress = useCallback(() => {
    if (scannerRef.current) return;
    
    scannerRef.current = true;
    logEvent("qr_click");
    handleOpenScanner();
    
    timeoutRef.current = setTimeout(() => {
      scannerRef.current = false;
    }, 1000);
  }, [handleOpenScanner]);

  const handleNotificationPress = useCallback(() => {
    logEvent("notification_click");
    router.push("/NotificationScreen");
  }, []);

  // Button opacity styles
  const profileButtonStyle = useMemo(() => ({
    ...styles.profileButton,
    opacity: buttonVisibleRef.current ? 0.2 : 1,
  }), [buttonVisibleRef.current]);

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <TouchableOpacity
        disabled={buttonVisibleRef.current}
        style={profileButtonStyle}
        onPress={handleProfilePress}
      >
        <ProfileImage profileImage={profileImage} />
      </TouchableOpacity>

      <View style={styles.topRightIcons}>
        <View style={{ padding: 2 }}>
          <MemoizedAnimatedToggle isflex={isflex} onToggle={onToggle} />
        </View>
        
        {showQRScanner && (
          <QRScannerIcon
            onPress={handleQRPress}
            isDisabled={scannerRef.current}
          />
        )}
        
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={handleNotificationPress}
        >
          <MemoizedNotificationIcon />
        </TouchableOpacity>
      </View>

      {/* Camera Modal */}
      <CameraModal
        visible={modalVisible}
        onClose={handleCloseScanner}
        device={device}
        codeScanner={codeScanner}
      />
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for optimal re-rendering
  return (
    prevProps.profileImage === nextProps.profileImage &&
    prevProps.isflex === nextProps.isflex &&
    prevProps.modalShown === nextProps.modalShown &&
    prevProps.userId === nextProps.userId
  );
});

DashboardHeader.displayName = 'DashboardHeader';

export default DashboardHeader;