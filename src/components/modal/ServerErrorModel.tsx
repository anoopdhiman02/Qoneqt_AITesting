import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming you're using Expo
import { useGlobalStatusStore } from "@/zustand/StatusStore";
import { LinearGradient } from "expo-linear-gradient";
import { globalColors } from "@/assets/GlobalColors";

const { width } = Dimensions.get("window");

const ServerErrorModal = ({ visible }) => {
  const { onSetServerErrorStatus } = useGlobalStatusStore();

  const onPressCloseHandler = () => {
    onSetServerErrorStatus(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onPressCloseHandler}
    >
      <View style={styles.centeredView}>
        <LinearGradient
          colors={["#2B0A6E", "#8954F6", "#8954F6", "#2B0A6E"]}
          style={styles.modalView}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="warning-outline" size={50} color="#C5B3F0" />
          </View>
          <Text style={styles.modalTitle}>Server Error</Text>
          <Text style={styles.modalText}>
            Oops! Server issue. Please try again later.
          </Text>
          <TouchableOpacity style={styles.button} onPress={onPressCloseHandler}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
};

export default ServerErrorModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.85,
  },
  iconContainer: {
    backgroundColor: globalColors.neutral8,
    borderRadius: 50,
    padding: 15,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 15,
    color: globalColors.neutralWhite,
    textAlign: "center",
  },
  modalText: {
    marginBottom: 25,
    textAlign: "center",
    fontSize: 18,
    color: globalColors.neutralWhite,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#C5B3F0", // Light periwinkle color
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 2,
  },
  buttonText: {
    color: "#2B0A6E", // Dark purple for contrast
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
