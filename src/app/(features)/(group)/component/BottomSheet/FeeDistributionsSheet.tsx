import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import BottomSheetWrap from "@/components/bottomSheet/BottomSheetWrap";
import { globalColors } from "@/assets/GlobalColors";
import Button1 from "@/components/buttons/Button1";
import { fontFamilies } from "@/assets/fonts";
import { CheckCircleIcon } from "@/assets/DarkIcon";
const feeDistributionList = [
  {
    id: 1,
    name: "Equally Among Admins",
    description:
      " Anybody can join this channel and any participants can add people to this group.",
  },
  {
    id: 2,
    name: "Equally Among Admins and Moderators",
    description:
      "Only you can add people or accept requests to join this channel.",
  },
];
const FeeDistributionsSheet = ({
  feesDistributionRef,
  onSelectFeeDistribution,
  feeDistribution,
}) => {
  return (
    <BottomSheetWrap
      snapPoints={["20%", "30%"]}
      bottomSheetRef={feesDistributionRef}
    >
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
            Select Fee distribution
          </Text>
          {feeDistributionList.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={{
                flexDirection: "column",
                marginTop: "3%",
              }}
              onPress={() => onSelectFeeDistribution(item)}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  marginTop: 5,
                }}
              >
                <View
                  style={{
                    alignSelf: "stretch",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => onSelectFeeDistribution({ id: item.id })}
                  >
                    {feeDistribution?.id === item.id ? (
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
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 20,
                      fontFamily: fontFamilies.regular,
                      color: globalColors.neutralWhite,
                      marginLeft: 12,
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
                <View
                  style={{
                    alignSelf: "stretch",
                    flexDirection: "row",
                    paddingLeft: 32,
                    marginTop: 8,
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 12,
                      lineHeight: 16,
                      fontFamily: fontFamilies.regular,
                      color: globalColors.neutral9,
                    }}
                  >
                    {item.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </BottomSheetWrap>
  );
};

export default FeeDistributionsSheet;

const styles = StyleSheet.create({});
