import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { globalColors } from "@/assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";

const { height: screenHeight } = Dimensions.get("window");

// Define TypeScript interfaces
interface AttachmentOption {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
}

interface AttachmentDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSelectAttachment: (option: AttachmentOption) => void;
  options?: string[];
  customOptions?: AttachmentOption[];
  title?: string;
}

const AttachmentDrawer = ({
  visible,
  onClose,
  onSelectAttachment,
  options = [],
  customOptions = [],
  title = "Select Attachment",
}) => {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return gestureState.dy > 0;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        slideAnim.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100) {
        onClose();
      } else {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const attachmentOptions = [
    {
      id: "camera",
      title: "Camera",
      subtitle: "Take a photo",
      icon: "camera",
      color: "#FF6B6B",
    },
    {
      id: "gallery",
      title: "Gallery",
      subtitle: "Choose from gallery",
      icon: "images",
      color: "#4ECDC4",
    },
    {
      id: "video",
      title: "Video",
      subtitle: "Record or select video",
      icon: "videocam",
      color: "#45B7D1",
    },
    {
      id: "document",
      title: "Document",
      subtitle: "Share files",
      icon: "document-text",
      color: "#96CEB4",
    },
  ];

  const handleOptionPress = (option: AttachmentOption) => {
    onSelectAttachment(option);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Handle Bar */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {attachmentOptions.map((option) => (
              <>
                {options.includes(option.id) && (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.optionItem}
                    onPress={() => handleOptionPress(option)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.optionIcon,
                        { backgroundColor: option.color },
                      ]}
                    >
                      <Ionicons name={option.icon} size={24} color="#FFFFFF" />
                    </View>
                    <View style={styles.optionText}>
                      <Text style={styles.optionTitle}>{option.title}</Text>
                      <Text style={styles.optionSubtitle}>
                        {option.subtitle}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#8954F6"
                    />
                  </TouchableOpacity>
                )}
              </>
            ))}
          </View>

          {/* Cancel Button */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdropTouchable: {
    flex: 1,
  },
  drawer: {
    backgroundColor: "#1A0D2E",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 34, // Safe area padding
    minHeight: 400,
    borderTopWidth: 1,
    borderTopColor: "rgba(137, 84, 246, 0.2)",
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(137, 84, 246, 0.1)",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fontFamilies.bold,
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 4,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "rgba(137, 84, 246, 0.05)",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(137, 84, 246, 0.1)",
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: fontFamilies.semiBold,
    color: "#FFFFFF",
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    fontFamily: fontFamilies.regular,
    color: "#8954F6",
  },
  cancelButton: {
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    backgroundColor: "rgba(137, 84, 246, 0.1)",
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(137, 84, 246, 0.2)",
  },
  cancelText: {
    fontSize: 16,
    fontFamily: fontFamilies.semiBold,
    color: "#FFFFFF",
  },
});

export default AttachmentDrawer;
