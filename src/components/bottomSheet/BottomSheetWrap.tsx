import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, StyleSheet, View, LayoutAnimation, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { globalColors } from "../../assets/GlobalColors";
import { LinearGradient } from "expo-linear-gradient";
import {
  useCommentRef,
} from "@/customHooks/CommentUpdateStore";

interface BottomSheetWrapProps {
  snapPoints?: Array<string>;
  children?: React.ReactNode;
  bottomSheetRef?: any;
  containerStyle?: any;
  isTrending?: boolean | undefined;
}

const BottomSheetWrap:FC<BottomSheetWrapProps> = ({
  bottomSheetRef,
  children,
  snapPoints = ["20%", "30%", "60%"],
  containerStyle,
  isTrending
}) => {
  // variables
  // Memoize the snapPoints
  const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const {
    expandModal,
    setExpandModal,
    inputRef: globalInputRef,
    setInputRef,
  } = useCommentRef();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setExpandModal(false);
    }
  }, []);

  // renders
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        // disappearsOnIndex={5}
        opacity={0.5}
        // appearsOnIndex={0}
        pressBehavior={"close"}
        enableTouchThrough={true}
        style={{
          height: Dimensions.get("screen").height,
          opacity: 10,
          width: "100%",
          position: "absolute",
          ...StyleSheet.absoluteFillObject,
        }}
      />
    ),
    []
  );
  return (
    <BottomSheet
      // enableDynamicSizing
      ref={bottomSheetRef}
      index={-1}
      snapPoints={memoizedSnapPoints}
      backdropComponent={renderBackdrop}
      onChange={handleSheetChanges}
      style={{
        borderRadius: 15,
        overflow: "hidden",
        ...containerStyle
      }}
      handleStyle={{
        backgroundColor: "#2B0A6E",
      }}
      handleIndicatorStyle={{
        backgroundColor: globalColors.neutralWhite,
        width: "20%",
      }}
      // enableDynamicSizing
      enableContentPanningGesture={false}
      enableHandlePanningGesture={true}
      enablePanDownToClose
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
      <View style={{ flex: 1, backgroundColor: "#2B0A6E" }}>
        <LinearGradient
        style={{ flex: 1, padding: "5%", height: "100%", paddingBottom: isKeyboardVisible ? isTrending ? "55%" : "5%": '5%' }}
        colors={["#2B0A6E", "#07072B", "#000000"]}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
      
        {children}
      
      </ScrollView>
      </LinearGradient>
      </View>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
};

export default BottomSheetWrap;

const styles = StyleSheet.create({});
