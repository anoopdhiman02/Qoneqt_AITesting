import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";
import { globalColors } from "@/assets/GlobalColors";

interface CustomAddModalProps {
  videoPress: () => void;
  galleryPress: () => void;
  musicPress: () => void;
  onClose: () => void;
}

const CustomAddModal = ({
  videoPress,
  galleryPress,
  musicPress,
  onClose,
}: CustomAddModalProps) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
      }}
    >
      <TouchableWithoutFeedback onPress={() => onClose()}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => {
                videoPress();
              }}
            >
              <Image
                style={{ width: 30, height: 30 }}
                source={require("../../../../../assets/image/video-camera.png")}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => {
                galleryPress();
              }}
            >
              <Image
                style={{ width: 30, height: 30 }}
                source={require("../../../../../assets/image/gallery.png")}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => {
                musicPress();
              }}
            >
              <Image
                style={{ width: 30, height: 30 }}
                source={require("../../../../../assets/image/musicalnote.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default CustomAddModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#1C1C1E",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    minHeight: 150,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  modalView: {
    width: 80,
    height: 80,
    borderRadius: 45,
    backgroundColor: globalColors.bgDark2,
    alignItems: "center",
    justifyContent: "center",
  },
});
