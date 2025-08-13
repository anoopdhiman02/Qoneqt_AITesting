import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ImageFallBackUser } from '@/utils/ImageUrlConcat'
import { globalColors } from '@/assets/GlobalColors'
import moment from 'moment'
import { OptionsIcon } from '@/assets/DarkIcon'
import { fontFamilies } from '@/assets/fonts'
import MediaPost from '@/components/MediaPost'
import Track_Player from '@/components/AudioPlayer/TrackPlayer';
import { router } from 'expo-router'
import BackIcon from "@expo/vector-icons/AntDesign";

interface ProfilePostComponentProps {
    data?: any;
    backPress?: () => void;
}
    
const ProfilePostComponent: React.FC<ProfilePostComponentProps> = ({data, backPress}) => {
  return (
    <View>
            <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
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
                 <BackIcon
          name="left"
          size={24}
          color={globalColors.neutralWhite}
          onPress={backPress}
          style={{
            padding: 3,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10
          }}
        />
                  <ImageFallBackUser
                    imageData={data.profilePic}
                    fullName={data.name || ''}
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
                      onPress={() =>
                        router.push({
                          pathname: "/profile/[id]",
                          params: {
                            id: data.profileId,
                            isProfile: "true",
                            isNotification: "false",
                          },
                        })
                      }
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
                        {data.name}
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
                        {moment
                          .utc(data.postTime)
                          .utcOffset("+05:30")
                          .fromNow()}
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
                      <TouchableOpacity
                      // onPress={() =>
                      //   onPressGroup({ groupId: params.groupId })
                      // }
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            lineHeight: 11,
                            fontFamily: "RegularFont",
                            color: globalColors.neutral_white["300"],
                          }}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {data.groupName}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={{ right: "10%" }}
                  // onPress={() => {
                  //   onPressPostOption({ postId, params.name, params.profilePic });
                  // }}
                >
                  <OptionsIcon width={24} height={24} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  alignSelf: "stretch",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginTop: 16,
                }}
              >
                <TouchableOpacity
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
                    {data.categoryName}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  // onPress={toggleExpand}
                  disabled
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fontFamilies.medium,
                      color: globalColors.neutral_white["100"],
                      marginTop: "5%",
                    }}
                    // numberOfLines={isExpanded ? undefined : 2}
                  >
                    {data.description}
                  </Text>
                  {data.description?.length > 30 && (
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: fontFamilies.medium,
                        color: globalColors.neutral10,
                      }}
                    >
                      {/* {isExpanded ? "Read Less" : "Read More..."} */}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View>
              {data.postType === "video" || data.postType === "image" ? (
                <MediaPost
                  source={
                    data.postType === "video"
                      ? {thumbnail: data?.video_snap_path, url: data?.post_video || data?.postVideo}
                      : data.postImage
                      ? data.postImage.split(",")
                      : []
                  }
                  type={data.postType}
                  isHome={true}
                  display_height={data?.display_height || []}
                />
              ) : data.postType === "audio" ? (
                <Track_Player
                  Type={data.postAudio}
                  id={data.id}
                  isPlaying={false}
                  setCurrentPlaying={()=>{}}
                />
              ) : (
                <Text>No media available</Text>
              )}
            </View>
          </View>
  )
}

export default ProfilePostComponent