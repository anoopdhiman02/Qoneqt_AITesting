import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from '../UserChatScreen.styles'
import { R2_PUBLIC_URL } from '@/utils/constants'
import { Image } from 'expo-image'
import RichText from '@/utils/RichText'
import { globalColors } from '@/assets/GlobalColors'
import { fontFamilies } from '@/assets/fonts'
import moment from 'moment'

const RenderChatView = ({item, userId, handleLongPress, toggleModal}) => {
  return (
    <View
          style={{
            ...styles.messageContainer,
            alignItems: item?.receiverId != userId ? "flex-end" : "flex-start",
          }}
        >
          <TouchableOpacity
            onLongPress={() => handleLongPress(item, item._id)}
            activeOpacity={0.8}
            delayLongPress={300}
          >
            <View style={styles.messageContentWrapper}>
              <View
                style={[
                  styles.messageBubble,
                  item?.receiverId != userId
                    ? styles.currentUserBubble
                    : styles.otherUserBubble,
                  item?.fileType === "image" && styles.imageBubble,
                  item?.fileType === "image" &&
                    item?.message == "" &&
                    styles.imageOnlyBubble,
                ]}
              >
                {item?.fileType === "image" && (
                  <TouchableOpacity
                    onPress={() =>
                      toggleModal(R2_PUBLIC_URL + item?.attachment)
                    }
                    onLongPress={() => handleLongPress(item, item._id)}
                    delayLongPress={300}
                    style={[styles.imageContainer]}
                  >
                    <Image
                      source={{ uri: R2_PUBLIC_URL + item?.attachment }}
                      style={[
                        styles.chatImage,
                        item?.message == "" && styles.imageOnlyRadius,
                      ]}
                      contentFit="cover"
                    />
                  </TouchableOpacity>
                )}
                {item?.message && (
                  <Text
                    style={[
                      styles.messageText,
                      item?.fileType === "image" && styles.textWithImage,
                    ]}
                  >
                    <RichText
                      text={item?.message}
                      mentions={[]}
                      styles={{
                        linkText: {
                          color:
                            item?.receiverId != userId
                              ? "pink"
                              : globalColors.lightShadeNew,
                          textDecorationLine: "underline",
                          fontFamily: fontFamilies.bold,
                          fontSize: 15,
                        },
                        hashtagText: {
                          color:
                            item?.receiverId != userId
                              ? "pink"
                              : globalColors.lightShadeNew,
                          fontFamily: fontFamilies.bold,
                          fontSize: 15,
                        },
                      }}
                    />
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.timestampContainer}>
              <Text style={styles.timestampText}>
                {moment
                  .utc(item?.created_at)
                  .utcOffset("+05:30")
                  .format("h:mm A")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
  )
}

export default RenderChatView