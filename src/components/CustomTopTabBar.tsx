import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import React, { FC, useState } from "react";
import { globalColors } from "@/assets/GlobalColors";

interface CustomTopTabBarProps {
  selectedTab?: number;
  setSelectedTab?: (tab: number) => void;
  tabData?: any;
}
const {width} = Dimensions.get("window");
const CustomTopTabBar: FC<CustomTopTabBarProps> = ({
  selectedTab,
  setSelectedTab,
  tabData,
}) => {
  return (
    <View style={styles.container}>
      {tabData?.map((item: any, index: number) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            setSelectedTab(index);
          }}
          style={{
            ...styles.tabItem,
            borderBottomWidth: selectedTab === index ? 5 : 0,
            borderBottomColor:
              selectedTab === index
                ? globalColors.slateBlueTint20
                : "transparent",
          }}
        >
          <Text style={styles.tabText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CustomTopTabBar;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 10,
        width: "100%",
        borderBottomColor: globalColors.neutral_white["400"],
        borderBottomWidth: 0.2,
    },
    tabItem: {
        flex: 1,
        paddingVertical: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        // height: 40,
        width: width * 0.4,
      },
      tabText: {
        fontSize: 18,
        fontFamily: "Nunito-Regular",
        color: globalColors.neutralWhite,
      },
});
