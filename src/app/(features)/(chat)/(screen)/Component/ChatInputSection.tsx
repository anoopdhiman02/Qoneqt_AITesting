import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useCallback } from "react";
import { globalColors } from "@/assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { CloseIcon } from "@/assets/DarkIcon";
import styles from "../UserChatScreen.styles";
import { Dimensions } from "react-native";

const { height } = Dimensions.get("window");

const ChatInputSection = ({
  canSendMessages,
  chatUserDetails,
  handleOnPress,
  handleRemoveImage,
  imageData,
  isKeyboardVisible,
  chatText,
  onMessageSend,
  mediaPress,
  keyboardHeight,
  isInitialLoad,
  insets,
  userId,
}) => {

  if (isInitialLoad) {
    return <View />;
  }
  const getRestrictedMessage = useCallback(() => {
    if (
      chatUserDetails?.block_by_user == 1 &&
      chatUserDetails?.block_by_me == 0
    ) {
      return <Text style={{...styles.restrictedMessageText}}>This user has restricted messaging with you.</Text>;
    }
    if (
      chatUserDetails?.block_by_me == 1 &&
      chatUserDetails?.block_by_user == 0
    ) {
      return <Text style={{...styles.restrictedMessageText}}>You have blocked this user from messaging.</Text>;
    }
    if (
      chatUserDetails?.block_by_me == 1 &&
      chatUserDetails?.block_by_user == 1
    ) {
      return <Text style={{...styles.restrictedMessageText}}>Messaging is restricted between you and this user.</Text>;
    }
    if (
      (chatUserDetails?.follow_by_user == 0 ||
        chatUserDetails?.follow_by_me == 0) &&
      chatUserDetails?.block_by_user == 0 &&
      chatUserDetails?.block_by_me == 0 &&
      userId != 2
    ) {
      return <Text style={{...styles.restrictedMessageText, color: "orange"}}>Only mutual followers can send messages.</Text>;
    }
    return <Text >{''}</Text>;
  }, [chatUserDetails]);

  if (!canSendMessages && userId != 2) {
    return (
      <View style={styles.restrictedMessageContainer}>
        {getRestrictedMessage()}
      </View>
    );
  }

  if((chatUserDetails?.block_by_me == 0 &&
    chatUserDetails?.block_by_user == 0 &&
    chatUserDetails?.follow_by_me == 1 &&
    chatUserDetails?.follow_by_user == 1) || userId == 2){
      return (
        <View
          style={{
            ...styles.inputSection,
            paddingBottom:
              Platform.OS === "ios"
                ? isKeyboardVisible
                  ? keyboardHeight
                  : 2
                : insets.bottom == 0 ? 0 : isKeyboardVisible ? height *0.35 : 2,
          }}
        >
          <View style={styles.inputContainer}>
            {imageData ? (
              <TouchableOpacity onPress={mediaPress}>
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: imageData }}
                    style={styles.inputImage}
                  />
                  <TouchableOpacity
                    onPress={handleRemoveImage}
                    style={styles.closeButton}
                  >
                    <View style={styles.closeCircle}>
                      <CloseIcon />
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.addButton} onPress={mediaPress}>
                <Ionicons
                  name="add-circle-outline"
                  size={24}
                  color="#8954F6"
                />
              </TouchableOpacity>
            )}

            <TextInput
              style={styles.textInput}
              placeholder={imageData ? "Add a caption..." : "Message..."}
              value={chatText}
              multiline
              placeholderTextColor={globalColors.neutral5}
              onChangeText={handleOnPress}
              blurOnSubmit={false}
              returnKeyType="default"
              // textAlignVertical="top"
              // Add ref if needed for focusing
              autoFocus={false}
            />

            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => onMessageSend(chatText)}
              disabled={chatText.trim() === "" && !imageData}
            >
              <Ionicons
                name="send"
                size={24}
                color={
                  chatText.trim() === "" && !imageData
                    ? "#373741ff"
                    : "#8954F6"
                }
              />
            </TouchableOpacity>
          </View>
        </View>
);
    }
    return <View />;
};

export default ChatInputSection;
