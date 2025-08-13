import { SafeAreaView, StyleSheet, View } from "react-native";
import React, { useRef } from "react";
import WebView from "react-native-webview";
import { router, useLocalSearchParams } from "expo-router";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { useAppStore } from "@/zustand/zustandStore";
// import {
//   SetIsLinkedInRegister,
//   SetLinkedInUserId,
// } from '../../utils/localDb/localStorage';
// import ToastMessage from '../atoms/ToastMessage';

const InAppWebView = ({ props, route, navigation }) => {
  const { url, type } = useLocalSearchParams();
  const webViewRef = useRef(null);
  const { setUserId, setIsLinkedinLogin } = useAppStore();

  const injectJavaScript = `
    window.ReactNativeWebView.postMessage(document.documentElement.innerText)
    // document.documentElement.innerText
  `;

  const handleWebViewMessage = async (event: any) => {
    const { data, url } = event.nativeEvent;
    let Data = JSON.parse(data);
    if (Data?.success) {
      const userId = Data?.data?.id;
      setUserId(userId);
      setIsLinkedinLogin(true);
      router?.back();
    } else if (!Data?.success && Data?.message === "already user") {
      showToast({
        text1: "Email already registered , try with another one",
        type: "error",
      });

      router?.back();
    }
    // else if (!data?.success) {
    //  
    //   // router?.back();
    // }
    // if (Number(type) === 1) {
    //   try {
    //     const data = await JSON.parse(event.nativeEvent.data);

    //     if (data.success && data.message.includes("login")) {

    //       // Login successful
    //       const userId = data?.data?.id;
    //       // await SetLinkedInUserId(Number(userId));

    //       setUserId(userId);
    //       setIsLinkedinLogin(true);

    //       router?.back();
    //       // Perform actions such as setting user ID in state or navigating to another screen
    //     } else if (data?.type === "signup") {
    //       if (!data?.success && data?.message === "already user") {
    //         // await SetIsLinkedInRegister(false);
    //         setIsLinkedinLogin(true);
    //         router?.back();
    //         showToast({
    //           text1: "Email already registered , try with another one",
    //           type: "error",
    //         });
    //       } else {
    //         // SetIsLinkedInRegister(true);
    //         // SetLinkedInUserId(Number(data?.userid));
    //         setUserId(Number(data?.userid));
    //         setIsLinkedinLogin(true);
    //         router?.back();
    //       }
    //     } else if (data?.type === "verify_kyc") {
    //
    //     } else if (!data.success) {
    //       router.back();
    //     
    //     }
    //   } catch (error) {
    //     console.error("Error parsing JSON:", error);
    //     // router.back();
    //     showToast({ text1: "Authentication failed", type: "error" });
    //   }
    // } else {
    //   if (event?.nativeEvent?.url.includes("https://qoneqt.com/")) {
    //     let linkedIndata = JSON.parse(event?.nativeEvent?.data);

    //     if (
    //       linkedIndata?.success &&
    //       linkedIndata?.message?.includes("Already verify")
    //     ) {
    //       showToast({
    //         text1: "Already Account Register with Qoneqt",
    //         type: "error",
    //       });
    //       router?.back();
    //     } else if (
    //       linkedIndata?.success &&
    //       linkedIndata?.message?.includes("First verification successfully")
    //     ) {
    //       showToast({ text1: linkedIndata?.message, type: "error" });
    //       router?.back();
    //     } else {
    //       router?.back();

    //       showToast({
    //         text1: linkedIndata?.message,
    //         type: "error",
    //         text2: "something went wrong",
    //       });
    //     }

    //     // router?.back();
    //   } else {
    //   }
    // }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        incognito={true}
        ref={webViewRef}
        sharedCookiesEnabled={true}
        injectedJavaScript={injectJavaScript}
        androidLayerType={"hardware"}
        mediaPlaybackRequiresUserAction={false}
        // startInLoadingState={true}
        allowsInlineMediaPlayback={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        useWebKit
        javaScriptEnabled={true}
        originWhitelist={["*"]}
        lackPermissionToDownloadMessage="failed"
        mediaCapturePermissionGrantType="grantIfSameHostElsePrompt"
        domStorageEnabled={true}
        geolocationEnabled={true}
        automaticallyAdjustContentInsets={true}
        setSupportMultipleWindows={true}
        javaScriptCanOpenWindowsAutomatically={true}
        allowFileAccessFromFileURLs={true}
        allowsLinkPreview={true}
        style={{
          backgroundColor: "transparent",
          opacity: 0.99,
        }}
        source={{
          uri: url,
        }}
        // renderLoading={IndicatorLoadingView}
        // onMessage={event => {

        //   if (!event.nativeEvent.data.includes('https://')) {
        //     // Clipboard.setString(event.nativeEvent.data);
        //   } else {
        //     Linking.openURL(event.nativeEvent.data);
        //   }
        // }}
        onMessage={handleWebViewMessage}
        onError={(error) => {}}
      />
    </SafeAreaView>
  );
};

export default InAppWebView;

const styles = StyleSheet.create({});
