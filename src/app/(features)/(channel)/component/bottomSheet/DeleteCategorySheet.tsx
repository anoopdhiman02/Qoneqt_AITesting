import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Button1 from "@/components/buttons/Button1";
import GradientText from "@/components/element/GradientText";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import BottomSheetWrap from "@/components/bottomSheet/BottomSheetWrap";
import { useChannelStore } from "@/zustand/channelStore";

const DeleteCategorySheet = ({ DeleteCategoryRef, onSubmitDeleteCategory }) => {
  const { categoryDetails } = useChannelStore();

  return (
    <BottomSheetWrap bottomSheetRef={DeleteCategoryRef}>
      <View
        style={{
          alignItems: "center",
          padding: 5,
          width: "100%",
        }}
      >
        <Text
          style={{
            color: globalColors.neutralWhite,
            fontSize: 24,
            fontFamily: fontFamilies.semiBold,
            marginBottom: 20,
          }}
        >
          Delete category
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: globalColors.neutral8,
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 20,
            marginBottom: 20,
            width: "100%",
          }}
        >
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 16,
              fontFamily: fontFamilies.medium,
            }}
          >
            {categoryDetails?.catName}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: globalColors.darkOrchidShade60,
            borderRadius: 10,
            padding: 15,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: globalColors.neutral8,
              fontSize: 14,
              textAlign: "center",
              fontFamily: fontFamilies.regular,
            }}
          >
            Losing all Sub-groups data from the above selected category is
            irreversible and cannot be recovered.
          </Text>
        </View>

        <Button1
          isLoading={false}
          title="Delete"
          onPress={() => {
            DeleteCategoryRef.current.close(),
              onSubmitDeleteCategory({ categoryId: categoryDetails?.catId });
          }}
          style={{
            width: "100%",
            marginBottom: 15,
          }}
        />

        <TouchableOpacity
          onPress={() => DeleteCategoryRef.current.close()}
          style={{
            padding: 10,
          }}
        >
          <GradientText
            style={{
              fontFamily: fontFamilies.bold,
              fontSize: 16,
              color: globalColors.darkOrchid,
            }}
          >
            Cancel
          </GradientText>
        </TouchableOpacity>
      </View>
    </BottomSheetWrap>
  );
};

export default DeleteCategorySheet;
