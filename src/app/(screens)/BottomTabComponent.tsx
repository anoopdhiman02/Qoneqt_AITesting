import * as React from "react";
import {
  Platform,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import TabBarButton from "../../components/atom/BottomTab/TabBarBotton";
import { router } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { globalColors } from "@/assets/GlobalColors";
import { Add1Icon } from "@/assets/DarkIcon";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { useCommentShow } from "@/customHooks/CommentUpdateStore";



export interface buttonProps {
  label?: string;
  btnType?: string;
  onPress?: () => void;
}

const TabButtonComponent = ({ label, onPress }: buttonProps) => {
  return (
    <View style={{ width: "53%" }}>
      <LinearGradient
        colors={[
          globalColors.darkOrchidTint40,
          globalColors.darkOrchidTint20,
          globalColors.darkOrchidTint40,
        ]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          height: 50,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 15,
          borderColor: globalColors.warmPink,
          borderWidth: 1,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
          onPress={onPress}
        >
          <Text
            style={{
              fontSize: 16,
              lineHeight: 18,
              fontFamily: "semiBold", // Adjust your font family here
              color: globalColors.neutralWhite,
              marginTop: 3,
              textAlign: "center",
            }}
          >
            {label}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const BottomTabComponent = ({ state, descriptors, navigation, keyboardVisible, isComment }) => {
  const [show, setShow] = React.useState(false);
  const offset = useSharedValue<number>(0);
  const progress = useSharedValue(1);
  const { setShow_Button, show_Button } = useCommentShow();

  useEffect(() => {
    setShow(false);
  }, [state.index]);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  const onPressCreate = () => {
    offset.value = withSpring(show ? 0 : -80, { damping: 15 });
    progress.value = withSpring(show ? 0.5 : 0.1, { damping: 15 });
    setShow(!show);
  };

  React.useEffect(() => {
    // Reset the show state when navigating to a different tab
    setShow(false);
  }, [state.index]); // This effect will trigger whenever the active tab changes
  
  if(keyboardVisible || isComment){
    return null;
  }
  
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        zIndex: 99,
        backgroundColor: "#1b192C",
        justifyContent: "center",
        paddingBottom: 8,
        padding: "2%",
        paddingVertical: "5%",
        alignItems: "center",
        marginHorizontal: 5,
        alignSelf: "center",
      }}
    >
      {show && (
        <Animated.View
          style={[
            {
              borderRadius: 8,
              position: "absolute",
              width: "60%",
              gap: 10,
              justifyContent: "center",
              alignItems: "center",
              top: -130,
              right: -30,
            },
            animatedStyles,
          ]}
        >
          <TabButtonComponent
            label="Group"
            onPress={() => {
              offset.value = withSpring(show ? 0 : -80, { damping: 15 });
              progress.value = withSpring(show ? 0.5 : 0.1, { damping: 15 });
              setShow(!show);
              router.push("/CreateGroupScreen");
            }}
          />
          <TabButtonComponent
            label="Post"
            onPress={() => {
              offset.value = withSpring(show ? 0 : -80, { damping: 15 });
              progress.value = withSpring(show ? 0.5 : 0.1, { damping: 15 });
              setShow(!show);
              router.push("/CreatePostScreen");
            }}
          />
        </Animated.View>
      )}

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={
              isFocused ? globalColors.neutralWhite : globalColors.neutral8
            }
            label={label}
            index={index}
          />
        );
      })}
    </View>
  );
};

export default BottomTabComponent;
