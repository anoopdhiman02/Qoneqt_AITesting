import { View, Text, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import { ImageFallBackUser } from '@/utils/ImageUrlConcat';
import { router } from 'expo-router';
import { globalColors } from '@/assets/GlobalColors';
import moment from 'moment';
import { OptionsIcon } from '@/assets/DarkIcon';
import { fontFamilies } from '@/assets/fonts';


interface TopPostComponentProps {
    profilePic: string;
    name: string;
    postTime: string;
    ProfileId: string;
    categoryType: string;
    onPressGroup: (data: any) => void;
    groupId: string;
    onPressPostOption: (data: any) => void;
    description: string;
    groupName: string;
    postId: string;
    handlePressProfile: () => void;
}

const TopPostComponent = ({
    profilePic,
    name,
    postTime,
    ProfileId,
    categoryType,
    onPressGroup,
    groupId,
    onPressPostOption,
    description,
    groupName,
    postId,
    handlePressProfile
}: TopPostComponentProps) => {

  

  return (
    <View style={{ flexDirection: "column", alignItems: "flex-start", width: "96%", marginHorizontal: "2%" }}>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-around",
              }}
            >
              <ImageFallBackUser
                imageData={profilePic}
                fullName={name}
                widths={32}
                heights={32}
                borders={16}
              />
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <TouchableOpacity
                  onPress={() => handlePressProfile()}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 16,
                      fontFamily: "MediumFont",
                      color: globalColors.neutral_white["200"],
                      left: "7%",
                    }}
                  >
                    {name}
                  </Text>
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                    left: "25%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: "RegularFont",
                      color: globalColors.neutral_white["300"],
                    }}
                  >
                    {moment.utc(postTime).utcOffset("+05:30").fromNow()}
                  </Text>
                  <View
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: globalColors.neutral8,
                      marginHorizontal: 8,
                    }}
                  />

                    <Text
                      style={{
                        fontSize: 10,
                        lineHeight: 11,
                        fontFamily: "RegularFont",
                        color: globalColors.neutral_white["300"],
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      onPress={() => onPressGroup({ groupId })}
                    >
                      {groupName}
                    </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                onPressPostOption({ postId, name, profilePic });
              }}
            >
              <OptionsIcon width={24} height={24} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignSelf: "stretch",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {/* <TouchableOpacity
              onPress={() => onPressGroup({ groupId })}
              style={{
                borderRadius: 8,
                backgroundColor: globalColors.slateBlueShade80,
                borderColor: globalColors.warmPinkTint20,
                borderWidth: 0.5,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 16,
                  fontFamily: "MediumFont",
                  color: globalColors.neutral_white["200"],
                }}
              >
                {categoryType}
              </Text>
            </TouchableOpacity> */}

            <TouchableOpacity disabled>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fontFamilies.medium,
                  color: globalColors.neutral_white["100"],
                  marginTop: "5%",
                }}
                // numberOfLines={isExpanded ? undefined : 2}
              >
                {description}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
  )
}

export default memo(TopPostComponent)