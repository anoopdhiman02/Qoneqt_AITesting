import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import BottomSheetWrap from "@/components/bottomSheet/BottomSheetWrap";
import { globalColors } from "@/assets/GlobalColors";
import GradientText from "@/components/element/GradientText";
import { fontFamilies } from "@/assets/fonts";
import { CameraIcon, PhotoIcon } from "@/assets/DarkIcon";
import { Image } from "expo-image";

const SelectImageMediaSheet = ({
  imageMediaRef,
  onPressCamera,
  imageData,
  imageFileData,
  onPressGallary,
}) => {
  return (
    <BottomSheetWrap snapPoints={["20%", "45%"]} bottomSheetRef={imageMediaRef}>
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
            onPress={onPressCamera}
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
            onPress={onPressGallary}
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
              {imageData?.length > 0 ? "Gallery" : "Gallery"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => imageMediaRef.current.close()}
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

export default SelectImageMediaSheet;

const styles = StyleSheet.create({});
