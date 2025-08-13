import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Image } from "expo-image";
import { globalColors } from "@/assets/GlobalColors";

interface StepItem {
  id?: number | string;
  title?: string;
  step?: number;
  isCompleted?: boolean;
}

interface KycStatusBarProps {
  data?: StepItem[];
  completeStep?: number;
}

const KycStatusBar = ({ data = [], completeStep = 0 }: KycStatusBarProps) => {
  const activeThreshold = completeStep + 1;

  return (
    <View style={styles.wrapper}>
      {/* Background Line */}
      <View style={styles.line} />

      {/* Step Indicators */}
      <View style={styles.indicatorRow}>
        {data.map((item, index) => {
          const isCompleted = (item?.step ?? 0) < activeThreshold;

          return (
            <Image
              key={String(item?.id ?? index)}
              style={{...styles.icon, marginLeft: index === 0 ? -4 : 0}}
              contentFit="cover"
              source={
                isCompleted
                  ? require("@/assets/image/checkcircle.png")
                  : require("@/assets/image/checkcircle1.png")
              }
            />
          );
        })}
      </View>
    </View>
  );
};

export default KycStatusBar;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginTop: 16,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  line: {
    height: 1,
    backgroundColor: globalColors.neutral7,
    width: "88%",
    position: "absolute",
    alignSelf: "flex-start",
    bottom: "50%",
  },
  indicatorRow: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 1,
  },
  icon: {
    width: 24,
    height: 24,
    overflow: "hidden",
  },
});
