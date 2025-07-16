import { BackHandler, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import React, { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import BackIcon from "@expo/vector-icons/AntDesign";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { ChatIcon, OptionsIcon, ReplyMessageIcon, Share01Icon } from "@/assets/DarkIcon";
import UserStoreDataModel from "@/viewModels/UserStoreDataModal";
import { Image } from "expo-image";

interface NavigationProps {
  header?: string;
  isleftIcon?: boolean;
  onPressLeftIcon?: () => void;
  isHome?: boolean;
  isDeepLink?: any;
  isBack?: boolean;
  containerStyle?: ViewStyle;
  backPress?: () => void;
  onPressMessageIcon?: () => void;
  onPressShareIcon?: () => void;
  isMessageIcon?: boolean;
  isShareIcon?: boolean;
}

const GoBackNavigation = ({
  header,
  isleftIcon,
  onPressLeftIcon,
  isHome,
  isDeepLink,
  isBack,
  containerStyle={width:"90%"},
  backPress,
  onPressMessageIcon,
  onPressShareIcon,
  isMessageIcon,
  isShareIcon
}: NavigationProps) => {
  const { updateUserData } = UserStoreDataModel();
  const router = useRouter();
  const buttonVisibleRef = useRef(false);

  useEffect(() => {
        // Custom back button behavior
        const backAction = () => {
          handleBackPress();
          return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );
    
        return () => {
          backHandler.remove();
        };
      }, []);

  const handleBackPress = () => {
    if (isDeepLink==undefined || isDeepLink=="true") {
      updateUserData();
      router.replace("/DashboardScreen");
    } else {
      if (isHome) {
        router?.replace("/DashboardScreen");
      } else {
        if (router.canGoBack()) {
          router.back();
        } else {
          router?.replace("/DashboardScreen");
        }
      }
    }
  };
  return (
    <View
      style={{
        ...containerStyle,
        height: "5%",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginTop: "5%",
      }}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <BackIcon
          disabled={buttonVisibleRef.current}
          name="left"
          size={24}
          color={globalColors.neutralWhite}
          onPress={() => {
            if (buttonVisibleRef.current) return;
            buttonVisibleRef.current == true;
            if(isBack){
              backPress()
            }else{
              handleBackPress();
            }
          }}
          style={{
            padding: 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        />
        <Text
          style={{
            fontSize: 20,
            fontFamily: fontFamilies.medium,
            color: globalColors.neutralWhite,
            marginLeft: 16,
          }}
        >
          {header}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
        }}
      >
      {isMessageIcon && (
        <TouchableOpacity  onPress={onPressMessageIcon}>
          <Image source={{uri:"https://img.icons8.com/ios-glyphs/30/speech-bubble-with-dots.png"}} style={{width:24,height:24, tintColor:globalColors.neutralWhite }}/>
        </TouchableOpacity>
      )}
      {isShareIcon && (
        <TouchableOpacity style={{marginHorizontal: 5}} onPress={onPressShareIcon}>
          <Share01Icon width={24} height={24} />
        </TouchableOpacity>
      )}
      {isleftIcon && (
        <TouchableOpacity onPress={onPressLeftIcon}>
          <OptionsIcon width={24} height={24} />
        </TouchableOpacity>
      )}
      </View>
    </View>
  );
};

export default GoBackNavigation;

const styles = StyleSheet.create({});
