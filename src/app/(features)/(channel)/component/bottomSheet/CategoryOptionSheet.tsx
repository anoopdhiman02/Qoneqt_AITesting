import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import BottomSheetWrap from "@/components/bottomSheet/BottomSheetWrap";
import { DeleteAccountIcon, EditIcon } from "@/assets/DarkIcon";
import Button1 from "@/components/buttons/Button1";
import { globalColors } from "@/assets/GlobalColors";

const CategoryOptionSheet = ({
  CategoryOptionRef,
  onPressEditCategory,
  onPressDelereCategory,
  onPressClose,
}) => {
  return (
    <BottomSheetWrap
      snapPoints={["20%", "40%"]}
      bottomSheetRef={CategoryOptionRef}
    >
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          onPress={onPressEditCategory}
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            marginLeft: "5%",
            marginBottom: "3%",
          }}
        >
          <View
            style={{
              padding: "2%",
              borderRadius: 10,
              backgroundColor: globalColors.slateBlueShade60,
            }}
          >
            <EditIcon />
          </View>

          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 18,
              marginTop: "1%",
              marginLeft: "5%",
            }}
          >
            Edit category
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            marginLeft: "5%",
            marginBottom: "3%",
          }}
          // onPress={() => DeleteCategoryRef.current.expand()}
          onPress={onPressDelereCategory}
        >
          <View
            style={{
              padding: "2%",
              borderRadius: 10,
              backgroundColor: globalColors.slateBlueShade60,
            }}
          >
            <DeleteAccountIcon />
          </View>
          <Text
            style={{
              color: "red",
              fontSize: 18,
              marginTop: "1%",
              marginLeft: "5%",
            }}
          >
            Delete category
          </Text>
        </TouchableOpacity>
        <Button1
          isLoading={false}
          title="Cancel"
          onPress={() => CategoryOptionRef.current.close()}
        />
      </View>
    </BottomSheetWrap>
  );
};

export default CategoryOptionSheet;

const styles = StyleSheet.create({});
