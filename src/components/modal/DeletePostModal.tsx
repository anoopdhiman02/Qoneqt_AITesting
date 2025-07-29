import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { globalColors } from '@/assets/GlobalColors';
import { fontFamilies } from '@/assets/fonts';

interface DeletePostModalProps {
    setDeletePostModal: (value: boolean) => void;
    deletePostHandler: () => void;
}

const DeletePostModal: React.FC<DeletePostModalProps> = ({ setDeletePostModal, deletePostHandler }) => {
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
                  Delete Post
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
                  Are you sure you want to delete the post?
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
                    onPress={() => {
                      setDeletePostModal(false);
                    }}
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
                    onPress={() => {
                        deletePostHandler();
                    }}
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

export default DeletePostModal