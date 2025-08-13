import React from "react";
import { TouchableOpacity, View, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FloatingActionButton = ({
  onPress,
  icon = "add",
  iconSize = 25,
  iconColor = "white",
  backgroundColor = "#8954F6",
  size = 50,
  bottom = 20,
  right = 20,
  shadowColor = "#000",
  style = {},
  disabled = false,
  animatedValue = null, // Optional animated value for scaling effects
}) => {
  const fabStyles = {
    ...styles.fab,
    bottom: bottom,
    right: right,
    width: size,
    height: size,
    borderRadius: size / 2,
    ...style,
  };

  const backgroundStyles = {
    ...styles.fabBackground,
    backgroundColor: disabled ? "#cccccc" : backgroundColor,
    width: size,
    height: size,
    borderRadius: size / 2,
    shadowColor: shadowColor,
  };

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <AnimatedTouchable
      style={[
        fabStyles,
        animatedValue && {
          transform: [{ scale: animatedValue }],
        },
      ]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <View style={backgroundStyles}>
        <Ionicons
          name={icon}
          size={iconSize}
          color={disabled ? "#999999" : iconColor}
        />
      </View>
    </AnimatedTouchable>
  );
};

// Extended FAB with multiple action buttons
const ExpandableFAB = ({
  onMainPress,
  actions = [],
  isExpanded = false,
  mainIcon = "add",
  expandedIcon = "close",
  ...props
}) => {
  const rotation = isExpanded ? "45deg" : "0deg";

  return (
    <View style={styles.expandableFabContainer}>
      {/* Action buttons */}
      {isExpanded &&
        actions.map((action, index) => (
          <View
            key={index}
            style={[
              styles.actionButton,
              { bottom: (index + 1) * 70 + 20 }, // Stack buttons above main FAB
            ]}
          >
            <FloatingActionButton
              onPress={action.onPress}
              icon={action.icon}
              backgroundColor={action.backgroundColor || "#6B46C1"}
              size={48}
              bottom={0}
              right={0}
            />
          </View>
        ))}

      {/* Main FAB */}
      <FloatingActionButton
        onPress={onMainPress}
        icon={isExpanded ? expandedIcon : mainIcon}
        style={{
          transform: [{ rotate: rotation }],
        }}
        {...props}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    elevation: 5,
    zIndex: 1000,
  },

  fabBackground: {
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 5,
  },

  // Expandable FAB styles
  expandableFabContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },

  actionButton: {
    position: "absolute",
    right: 20,
  },

  // Speed Dial styles
  speedDialContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },

  backdrop: {
    position: "absolute",
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },

  speedDialAction: {
    position: "absolute",
    right: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  actionLabel: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 16,
  },

  actionLabelText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
});

// Usage Examples
const FABExamples = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const actions = [
    {
      icon: "camera",
      onPress: () => console.log("Camera pressed"),
      backgroundColor: "#FF6B6B",
      label: "Camera",
    },
    {
      icon: "image",
      onPress: () => console.log("Gallery pressed"),
      backgroundColor: "#4ECDC4",
      label: "Gallery",
    },
    {
      icon: "document",
      onPress: () => console.log("Document pressed"),
      backgroundColor: "#45B7D1",
      label: "Document",
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* Basic FAB */}
      <FloatingActionButton
        onPress={() => console.log("FAB pressed!")}
        icon="add"
        bottom={100}
      />

      {/* Custom styled FAB */}
      <FloatingActionButton
        onPress={() => console.log("Custom FAB pressed!")}
        icon="heart"
        backgroundColor="#FF6B6B"
        size={50}
        bottom={180}
        right={30}
      />

      {/* Expandable FAB */}
      <ExpandableFAB
        onMainPress={() => setIsExpanded(!isExpanded)}
        isExpanded={isExpanded}
        actions={actions}
        bottom={260}
      />

    </View>
  );
};

export { FloatingActionButton, ExpandableFAB };
export default FloatingActionButton;
