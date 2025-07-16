import { View, StyleSheet, Text, Button } from "react-native";
import React, { forwardRef, useMemo } from "react";
import BottomSheet, { useBottomSheet } from "@gorhom/bottom-sheet";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
export type Ref = BottomSheet;

interface Props {
  title: string;
}

const CloseBtn = () => {
  const { close } = useBottomSheet();

  return <Button title="Close" onPress={() => close()} />;
};

const CustomBottomSheet = forwardRef<Ref, Props>((props, ref) => {
  const snapPoints = useMemo(() => ["25%", "50%", "70%"], []);

  return (
    <BottomSheet
      handleStyle={{ display: "none" }}
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      handleIndicatorStyle={{ backgroundColor: globalColors.neutralWhite }}
      backgroundStyle={{ backgroundColor: "#1d0f4e" }}
      handleComponent={null}
      backgroundComponent={null}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.containerHeadline}>{props.title}</Text>
        <CloseBtn />
      </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  containerHeadline: {
    fontSize: 24,
    padding: 20,
    color: globalColors.neutralWhite,
    fontFamily: fontFamilies.semiBold,
  },
});

export default CustomBottomSheet;
