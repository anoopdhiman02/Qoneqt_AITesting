import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { CheckCircleIcon } from "@/assets/DarkIcon";

const SelectGroupTypeComponent = ({ groupList, groupType, onSelectType }) => {
  return (
    <View
      style={{
        flexDirection: "column",
        marginTop: "5%",
      }}
    >
      <View
        style={{
          flexDirection: "column",
          marginTop: "3%",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            lineHeight: 18,
            fontFamily: fontFamilies.regular,
            color: globalColors.neutralWhite,
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          Select sub-group type
        </Text>
        {groupList.map((item) => {
          return (
            <TouchableOpacity
              key={item?.id}
              onPress={() => onSelectType(item.id)}
              style={{
                flexDirection: "row",

                marginVertical: "5%",
              }}
            >
              <View
                style={{
                  marginTop: 2,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                {groupType === item.id ? (
                  <CheckCircleIcon />
                ) : (
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: globalColors.neutral9,
                      backgroundColor: "transparent",
                    }}
                  />
                )}
              </View>

              <View style={{ marginLeft: "3%" }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fontFamilies.regular,
                    color: globalColors.neutralWhite,
                    lineHeight: 20,
                  }}
                >
                  {item.name}
                </Text>

                <Text
                  style={{
                    alignContent: "flex-start",
                    width: "100%",
                    fontSize: 12,
                    fontFamily: fontFamilies.regular,
                    color: globalColors.neutral9,
                  }}
                >
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default SelectGroupTypeComponent;

const styles = StyleSheet.create({});
