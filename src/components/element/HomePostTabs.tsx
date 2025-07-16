import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import React from "react";
import { TrendingIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";

const TabData = [
  { id: 0, label: "All Post" },
  { id: 1, label: "Trending posts", icon: TrendingIcon },
];

const HomePostTabs = ({ currentTab, onChangeTab }) => {
  return (
    <View
      style={{
        marginVertical: "3%",
        width: "100%",
        borderBottomWidth: 0.18,
        borderColor: globalColors.warmPinkTint80,
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={
          {
            flex: 1,
            // Optional padding
          }
        }
      >
        {TabData.map((data) => {
          const isSelected = data.id === currentTab;
          return (
            <TouchableOpacity
              key={data.id.toString()}
              onPress={() => onChangeTab(data.id)}
              style={{
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 6,
                borderBottomColor: isSelected
                  ? globalColors.warmPinkShade20
                  : "transparent",
                borderBottomWidth: isSelected ? 3 : 0,
                paddingVertical: 8,
                paddingHorizontal: 16,
                marginHorizontal: 8,
                flexDirection: "row",
                borderColor: isSelected ? globalColors.warmPink : "transparent",
                // borderBottomEndRadius: 1,
                width: "45%",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: isSelected
                    ? fontFamilies.semiBold
                    : fontFamilies.regular,
                  color: isSelected
                    ? globalColors.neutralWhite
                    : globalColors.neutral9,
                }}
              >
                {data.label}
              </Text>
              {data.icon && data.id === 1 && <data.icon />}
              {isSelected && (
                <View
                  style={{
                    backgroundColor: globalColors.warmPink,
                    height: 2,
                    width: "40%",
                    position: "absolute",
                    bottom: -5,
                    shadowColor: globalColors.warmPinkShade40,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                    elevation: 4,
                  }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default HomePostTabs;
