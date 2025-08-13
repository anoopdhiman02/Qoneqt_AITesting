import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { Dimensions, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  initContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: "90%",
  },
  headerProfileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerUserName: {
    fontSize: 18,
    fontFamily: fontFamilies.semiBold,
    color: globalColors.neutralWhite,
    marginLeft: 8,
    marginRight: 3,
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  chatContainer: {
    flex: 1,
    width: "95%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: globalColors.lightShadeNew,
    marginTop: 10,
  },
  dateContainer: {
    borderRadius: 24,
    backgroundColor: globalColors.neutral2,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "2%",
    paddingHorizontal: "3%",
    marginVertical: 15,
    alignSelf: "center",
  },
  dateText: {
    fontSize: 12,
    lineHeight: 20,
    fontFamily: fontFamilies.light,
    color: globalColors.neutralWhite,
    textAlign: "center",
  },
  messageContainer: {
    alignSelf: "stretch",
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 8,
    paddingHorizontal: 15,
  },
  messageContentWrapper: {
    borderRadius: 16,
    maxWidth: width * 0.77,
  },
  messageBubbleContainer: {
    borderRadius: 16,
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
  },
  currentUserBubble: {
    backgroundColor: "#52348f",
  },
  otherUserBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  imageBubble: {
    padding: 4,
  },
  imageOnlyBubble: {
    padding: 0,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  chatImage: {
    width: "100%",
    height: width * 0.6 * 0.75,
    maxWidth: width * 0.75,
    maxHeight: 300,
    minWidth: 200,
    minHeight: 120,
    backgroundColor: "rgba(137, 84, 246, 0.1)", // Add background color for loading
    borderRadius: 20, // Rounded corners for standalone images
  },
  imageOnlyRadius: {
    borderRadius: 16,
  },
  messageText: {
    fontSize: 15,
    color: globalColors.neutralWhite,
    fontFamily: fontFamilies.regular,
  },
  textWithImage: {
    marginTop: 8,
  },
  timestampContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    margin: 5,
  },
  timestampText: {
    fontSize: 11,
    color: "grey",
    textAlign: "right",
  },
  inputSection: {
    width: "90%",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(116, 84, 244, 0.1)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addButton: {
    paddingHorizontal: 6,
  },
  textInput: {
    flex: 1,
    backgroundColor: "rgba(116, 84, 244, 0.1)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: "white",
    marginHorizontal: 8,
    maxHeight: 100,
    fontFamily: fontFamilies.semiBold,
    borderWidth: 1,
    borderColor: globalColors.subgroupBorder,
    minHeight: 30,
  },
  sendButton: {
    padding: 2,
  },
  restrictedMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  restrictedMessageText: {
    color: "red",
    width: "100%",
    textAlign: "center",
  },
  imageWrapper: {
    position: "relative",
  },
  inputImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  closeButton: {
    position: "absolute",
    top: -5,
    right: -5,
  },
  closeCircle: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    padding: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: width * 0.9,
    height: height * 0.7,
    resizeMode: "contain",
    borderRadius: 10,
  },
  clearChatContainer: {
    alignItems: "center",
  },
  clearChatTitle: {
    color: globalColors.neutralWhite,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  clearChatWarning: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#2B0A6E",
    marginBottom: 20,
  },
  clearChatWarningText: {
    color: "gray",
    fontSize: 14,
    textAlign: "center",
  },
  cancelText: {
    color: globalColors.neutralWhite,
    fontSize: 17,
    marginTop: 10,
  },
  heraderLoadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  bottomContentContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#2B0A6E",
  },
});

export default styles;
