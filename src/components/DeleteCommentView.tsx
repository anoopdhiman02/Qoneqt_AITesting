import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import { globalColors } from '@/assets/GlobalColors';
import { fontFamilies } from '@/assets/fonts';


interface DeleteCommentViewProps {
    disablePress?:()=>void;
    onPress?:()=>void;
}

const DeleteCommentView:FC<DeleteCommentViewProps> = ({disablePress,onPress}) => {
  return (
     <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: globalColors.neutral2,
                  borderRadius: 10,
                  padding: 20,
                  alignItems: "center",
                  elevation: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: fontFamilies.bold,
                    color: globalColors.neutralWhite,
                    marginBottom: 10,
                  }}
                >
                  Delete Comment
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fontFamilies.regular,
                    color: globalColors.neutralWhite,
                    marginBottom: 20,
                    textAlign: "center",
                  }}
                >
                  Are you sure you want to delete?
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    width: "100%",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 5,
                      minWidth: 100,
                      alignItems: "center",
                      backgroundColor: globalColors.neutral4,
                    }}
                    // onPress={() => setModalVisible(false)}
                    onPress={() => disablePress()}

                  >
                    <Text
                      style={{
                        color: globalColors.neutralWhite,
                        fontFamily: fontFamilies.medium,
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 5,
                      minWidth: 100,
                      alignItems: "center",
                      backgroundColor: globalColors.neutral4,
                    }}
                    // onPress={() => {
                    //   setModalVisible(false);
    
                    //   UpdateDeleteCount();
    
                    //   if (key === 1) {
                    //     handleDeleteComment({
                    //       commentId: CommentId,
                    //     });
                    //   } else if (key === 2) {
                    //     handleReplyDeleteComment({
                    //       ReplyId: repliedId,
                    //       CommentId: CommentId,
                    //     });
                    //   }
                    // }}
                    onPress={() => onPress()}

 
                  >
                    <Text
                      style={{
                        color: globalColors.neutralWhite,
                        fontFamily: fontFamilies.medium,
                      }}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
  )
}

export default DeleteCommentView

const styles = StyleSheet.create({})