import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FC } from "react";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
interface NewPostButtonProps {
  showButton?: boolean;
  onPress?: () => void;
  count?: any;
}
const NewPostButton: FC<NewPostButtonProps> = ({
  showButton,
  onPress,
  count,
}) => {
  return (
    <TouchableOpacity
      style={{
        ...Styles.newPostContainer,
        // opacity: showButton ? 1 : 0,
      }}
      onPress={onPress}
    >
      <Image
        style={Styles.arrowStyle}
        source={require("./../../../assets/images/uparrow.png")}
      />
      <Text style={Styles.newPostText}>
        {count ? (count > 0 ? "New Posts" : "Scroll Up") : "Scroll Up"}
      </Text>
    </TouchableOpacity>
  );
};

export default NewPostButton;

const Styles = StyleSheet.create({
  newPostContainer: {
    position: "absolute",
    top: 30,
    alignSelf: "center",
    flexDirection: "row",
    paddingVertical: "2%",
    paddingHorizontal: "3%",
    borderRadius: 20,
    backgroundColor: globalColors.darkOrchidShade60,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    alignItems: "center",
  },
  arrowStyle: {
    borderRadius: 8,
    width: 15,
    height: 15,
  },
  newPostText: {
    color: "white",
    fontSize: 16,
    paddingHorizontal: 5,
    fontFamily: fontFamilies.semiBold,
  },
});
