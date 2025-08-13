import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { memo } from "react";
import { globalColors } from "@/assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";

const RenderEmptyState = ({
  from,
  chatUserDetails,
  chatUserData,
  paramsData,
  setChatText,
  sharePhotoPress,
}) => {
  const isPersonalChat = from == "1";
  const displayName = isPersonalChat
    ? chatUserDetails?.full_name || chatUserData?.name || "this user"
    : `#${paramsData?.name || "this channel"}`;
  return (
    <View style={styles.container}>
      {/* Greeting Icon or Avatar */}
      <View style={styles.greetingIcon}>
        <Text style={styles.sayHIText}>{isPersonalChat ? "👋" : "💬"}</Text>
      </View>

      {/* Main Message */}
      <Text style={styles.greetingText}>
        {isPersonalChat ? "Say Hello!" : "Start the Conversation"}
      </Text>

      {/* Sub Message */}
      <Text style={styles.greetingSubText}>
        {isPersonalChat
          ? `Start a conversation with ${displayName}`
          : `Be the first to share something in ${displayName}`}
      </Text>

      {/* Additional context */}
      <Text style={styles.greetingAdditionalText}>
        {isPersonalChat
          ? "Send a message to break the ice 🧊"
          : "Your message will be visible to all members"}
      </Text>

      {/* Quick action buttons */}
      {chatUserDetails?.follow_by_user == 1 &&
        chatUserDetails?.follow_by_me == 1 &&
        chatUserDetails?.block_by_user == 0 &&
        chatUserDetails?.block_by_me == 0 && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setChatText(
                  isPersonalChat ? "Hello! 👋" : "Hello everyone! 👋"
                );
              }}
            >
              <Text style={styles.actionButtonText}>👋 Say Hi</Text>
            </TouchableOpacity>

            {isPersonalChat && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={sharePhotoPress}
              >
                <Text style={styles.actionButtonText}>📷 Share Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
    </View>
  );
};

export default memo(RenderEmptyState);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 70,
  },
  greetingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(82, 52, 143, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  sayHIText: {
    fontSize: 32,
    color: globalColors.neutralWhite,
  },
  greetingText: {
    fontSize: 20,
    fontFamily: fontFamilies.semiBold,
    color: globalColors.neutralWhite,
    textAlign: "center",
    marginBottom: 12,
  },
  greetingSubText: {
    fontSize: 14,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutral7,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 8,
  },
  greetingAdditionalText: {
    fontSize: 12,
    fontFamily: fontFamilies.light,
    color: globalColors.neutral6,
    textAlign: "center",
    lineHeight: 16,
    fontStyle: "italic",
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    backgroundColor: "rgba(82, 52, 143, 0.3)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(82, 52, 143, 0.5)",
  },
  actionButtonText: {
    color: globalColors.neutralWhite,
    fontSize: 12,
    fontFamily: fontFamilies.medium,
  },
});
