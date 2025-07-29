import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { AddIcon, ChatIcon, HomeIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";

export type BottomNavigationVariantType = {
  homeIcon?: boolean;
  text2?: string;
  text?: string;
  searchIcon?: boolean;
  text3?: string;
  moreIcon?: boolean;
  text4?: string;
  createPostOrGroupIcon?: boolean;
};

const index = ({
  homeIcon = true,
  text2 = "Search",
  text = "Home",
  searchIcon = true,
  text3 = "Sub-Group",
  moreIcon = true,
  text4 = "More",
  createPostOrGroupIcon = true,
}: BottomNavigationVariantType) => {
  return (
    <View style={styles.bottomNavigationvariant6}>
      <View style={styles.homeParent}>
        {homeIcon && <HomeIcon />}
        <Text style={styles.home}>{text}</Text>
      </View>
      <View style={styles.searchParent}>
        {searchIcon && (
          <Image
            style={styles.searchIcon}
            contentFit="cover"
            source={require("@/assets/image/search.png")}
          />
        )}
        <Text style={styles.search}>{text2}</Text>
      </View>
      <View style={styles.addWrapper}>
        {createPostOrGroupIcon && <AddIcon />}
      </View>
      <View style={styles.chatParent}>
        <ChatIcon />
        <Text style={styles.channel}>{text3}</Text>
      </View>
      <View style={styles.moreParent}>
        {moreIcon && (
          <Image
            style={styles.moreIcon}
            contentFit="cover"
            source={require("@/assets/image/more.png")}
          />
        )}
        <Text style={styles.more}>{text4}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  homeIcon: {
    position: "relative",
    width: 24,
    height: 24,
    overflow: "hidden",
  },
  home: {
    alignSelf: "stretch",
    position: "relative",
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamilies.medium,
    color: globalColors.neutralWhite,
    textAlign: "center",
    marginTop: 4,
  },
  homeParent: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  searchIcon: {
    position: "relative",
    width: 24,
    height: 24,
    overflow: "hidden",
  },
  search: {
    alignSelf: "stretch",
    position: "relative",
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamilies.medium,
    color: globalColors.neutralWhite,
    textAlign: "center",
    marginTop: 4,
  },
  searchParent: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: 16,
  },
  addIcon: {
    position: "relative",
    width: 24,
    height: 24,
  },
  addWrapper: {
    borderRadius: 32,
    backgroundColor: "#020015",
    borderStyle: "solid",
    borderColor: "#e27af8",
    borderWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    marginLeft: 16,
  },
  chatIcon: {
    position: "relative",
    width: 24,
    height: 24,
    overflow: "hidden",
  },
  channel: {
    position: "relative",
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamilies.medium,
    color: globalColors.neutralWhite,
    textAlign: "center",
    marginTop: 4,
  },
  chatParent: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: 16,
  },
  moreIcon: {
    position: "relative",
    width: 24,
    height: 24,
    overflow: "hidden",
  },
  more: {
    position: "relative",
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamilies.medium,
    color: globalColors.neutralWhite,
    marginTop: 4,
  },
  moreParent: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: 16,
  },
  bottomNavigationvariant6: {
    position: "relative",
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    width: 328,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default index;
