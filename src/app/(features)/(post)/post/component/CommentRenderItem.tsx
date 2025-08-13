import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import { globalColors } from '@/assets/GlobalColors';
import { ImageUrlConcated } from '@/utils/ImageUrlConcat';
import { UserIcon } from '@/assets/DarkIcon';
import { fontFamilies } from '@/assets/fonts';
import HiddenComment from './HiddenComment';
import RepliesComponent from './RepliesComponent';
import moment from 'moment';
import { router } from 'expo-router';

interface CommentRenderItemProps {
    comment: any;
    onPressConfirmHandler: any;
    setRepliedId: any;
    hideReplies: any;
    toggleHideReplies: any;
    hasReplies: boolean;
    CommentId: string;
    replyPressHandler: () => void;
    deletePressHandler: () => void;
    canDelete?: boolean;
    userId?: string;
}

const CommentRenderItem: React.FC<CommentRenderItemProps> = ({
    comment,
    onPressConfirmHandler,
    setRepliedId,
    hideReplies,
    toggleHideReplies,
    hasReplies,
    CommentId,
    replyPressHandler,
    deletePressHandler,
    canDelete,
    userId
}) => {
  return (
    <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              paddingVertical: 10,
              paddingHorizontal: 10,
            }}
          >
            {comment?.user?.profile_pic?.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  router.push(`/profile/${comment?.user?.id}`);
                }}
              >
              <Image
                style={{
                  borderRadius: 30,
                  width: 40,
                  height: 40,
                  borderColor: globalColors.slateBlueTint20,
                  borderWidth: 0.5,
                  backgroundColor: globalColors.neutralWhite,
                  marginRight: 10,
                }}
                contentFit="cover"
                source={{
                  uri: ImageUrlConcated(comment?.user?.profile_pic),
                }}
              />
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
                <UserIcon />
              </View>
            )}

            {/* Comment Content */}
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 14, fontWeight: "bold" }}
                  onPress={() => {
                    router.push(`/profile/${comment?.user?.id}`);
                  }}
                >
                  {comment?.user?.full_name}
                </Text>
                <Text style={{ color: "#aaa", fontSize: 12, marginLeft: "5%" }}>
                  {moment(comment?.created_at).fromNow()}
                </Text>
              </View>
              <Text style={{ color: "white", fontSize: 14, marginTop: 4 }}>
                {comment?.comment}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: "1%",
                }}
              >
                <View>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      // marginTop: 5,
                    }}
                    onPress={() => {
                        replyPressHandler()
                   
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: fontFamilies.regular,
                        color: globalColors.neutral8,
                      }}
                    >
                      Reply
                    </Text>
                  </TouchableOpacity>
                </View>
{ canDelete && (
                  <TouchableOpacity
                    onPress={() => {
                        deletePressHandler()
                    
                    }}
                    style={{
                      marginLeft: "10%",
                    }}
                  >
                    <Text style={{ color: globalColors.neutral8 }}>Delete</Text>
                  </TouchableOpacity>)}
              </View>

              {comment?.replies?.map((repliedData, key) => {
                const isHidden = hideReplies[CommentId]; // Check if replies are hidden for this comment

                return (
                  !isHidden && (
                   <HiddenComment
                   key={key}
                   repliedData={repliedData}
                   onPressConfirmHandler={onPressConfirmHandler}
                   setRepliedId={setRepliedId}
                   userId={userId}
                   />
                  )
                );
              })}

              {hasReplies && (
                <RepliesComponent
                CommentId={CommentId}
                hideReplies={hideReplies}
                toggleHideReplies={toggleHideReplies}
                />
              )}
            </View>
          </View>
  )
}

export default CommentRenderItem