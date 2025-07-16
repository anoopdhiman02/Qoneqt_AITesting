import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC } from 'react'
import { CameraIcon, PhotoIcon } from '@/assets/DarkIcon';
import { globalColors } from '@/assets/GlobalColors';
import BottomSheetWrap from './BottomSheetWrap';
import GradientText from "@/components/element/GradientText";
import { fontFamilies } from "@/assets/fonts";
import { Image } from "expo-image";

interface SelectMediaBottomSheetProps {
  mediaRef?: any ,
  onCaptureImage?: () => void,
  onPressCamera?: () => void,
  imageData?: Image | null,
  imageFileData?: string | null,
  onPressGallary?: () => void,
}
const SelectMediaBottomSheet:FC<SelectMediaBottomSheetProps> = ({
  mediaRef,
  onCaptureImage,
  onPressCamera,
  imageData,
  imageFileData,
  onPressGallary,
}) => {
  return (
    <BottomSheetWrap bottomSheetRef={mediaRef} snapPoints={["20%", "45%"]}>
      <View style={{ alignItems: "center", padding: 20 }}>
        <Text
          style={{
            color: globalColors.neutralWhite,
            fontSize: 20,
            marginBottom: 20,
          }}
        >
          Select to upload image
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "15%",
          }}
        >
          <TouchableOpacity
            onPress={()=> { onPressCamera(); mediaRef?.current?.close(); }}
            style={{
              borderRadius: 16,
              backgroundColor: globalColors.neutral3,
              overflow: "hidden",
              width: "40%",
              height: "85%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CameraIcon />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={()=> { onPressGallary(); mediaRef?.current?.close(); }}
            style={{
              borderRadius: 16,
              backgroundColor: globalColors.neutral3,
              overflow: "hidden",
              width: "40%",
              height: "85%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PhotoIcon />
            <Text style={{ color: globalColors.neutralWhite }}>
              {/* @ts-ignore */}
              {imageData?.length > 0 ? "Gallery" : "Gallery"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => mediaRef.current.close()}
          style={{ marginTop: "10%" }}
        >
          <GradientText
            style={{
              fontFamily: fontFamilies.bold,
              fontSize: 17,
            }}
          >
            Cancel
          </GradientText>
        </TouchableOpacity>
      </View>
    </BottomSheetWrap>
  );
};

export default SelectMediaBottomSheet

const styles = StyleSheet.create({})