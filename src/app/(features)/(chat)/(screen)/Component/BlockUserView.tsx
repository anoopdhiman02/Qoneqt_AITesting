import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { globalColors } from '@/assets/GlobalColors'
import GradientText from '@/components/element/GradientText'
import { fontFamilies } from '@/assets/fonts'
import Button1 from '@/components/buttons/Button1'

const BlockUserView = ({block, onPressBlockButton, loading}: any) => {
  return (
    <View style={{ alignItems: "center", width: "100%" }}>
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
        {block ? "Block" : "Unblock"} profile
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
    {block && (
      <>
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
            They won’t be able to message you or find your profile or
            content on Instagram.
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
      </>
    )}

    <Button1
      isLoading={loading}
      title={block ? "Block" : "Unblock"}
      onPress={onPressBlockButton}
      containerStyle={{ marginHorizontal: "2.5%" }}
    />
    {block && (
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
    )}
  </View>
  )
}

export default BlockUserView