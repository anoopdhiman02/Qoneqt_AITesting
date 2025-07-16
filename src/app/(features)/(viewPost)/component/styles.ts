
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { Dimensions, Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#2B0A6E",
  },
  handleStyle: {
    backgroundColor: "#2B0A6E",
  },
  handleIndicatorStyle: {
    backgroundColor: globalColors.neutralWhite,
    width: "20%",
  },
  backdropStyle: {
    height: Dimensions.get("screen").height,
    opacity: 10,
    width: "100%",
    position: "absolute",
    ...StyleSheet.absoluteFillObject,
  },
  gradientContainer: {
    flex: 1,
    height: "100%",
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 2,
  },
  headerContainer: {
    width: "100%",
    justifyContent: "center",
  },
  headerText: {
    color: globalColors.neutralWhite,
    fontSize: 20,
    textAlign: "center",
  },
  listContainer: {
    flex: 1,
    paddingBottom: 10,
  },
  commentContainer: {
    borderRadius: 8,
    flexDirection: "row",
    padding: "3%",
    marginTop: "5%",
    width: "100%",
  },
  profileImage: {
    borderRadius: 30,
    width: 38,
    height: 38,
    borderColor: globalColors.slateBlueTint20,
    borderWidth: 0.5,
    backgroundColor: globalColors.neutralWhite,
  },
  replyProfileImage: {
    borderRadius: 30,
    width: 30,
    height: 30,
    borderColor: globalColors.slateBlueTint20,
    borderWidth: 0.5,
    backgroundColor: globalColors.neutralWhite,
  },
  userIconContainer: {
    shadowColor: globalColors.darkOrchidShade80,
  },
  commentContentContainer: {
    marginLeft: 12,
    flex: 1,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
    color: globalColors.neutral_white["100"],
  },
  verifiedIcon: {
    marginLeft: 5,
  },
  timeText: {
    fontSize: 11,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutral_white["300"],
    marginLeft: 8,
  },
  commentTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 3,
    width: "100%",
  },
  commentText: {
    fontSize: 13,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutral_white["200"],
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "1%",
  },
  replyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  replyText: {
    fontSize: 12,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutral_white["300"],
  },
  viewRepliesText: {
    fontSize: 14,
    fontFamily: fontFamilies.bold,
    color: globalColors.neutral5,
  },
  deleteText: {
    color: globalColors.neutral_white["300"],
  },
  hideRepliesButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 5,
    alignSelf: "flex-start",
  },
  hideRepliesText: {
    fontSize: 12,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutral_white["300"],
  },
  emptyContainer: {
    marginTop: "5%",
  },
  emptyText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 22,
    color: globalColors.neutral7,
    textAlign: "center",
  },
  // Enhanced input container styles
  inputOuterContainer: {
    // backgroundColor: "#2B0A6E",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: globalColors.neutral4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    maxHeight: 120, // Limit max height
  },
  textInputContainer: {
    flex: 1,
    marginRight: 12,
    borderWidth: 0.6,
    borderColor: globalColors?.neutral4,
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  textInput: {
    fontSize: 14,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutralWhite,
    maxHeight: 80, // Max height for multiline
    minHeight: Platform.OS === "ios" ? 20 : 40,
    textAlignVertical: "top",
    paddingTop: Platform.OS === "ios" ? 0 : 8,
  },
  replyIndicator: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  replyIndicatorText: {
    fontSize: 14,
    color: globalColors.neutral8,
    fontFamily: fontFamilies.regular,
  },
  sendButton: {
    paddingBottom: Platform.OS === "ios" ? 8 : 12,
    paddingLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: globalColors.neutral2,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fontFamilies.bold,
    color: globalColors.neutralWhite,
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutralWhite,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
    backgroundColor: globalColors.neutral4,
  },
  modalButtonText: {
    color: globalColors.neutralWhite,
    fontFamily: fontFamilies.medium,
  },
});