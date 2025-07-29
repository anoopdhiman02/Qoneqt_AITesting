import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import { globalColors } from '@/assets/GlobalColors';
import { ImageUrlConcated } from '@/utils/ImageUrlConcat';
import { UserIcon } from '@/assets/DarkIcon';
import { fontFamilies } from '@/assets/fonts';
import moment from 'moment';

interface HiddenCommentProps {
    repliedData: any;
    onPressConfirmHandler: (key: number) => void;
    setRepliedId: (id: number) => void;
}

const HiddenComment = ({repliedData, onPressConfirmHandler, setRepliedId}: HiddenCommentProps) => {
  return (
    <View
    style={{
      borderRadius: 8,
      flexDirection: "row",
      padding: "3%",
      marginTop: "5%",
      width: "100%",
    }}
  >
    {repliedData.user.profile_pic?.length > 0 ? (
      <Image
        style={{
          borderRadius: 30,
          width: 30,
          height: 30,
          borderColor: globalColors.slateBlueTint20,
          borderWidth: 0.5,
          backgroundColor: globalColors.neutralWhite,
        }}
        contentFit="cover"
        source={{
          uri: ImageUrlConcated(repliedData.user.profile_pic),
        }}
      />
    ) : (
      <View
        style={{
          shadowColor: globalColors.darkOrchidShade80,
        }}
      >
        <UserIcon />
      </View>
    )}

    <View style={{ marginLeft: 12, flex: 1 }}>
      <TouchableOpacity
        onPress={() => {}}
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: fontFamilies.semiBold,
            color: globalColors.neutralWhite,
          }}
        >
          {repliedData.user.full_name}
        </Text>
        <Text
          style={{
            fontSize: 11,
            lineHeight: 18,
            fontFamily: fontFamilies.regular,
            color: globalColors.neutral9,
            marginLeft: 8,
          }}
        >
          {moment
            .utc(repliedData?.created_at)
            .utcOffset("+05:30")
            .fromNow(true)}
        </Text>
      </TouchableOpacity>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          marginTop: 3,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: fontFamilies.regular,
            color: globalColors.neutralWhite,
          }}
        >
          {repliedData?.comment}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          setRepliedId(repliedData.id);
          onPressConfirmHandler(2);
        }}
        style={{
          marginTop: "1%",
        }}
      >
        <Text style={{ color: globalColors.neutral8 }}>
          Delete
        </Text>
      </TouchableOpacity>
    </View>
  </View>
  )
}

export default HiddenComment