import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import BottomSheetWrap from "@/components/bottomSheet/BottomSheetWrap";
import TextInputComponent from "@/components/element/TextInputComponent";
import Button1 from "@/components/buttons/Button1";
import GradientText from "@/components/element/GradientText";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { useChannelStore } from "@/zustand/channelStore";

const AddNewCategorySheet = ({
  addNewCatNameRef,
  categoryName,
  onEnterCategoryHandler,
  onCreateCategoryHandler,
}) => {
  const { groupId } = useChannelStore();
  return (
    <BottomSheetWrap
      snapPoints={["20%", "40%"]}
      bottomSheetRef={addNewCatNameRef}
    >
      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            color: globalColors.neutralWhite,
            fontSize: 20,
          }}
        >
          Add new category
        </Text>
        <TextInputComponent
          placeHolder="Enter category name"
          value={categoryName}
          onChangeText={(text) => onEnterCategoryHandler(text)}
        />
      </View>
      <Button1
        isLoading={false}
        title="Save"
        onPress={() => onCreateCategoryHandler({ groupId: groupId })}
      />
      <TouchableOpacity onPress={() => addNewCatNameRef.current.close()}>
        <GradientText
          style={{
            fontFamily: fontFamilies.bold,
            fontSize: 17,
            color: globalColors.darkOrchid,
            textAlign: "center",
          }}
        >
          <Text style={{ color: globalColors.neutralWhite, fontSize: 17 }}>
            Cancel
          </Text>
        </GradientText>
      </TouchableOpacity>
    </BottomSheetWrap>
  );
};

export default AddNewCategorySheet;

const styles = StyleSheet.create({});
