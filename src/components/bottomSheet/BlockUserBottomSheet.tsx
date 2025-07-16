import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import BottomSheetWrap from "./BottomSheetWrap";
import { globalColors } from "@/assets/GlobalColors";
import { Image } from "expo-image";
import { fontFamilies } from "@/assets/fonts";
import { FlashIcon, OptionsIcon, VerifiedIcon } from "@/assets/DarkIcon";
import Button1 from "../buttons/Button1";
import GradientText from "../element/GradientText";

const UserProfile = () => {
  return (
    <View
      style={{
        borderRadius: 8,
        borderStyle: "solid",
        borderColor: "#565957",
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: "4%",
        marginBottom: "50%",
        width: "100%",
      }}
    >
      <TouchableOpacity onPress={() => console.log("image")}>
        <Image
          style={{
            borderRadius: 24,
            width: 40,
            height: 40,
          }}
          contentFit="cover"
          source={require("@/assets/image/shortimage.png")}
        />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "column",
          marginLeft: 12,
        }}
      >
        <View
          style={{
            alignSelf: "stretch",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => console.log("Deekshith")}>
            <Text
              style={{
                fontSize: 14,
                letterSpacing: -0.1,
                lineHeight: 20,
                fontFamily: fontFamilies.semiBold,
                color: globalColors.neutralWhite,
              }}
            >
              Deekshith
            </Text>
          </TouchableOpacity>
          <VerifiedIcon />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 8,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              lineHeight: 16,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutralWhite,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            @deekshith998
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 8,
            }}
          >
            <FlashIcon />
            <Text
              style={{
                fontSize: 12,
                lineHeight: 16,
                fontFamily: fontFamilies.light,
                color: globalColors.neutralWhite,
                marginLeft: 4,
              }}
            >
              8500 perks
            </Text>
          </View>
        </View>
      </View>
      <OptionsIcon width={24} height={24} />
    </View>
  );
};

const BlockUserBottomSheet = ({
  BlockUserRef,
  onPressBlockButton,
  loading,
  screen_type,
}: any) => {
  return (
    <BottomSheetWrap bottomSheetRef={BlockUserRef} snapPoints={screen_type == 't_post'?["20%", "80%"]: ["20%","60"]}>
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 22,
              textAlign: "center",
            }}
          >
            Block profile
          </Text>
        </View>
        <Text
          style={{
            marginTop: "2.5%",
            color: globalColors.neutralWhite,
            fontSize: 14,
            textAlign: "center",
          }}
        >
          This will also block any other accounts that they may have or create
          in the future.
        </Text>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            marginTop: "5%",
            marginBottom: "5%",
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: globalColors.darkOrchidShade60,
              backgroundColor: globalColors.darkOrchidShade60,
              borderRadius: 6,
              paddingHorizontal: "4%",
              paddingVertical: "1.5%",
            }}
          >
            <GradientText
              style={{
                fontFamily: fontFamilies.semiBold,
                fontSize: 20,
                color: globalColors.darkOrchid,
              }}
            >
              {"1"}
            </GradientText>
          </View>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 14,
              marginLeft: "5%",
            }}
          >
            They won’t be able to message you or find your profile or content on
            Instagram.
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            marginBottom: "5%",
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: globalColors.darkOrchidShade60,
              backgroundColor: globalColors.darkOrchidShade60,
              borderRadius: 6,
              paddingHorizontal: "4%",
              paddingVertical: "1.5%",
            }}
          >
            <GradientText
              style={{
                fontFamily: fontFamilies.semiBold,
                fontSize: 20,
                color: globalColors.darkOrchid,
              }}
            >
              {"2"}
            </GradientText>
          </View>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 14,
              marginLeft: "5%",
            }}
          >
            They won’t be noticed that you blocked them.
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            marginBottom: "5%",
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: globalColors.darkOrchidShade60,
              backgroundColor: globalColors.darkOrchidShade60,
              borderRadius: 6,
              paddingHorizontal: "4%",
              paddingVertical: "1.5%",
            }}
          >
            <GradientText
              style={{
                fontFamily: fontFamilies.semiBold,
                fontSize: 20,
                color: globalColors.darkOrchid,
              }}
            >
              {"3"}
            </GradientText>
            {/* <Text style={{ color: "#B898FA", fontSize: 20 }}>3</Text> */}
          </View>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 14,
              marginLeft: "5%",
            }}
          >
            You can unblock them at any time in settings.
          </Text>
        </View>

        <Button1
          isLoading={loading}
          title="Block"
          onPress={onPressBlockButton}
          containerStyle={{marginHorizontal: '2.5%'}}
        />
        <TouchableOpacity onPress={onPressBlockButton}>
          <GradientText
            style={{
              fontFamily: fontFamilies.semiBold,
              fontSize: 17,
              color: globalColors.darkOrchid,
            }}
          >
            {"Block & report"}
          </GradientText>
        </TouchableOpacity>
      </View>
    </BottomSheetWrap>
  );
};

export default BlockUserBottomSheet;
