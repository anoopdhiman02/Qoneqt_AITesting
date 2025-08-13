import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import { Image } from "expo-image";
import { useIsFocused } from "@react-navigation/native";
import {
  Alert,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import ViewWrapper from "../../../../components/ViewWrapper";
import Button1 from "../../../../components/buttons/Button1";
import RNFS from "react-native-fs";
import TextInputComponent from "../../../../components/element/TextInputComponent";
import GoBackNavigation from "../../../../components/Header/GoBackNavigation";
import { InfoIcon, LockIcon, SquareTickIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import GradientText from "@/components/element/GradientText";
import { router, useLocalSearchParams } from "expo-router";
import { showToast } from "@/components/atom/ToastMessageComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DocumentPicker from "react-native-document-picker";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { ClaimGroupSubmitRequest } from "@/redux/reducer/group/ClaimGroup";
import { useAppStore } from "@/zustand/zustandStore";
import { useScreenTracking } from "@/customHooks/useAnalytics";

// Constants
const DOWNLOAD_CONFIG = {
  fileUrl: "https://qoneqt.com/docs/sample_authority_letter.docx",
  fileName: "sample_authority_letter.docx",
};

// Memoized Components
const Caption = memo(({ userId, mobileNumber, onUserIdChange, onMobileNumberChange }: any) => {
  return (
    <View style={styles.captionContainer}>
      <Text style={styles.captionText}>
        Submit your request by providing a few details about yourself
      </Text>

      <TextInputComponent
        header="User ID"
        placeHolder="Enter User Id"
        value={String(userId || '')}
        onChangeValue={onUserIdChange}
        containerHeight={0}
      />

      <TextInputComponent
        header="Mobile Number"
        value={mobileNumber || ''}
        placeHolder="+91 Enter Mobile Number"
        onChangeValue={onMobileNumberChange}
        containerHeight={0}
      />
    </View>
  );
});

const ChooseFile = memo(({ onDocumentPicker, fileName }: any) => (
  <TouchableOpacity onPress={onDocumentPicker} style={styles.chooseFileContainer}>
    {!fileName ? (
      <AntDesign name="cloudupload" size={54} color="white" />
    ) : (
      <AntDesign name="file1" size={54} color="white" />
    )}

    <GradientText style={styles.chooseFileText}>
      <Text style={styles.chooseFileLabel}>
        {fileName || "Choose file"}
      </Text>
    </GradientText>
  </TouchableOpacity>
));

const LetterTemplate = memo(({ onDownload }: any) => (
  <View style={styles.letterTemplateContainer}>
    <View style={styles.letterTemplateIcon}>
      <Image
        style={styles.letterTemplateImage}
        contentFit="cover"
        source={require("@/assets/image/vsword.png")}
      />
    </View>
    
    <View style={styles.letterTemplateContent}>
      <Text style={styles.letterTemplateTitle}>Letter template</Text>
      <Text style={styles.letterTemplateDescription}>
        You can download the attached template and make use of it.
      </Text>
    </View>
    
    <TouchableOpacity onPress={onDownload} style={styles.downloadButton}>
      <AntDesign name="download" size={24} color="white" />
    </TouchableOpacity>
  </View>
));

const WeEnsure = memo(({ isAgree, onSelectAgreement }: any) => {
  const handleInfoPress = useCallback(() => {
    showToast({ type: "info", text1: "This feature not available right now" });
  }, []);

  return (
    <View style={styles.weEnsureContainer}>
      {/* Info Section */}
      <TouchableOpacity onPress={handleInfoPress} style={styles.infoSection}>
        <InfoIcon />
        <Text style={styles.infoText}>Why is this needed?</Text>
      </TouchableOpacity>

      {/* Security Section */}
      <View style={styles.securitySection}>
        <LockIcon style={styles.lockIcon} />
        <Text style={styles.securityText}>
          We ensure your data is securely encrypted with TLS
        </Text>
      </View>

      {/* Agreement Section */}
      <TouchableOpacity onPress={onSelectAgreement} style={styles.agreementSection}>
        {isAgree ? (
          <SquareTickIcon />
        ) : (
          <View style={styles.uncheckedBox} />
        )}
        <Text style={styles.agreementText}>
          By registering, I agree to Qoneqt's Terms & Conditions and Privacy Policy
        </Text>
      </TouchableOpacity>
    </View>
  );
});

// Main Component
const ClaimGroupScreen = () => {
  useScreenTracking("ClaimGroupScreen");
  // Redux & Store
  const dispatch = useAppDispatch();
  const claimGroupResponse = useAppSelector((state) => state?.claimGroup);
  const { userId: storeUserId } = useAppStore();
  
  // Local Search Params
  const { groupid } = useLocalSearchParams();
  
  // Local State
  const [formData, setFormData] = useState({
    userId: '',
    mobileNumber: '',
    isAgree: false,
  });
  const [fileData, setFileData] = useState({
    name: null,
    document: null,
  });
  const [loading, setLoading] = useState({
    submit: false,
    download: false,
  });
  const [apiCalled, setApiCalled] = useState(false);
  
  // Hooks
  const isFocused = useIsFocused();

  // Memoized values
  const isFormValid = useMemo(() => {
    return formData.userId && 
           formData.mobileNumber && 
           fileData.document && 
           formData.isAgree;
  }, [formData, fileData]);

  // Load user data from storage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDetails = await AsyncStorage.getItem("user-details");
        if (userDetails) {
          const user = JSON.parse(userDetails);
          setFormData(prev => ({
            ...prev,
            userId: user.id || storeUserId || '',
            mobileNumber: user.phone || '',
          }));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        showToast({ type: "error", text1: "Failed to load user data" });
      }
    };

    if (isFocused) {
      loadUserData();
    }
  }, [isFocused, storeUserId]);

  // Handle API response
  useEffect(() => {
    if (apiCalled && claimGroupResponse?.success) {
      const { success, message }: any = claimGroupResponse.data || {};
      
      if (success) {
        showToast({ type: "success", text1: message });
        router.back();
      } else {
        showToast({ type: "error", text1: message });
      }
      
      setApiCalled(false);
      setLoading(prev => ({ ...prev, submit: false }));
    } else if (apiCalled && claimGroupResponse?.success === false) {
      showToast({ type: "error", text1: "Request failed. Please try again." });
      setApiCalled(false);
      setLoading(prev => ({ ...prev, submit: false }));
    }
  }, [claimGroupResponse, apiCalled]);

  // Form handlers
  const handleUserIdChange = useCallback((newUserId) => {
    setFormData(prev => ({ ...prev, userId: newUserId }));
  }, []);

  const handleMobileNumberChange = useCallback((newMobileNumber) => {
    setFormData(prev => ({ ...prev, mobileNumber: newMobileNumber }));
  }, []);

  const handleAgreementToggle = useCallback(() => {
    setFormData(prev => ({ ...prev, isAgree: !prev.isAgree }));
  }, []);

  // Document picker
  const handleDocumentPicker = useCallback(async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        mode: "open",
        allowMultiSelection: false,
      });

      const selectedFile = result[0];
      setFileData({
        name: selectedFile.name,
        document: selectedFile,
      });
      
      showToast({ type: "success", text1: "File selected successfully" });
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error('Document picker error:', error);
        showToast({ type: "error", text1: "Failed to select file" });
      }
    }
  }, []);

  // Permission handler
  const requestStoragePermissions = useCallback(async () => {
    if (Platform.OS !== "android") return true;

    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ];

      const results = await PermissionsAndroid.requestMultiple(permissions);
      
      const allGranted = Object.values(results).every(
        result => result === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!allGranted) {
        showToast({ type: "error", text1: "Storage permission required" });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Permission request error:', error);
      showToast({ type: "error", text1: "Permission request failed" });
      return false;
    }
  }, []);

  // File download handler
  const handleFileDownload = useCallback(async () => {
    const hasPermission = await requestStoragePermissions();
    if (!hasPermission) return;

    setLoading(prev => ({ ...prev, download: true }));

    try {
      const downloadPath = Platform.OS === "android"
        ? `${RNFS.DownloadDirectoryPath}/${DOWNLOAD_CONFIG.fileName}`
        : `${RNFS.DocumentDirectoryPath}/${DOWNLOAD_CONFIG.fileName}`;

      const downloadOptions = {
        fromUrl: DOWNLOAD_CONFIG.fileUrl,
        toFile: downloadPath,
        background: true,
        begin: () => console.log('Download started'),
        progress: (res) => {
          const progressPercent = (res.bytesWritten / res.contentLength) * 100;
          console.log(`Download progress: ${progressPercent.toFixed(2)}%`);
        },
      };

      await RNFS.downloadFile(downloadOptions).promise;
      
      Alert.alert("Download Complete", `File saved to: ${downloadPath}`);
      showToast({ type: "success", text1: "Template downloaded successfully" });
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert("Download Error", "Failed to download the file.");
      showToast({ type: "error", text1: "Download failed" });
    } finally {
      setLoading(prev => ({ ...prev, download: false }));
    }
  }, [requestStoragePermissions]);

  // Form submission
  const handleSubmit = useCallback(() => {
    // Validation
    if (!formData.userId.trim()) {
      showToast({ type: "error", text1: "Please enter a User ID" });
      return;
    }
    
    if (!formData.mobileNumber.trim()) {
      showToast({ type: "error", text1: "Please enter a Mobile Number" });
      return;
    }
    
    if (!fileData.document) {
      showToast({ type: "error", text1: "Please upload a file" });
      return;
    }
    
    if (!formData.isAgree) {
      showToast({ type: "error", text1: "Please agree to terms and conditions" });
      return;
    }

    // Submit request
    setLoading(prev => ({ ...prev, submit: true }));
    setApiCalled(true);
    
    dispatch(ClaimGroupSubmitRequest({
      attachment: fileData.document,
      user_id: formData.userId,
      groupid: groupid,
    }));
  }, [formData, fileData, groupid, dispatch]);

  return (
    <ViewWrapper>
      <View style={styles.container}>
        <GoBackNavigation header="Claim Group" isDeepLink={true} />
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Caption
            userId={formData.userId}
            mobileNumber={formData.mobileNumber}
            onUserIdChange={handleUserIdChange}
            onMobileNumberChange={handleMobileNumberChange}
          />
          
          <Text style={styles.authorityLetterLabel}>
            Authority letter*
          </Text>
          
          <ChooseFile
            onDocumentPicker={handleDocumentPicker}
            fileName={fileData.name}
          />
          
          <LetterTemplate onDownload={handleFileDownload} />
          
          <WeEnsure
            isAgree={formData.isAgree}
            onSelectAgreement={handleAgreementToggle}
          />
        </ScrollView>
        
        <Button1
          isLoading={loading.submit}
          title="Submit"
          onPress={handleSubmit}
        />
      </View>
    </ViewWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "90%",
    marginBottom: "10%",
  },
  scrollView: {
    flex: 1,
  },
  
  // Caption styles
  captionContainer: {
    marginTop: "5%",
  },
  captionText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutralWhite,
    marginBottom: "5%",
  },
  
  // Choose file styles
  chooseFileContainer: {
    borderRadius: 8,
    borderStyle: "dashed",
    borderColor: globalColors.neutral5,
    borderWidth: 1.5,
    width: "100%",
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "3%",
  },
  chooseFileText: {
    fontSize: 16,
    color: globalColors.neutralWhite,
    marginTop: "3%",
  },
  chooseFileLabel: {
    color: globalColors.neutralWhite,
    fontSize: 17,
  },
  
  // Letter template styles
  letterTemplateContainer: {
    borderRadius: 8,
    backgroundColor: "rgba(27, 18, 77, 0.05)",
    borderColor: globalColors.neutral6,
    borderWidth: 0.5,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: "3.8%",
    marginTop: "4%",
  },
  letterTemplateIcon: {
    borderRadius: 8,
    backgroundColor: globalColors.neutral2,
    padding: "3%",
  },
  letterTemplateImage: {
    width: 28,
    height: 28,
  },
  letterTemplateContent: {
    flex: 1,
    marginLeft: "5%",
  },
  letterTemplateTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutralWhite,
  },
  letterTemplateDescription: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutralWhite,
    marginTop: "3%",
  },
  downloadButton: {
    padding: 8,
  },
  
  // Authority letter label
  authorityLetterLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutralWhite,
    marginTop: "5%",
  },
  
  // WeEnsure styles
  weEnsureContainer: {
    paddingHorizontal: "3%",
    marginTop: 20,
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoText: {
    fontSize: 12.5,
    lineHeight: 18,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutral9,
    marginLeft: 8,
  },
  securitySection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  lockIcon: {
    marginRight: 8,
  },
  securityText: {
    fontSize: 12.5,
    lineHeight: 18,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutral9,
  },
  agreementSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  uncheckedBox: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderColor: globalColors.neutral8,
    borderRadius: 2,
    marginRight: 8,
    marginTop: 2,
  },
  agreementText: {
    fontSize: 12.5,
    lineHeight: 18,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutral9,
    flex: 1,
  },
});

export default memo(ClaimGroupScreen);