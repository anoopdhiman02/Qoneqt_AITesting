import { CloseIcon, GroupIcon, LockIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import BottomSheetWrap from "@/components/bottomSheet/BottomSheetWrap";
import Button1 from "@/components/buttons/Button1";
import GradientText from "@/components/element/GradientText";
import { useScreenTracking } from "@/customHooks/useAnalytics";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export const UserProfile = () => (
  <View
    style={{
      borderRadius: 8,
      borderColor: globalColors.neutral6,
      borderWidth: 0.5,
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      width: "100%",
    }}
  >
    <TouchableOpacity onPress={() => console.log("Image clicked")}>
      <Image
        style={{
          borderRadius: 24,
          width: 40,
          height: 40,
        }}
        // contentFit="cover"
        source={require("@/assets/image/shortimage.png")}
      />
    </TouchableOpacity>
    <View style={{ marginLeft: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => console.log("Group clicked")}>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              fontFamily: fontFamilies.semiBold,
              color: globalColors.neutralWhite,
            }}
          >
            #Game zone
          </Text>
        </TouchableOpacity>
        <View
          style={{
            marginLeft: "auto",
            backgroundColor: globalColors.neutral5,
            borderRadius: 10,
            paddingHorizontal: 8,
          }}
        >
          <Text style={{ color: globalColors.neutralWhite, fontSize: 12 }}>
            Private
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <GroupIcon />
        <Text
          style={{
            fontSize: 12,
            lineHeight: 16,
            fontFamily: fontFamilies.regular,
            color: globalColors.darkOrchidShade20,
            marginLeft: 8,
          }}
        >
          1k+ followers
        </Text>
      </View>
    </View>
  </View>
);

const SuggestedGrpList = () => {
  useScreenTracking("SuggestedGrpList");

  const JoinGroupRef = useRef<BottomSheet>(null);

  return (
    <>
      <View
        style={{
          padding: "5%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 22,
            lineHeight: 26,
            fontFamily: fontFamilies.semiBold,
            color: globalColors.neutralWhite,
          }}
        >
          Suggested group
        </Text>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <GradientText
            style={{
              fontFamily: fontFamilies.bold,
              fontSize: 18,
              color: globalColors.darkOrchidShade20,
              letterSpacing: 0.3,
            }}
          >
            See all
          </GradientText>
        </View>
      </View>
      <View
        style={{
          borderRadius: 16,
          backgroundColor: globalColors.neutral2,
          width: "50%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 14,
        }}
      >
        <TouchableOpacity
          style={{
            alignSelf: "stretch",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <CloseIcon />
        </TouchableOpacity>

        <View
          style={{
            alignSelf: "stretch",
            height: 92,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 2,
          }}
        >
          <Image
            style={{ borderRadius: 8, width: 64, height: 64 }}
            // contentFit="cover"
            source={require("./../../../../assets/image/emptyPost.jpg")}
          />
          <View
            style={{
              alignSelf: "stretch",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: fontFamilies.medium,
                color: globalColors.neutralWhite,
                textAlign: "center",
              }}
            >
              Game zone
            </Text>
            <LockIcon />
          </View>
        </View>
        <View
          style={{
            alignSelf: "stretch",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 12,
          }}
        >
          <TouchableOpacity
            style={{
              borderRadius: 16,
              borderStyle: "solid",
              borderColor: globalColors.neutral5,
              borderWidth: 0.5,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 6,
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                lineHeight: 13,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
              }}
            >
              #PS5
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderRadius: 16,
              borderStyle: "solid",
              borderColor: globalColors.neutral5,
              borderWidth: 0.5,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 6,
              paddingVertical: 4,
              marginLeft: 4,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                lineHeight: 13,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
              }}
            >
              #GTA
            </Text>
          </TouchableOpacity>

          <View
            style={{
              borderRadius: 16,
              borderStyle: "solid",
              borderColor: globalColors.neutral5,
              borderWidth: 0.5,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 6,
              paddingVertical: 4,
              marginLeft: 4,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                lineHeight: 13,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
              }}
            >
              +5
            </Text>
          </View>
        </View>
        <TouchableOpacity
          //   onPress={() => JoinGroupRef.current.expand()}
          onPress={() => console.log("Join group")}
          style={{
            alignSelf: "stretch",
            borderRadius: 8,
            backgroundColor: globalColors.neutral1,
            borderStyle: "solid",
            borderColor: globalColors.warmPink,
            borderWidth: 0.5,
            height: 34,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginTop: 12,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              lineHeight: 15,
              fontFamily: fontFamilies.medium,
              color: globalColors.neutralWhite,
              marginLeft: 8,
            }}
          >
            Join
          </Text>
        </TouchableOpacity>
      </View>
      <BottomSheetWrap
        snapPoints={["20%", "30%"]}
        bottomSheetRef={JoinGroupRef}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 20,
              textAlign: "center",
            }}
          >
            Join group
          </Text>
          <View style={{ width: "100%", marginTop: 16 }}>
            <UserProfile />
          </View>
          <View
            style={{
              width: "100%",
              marginTop: 16,
              backgroundColor: globalColors.slateBlueShade60,
              borderRadius: 10,
              padding: 16,
            }}
          >
            <Text
              style={{
                color: globalColors.neutralWhite,
                textAlign: "center",
                fontSize: 15,
              }}
            >
              This is a private group. Send request to join this group now.
            </Text>
          </View>
          <Button1
            title="Send request"
            onPress={() => JoinGroupRef.current.close()}
          />
          <TouchableOpacity onPress={() => JoinGroupRef.current.close()}>
            <GradientText
              style={{
                fontFamily: fontFamilies.bold,
                fontSize: 17,
                color: globalColors.darkOrchid,
              }}
            >
              <Text style={{ color: globalColors.neutralWhite, fontSize: 17 }}>
                Cancel
              </Text>
            </GradientText>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap>
    </>
  );
};
export default SuggestedGrpList;
