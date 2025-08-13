import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { showToast } from "@/components/atom/ToastMessageComponent";
import React from "react";
import { Text, StyleSheet, Linking, Alert, TouchableOpacity } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { router } from "expo-router";

interface MentionData {
  username: string;
  replacedText: string;
  userId: string;
}

interface RichTextProps {
  text: string;
  mentions?: MentionData[];
  //   onUserPress?: (userId: string, displayName: string) => void;
  styles?: {
    linkText?: any;
    mentionText?: any;
    hashtagText?: any;
    normalText?: any;
    inactiveMentionText?: any;
  };
}

interface TextPart {
  type: "text" | "url" | "mention" | "hashtag";
  content?: string;
  text?: string;
  displayName?: string;
  userId?: string | null;
  tag?: string;
  start?: number;
  end?: number;
}

const defaultStyles = StyleSheet.create({
  linkText: {
    color: globalColors.lightShadeNew,
    textDecorationLine: "underline",
    fontFamily: fontFamilies.bold,
    fontSize: 15
  },
  mentionText: {
    color: globalColors.lightShadeNew,
    fontFamily: fontFamilies.bold,
    fontSize: 15,
  },
  hashtagText: {
    // color: "#1DA1F2",
    color: globalColors.lightShadeNew,
    fontFamily: fontFamilies.bold,
    fontSize: 15,
  },
  normalText: {
    color: "#ffffff",
  },
  // Style for mentions without valid user data
  inactiveMentionText: {
    color: "#666666",
    fontFamily: fontFamilies.bold,
  },
});

// Handler functions
const handleUrlPress = async (url: string) => {
  try {
    const supported = await Linking.canOpenURL(url);
    console.log("supported", supported, url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "Don't know how to open this URL: " + url);
    }
  } catch (error) {
    Alert.alert("Error", "An error occurred while opening the URL");
  }
};

const handleHashtagPress = (hashtag: string) => {
  router.push({
    pathname: "/HashtagPost",
    params: { hashtag: hashtag },
  });
};

const handleUserPress = (userId: string, displayName: string) => {
  // Navigate to user profile or show user info
  Alert.alert("User Pressed", `User: ${displayName} (ID: ${userId})`);
  // Example: navigation.navigate('UserProfile', { userId });
};

const copyToClipboardValue = (value: any) => {
  Clipboard.setString(value);
  showToast({ type: "success", text1: "copied to clipboard!" });
};

export const RichText: React.FC<RichTextProps> = ({
  text,
  mentions = [],
  //   onUserPress = () => {},
  styles: customStyles = {},
}) => {
  const styles = { ...defaultStyles, ...customStyles };

  const renderRichText = () => {
    // More robust URL regex that handles complex URLs including hyphens in paths
    const urlRegex =
      /https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.-])*(?:\?(?:[\w&=%.-])*)?(?:\#(?:[\w.-])*)?)?/g;

    // Updated regex to match displayName format: @DisplayName
    const mentionRegex = /@([^@#\s]+)/g;
    const hashtagRegex = /#(\w+)/g;

    // Split text into parts and identify special elements
    const parts: TextPart[] = [];
    let lastIndex = 0;

    // Find all matches and their positions
    const matches: TextPart[] = [];

    // URLs - Reset regex before using
    urlRegex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = urlRegex.exec(text)) !== null) {
      matches.push({
        type: "url",
        text: match[0],
        start: match.index,
        end: match.index + match[0].length,
      });
    }

    // Mentions - now captures full display names
    const mentionRegexGlobal = /@([^@#\s]+)/g;
    while ((match = mentionRegexGlobal.exec(text)) !== null) {
      // Find the corresponding user from mentions array (if mentions exist)
      const mentionData =
        mentions.length > 0
          ? mentions.find((m: MentionData) => m.username === match[1].trim())
          : null;

      matches.push({
        type: "mention",
        text: mentionData ? mentionData.replacedText : match[0], // Use original @username if no mention data
        displayName: match[1].trim(),
        userId: mentionData ? mentionData.userId : null,
        start: match.index,
        end: match.index + match[0].length,
      });
    }

    // Hashtags
    const hashtagRegexGlobal = /#(\w+)/g;
    while ((match = hashtagRegexGlobal.exec(text)) !== null) {
      matches.push({
        type: "hashtag",
        text: match[0],
        tag: match[1],
        start: match.index,
        end: match.index + match[0].length,
      });
    }

    // Sort matches by position
    matches.sort((a, b) => (a.start || 0) - (b.start || 0));

    // Remove overlapping matches (URLs take priority)
    const cleanMatches: TextPart[] = [];
    matches.forEach((match) => {
      const isOverlapping = cleanMatches.some(
        (existing) =>
          ((match.start || 0) >= (existing.start || 0) &&
            (match.start || 0) < (existing.end || 0)) ||
          ((match.end || 0) > (existing.start || 0) &&
            (match.end || 0) <= (existing.end || 0))
      );

      if (!isOverlapping) {
        cleanMatches.push(match);
      }
    });

    // Build parts array
    cleanMatches.forEach((match) => {
      // Add text before this match
      if ((match.start || 0) > lastIndex) {
        parts.push({
          type: "text",
          content: text.substring(lastIndex, match.start),
        });
      }

      // Add the match
      parts.push(match);
      lastIndex = match.end || 0;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: "text",
        content: text.substring(lastIndex),
      });
    }

    return parts.map((part: TextPart, index: number) => {
      console.log("part", part);
      switch (part.type) {
        case "url":
          return (
            <TouchableOpacity style={{width: '100%', paddingHorizontal: 10}} key={index} onPress={() => handleUrlPress(part.text || "")} onLongPress={() => copyToClipboardValue(part.text || "")}>
            <Text
              key={index}
              style={[styles.linkText]}
            >
              {part.text}
            </Text>
            </TouchableOpacity>
          );
        case "mention":
          return (
            <Text
              key={index}
              style={
                part.userId ? styles.mentionText : styles.inactiveMentionText
              }
              onPress={() => {
                // Only call onUserPress if we have a valid userId
                if (part.userId) {
                  handleUserPress(part.userId, part.displayName || "");
                }
                // If no userId, you could optionally show a message or do nothing
              }}
            >
              {part.text}
            </Text>
          );
        case "hashtag":
          return (
            <Text
              key={index}
              style={styles.hashtagText}
              onPress={() => handleHashtagPress(part.tag || "")}
              onLongPress={() => copyToClipboardValue(part.tag || "")}
            >
              {part.text}
            </Text>
          );
        default:
          return (
            <Text key={index} style={styles.normalText}>
              {part.content}
            </Text>
          );
      }
    });
  };

  return <>{renderRichText()}</>;
};

export default RichText;
