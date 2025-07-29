import { StyleSheet, Text, TouchableOpacity, View, TextInput, Platform } from 'react-native'
import React from 'react'
import { AddIcon, PaperPlaneIcon } from '@/assets/DarkIcon';
import { globalColors } from '@/assets/GlobalColors';
import { fontFamilies } from '@/assets/fonts';

const CreatePostView = ({onPress, insets}: {onPress: () => void, insets: any}) => {
  return (
    <TouchableOpacity
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: "3%",
                paddingHorizontal: "4%",
              }}
              onPress={onPress}
            >
                <AddIcon />

    
                <View
                  style={{
                    borderColor: globalColors.neutral7,
                    borderWidth: 1,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 15,
                    // marginBottom: 15,
                  }}
                >
                  <TextInput
                    placeholder="Create Post"
                    placeholderTextColor={globalColors.neutral5}
                    editable={false}
                    style={{
                      flex: 0.8,
                      color: globalColors.neutralWhite,
                      fontSize: 16,
                      height: 42,
                      fontFamily: fontFamilies.regular,
                      pointerEvents: "none"
                    }}
                  />
                </View>

                <PaperPlaneIcon accentHeight={10} />
            </TouchableOpacity>
  )
}

export default CreatePostView

const styles = StyleSheet.create({})