import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import ViewWrapper from "@/components/ViewWrapper";
import GoBackNavigation from "@/components/Header/GoBackNavigation";
import { globalColors } from "@/assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";
import GradientText from "@/components/element/GradientText";
import { VerifiedIcon } from "@/assets/DarkIcon";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const data = [
  {
    id: 1,
    name: "MDKaif",
    caption: "@MDShaikh321",
    image: require("./../../../../assets/image/emptyPost.jpg"),
  },
  {
    id: 2,
    name: "Harron",
    caption: "@Shaikh1653",
    image: require("./../../../../assets/image/emptyPost.jpg"),
  },
  {
    id: 3,
    name: "Asad",
    caption: "@SkAsad5250",
    image: require("./../../../../assets/image/emptyPost.jpg"),
  },
  {
    id: 4,
    name: "Rajesh",
    caption: "@RGnani9632",
    image: require("./../../../../assets/image/emptyPost.jpg"),
  },
];

const ManageMemberScreen = () => {
  useScreenTracking("ManageMemberScreen");
  return (
    <ViewWrapper>
      <GoBackNavigation header="Manage members" isDeepLink={true} />

      {/* Map over data array */}
      {data.map((member) => (
        <View
          key={member.id}
          style={{
            borderRadius: 8,
            borderColor: globalColors.neutral2,
            borderWidth: 1,
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            marginTop: "4%",
            width: "90%",
            justifyContent: "space-around",
          }}
        >
          <View
            style={{
              width: "80%",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                width: "20%",
                right: "8%",
              }}
            >
              <Image
                style={{
                  borderRadius: 24,
                  width: 48,
                  height: 48,
                  marginRight: 3,
                }}
                source={member.image}
              />
            </View>

            {/* Member Details */}
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                width: "60%",
                left: "10%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <TouchableOpacity
                  onPress={() => console.log("Clicked", member.name)}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      letterSpacing: -0.2,
                      lineHeight: 20,
                      fontFamily: fontFamilies.regular,
                      color: globalColors.neutralWhite,
                      marginRight: 2,
                    }}
                  >
                    {member.name}
                  </Text>
                </TouchableOpacity>
                <VerifiedIcon />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 18,
                    fontFamily: fontFamilies.light,
                    color: globalColors.neutralWhite,
                  }}
                >
                  {member.caption}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              width: "20%",
              left: "8%",
            }}
          >
            {/* Remove Button */}
            <TouchableOpacity
              onPress={() => console.log("Remove", member.name)}
            >
              <GradientText
                style={{
                  fontFamily: fontFamilies.bold,
                  fontSize: 15,
                  lineHeight: 21,
                  color: globalColors.darkOrchid,
                }}
              >
                Remove
              </GradientText>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ViewWrapper>
  );
};

export default ManageMemberScreen;
