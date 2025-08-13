import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { globalColors } from "@/assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
  },
  mainContainer: {
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1,
  },
  kycContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: globalColors.slateBlueTint20,
  },
  kycSubContainer: {
    flexDirection: "row",
    width: "80%",
  },
  getVerifyText: {
    color: globalColors.neutralWhite,
    fontFamily: fontFamilies.semiBold,
    fontSize: 17.5,
    textAlign: "center",
    left: "10%",
  },
  clickText: {
    color: globalColors.neutralWhite,
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    right: "25%",
  },
  emptyView: {
    height: 0.5,
    width: "100%",
    backgroundColor: globalColors.neutralWhite,
    marginTop: 0.3,
    right: "23%",
  },
  newPostContainer: {
    position: "absolute",
    top: 30,
    left: "50%",
    transform: [{ translateX: -75 }],
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
