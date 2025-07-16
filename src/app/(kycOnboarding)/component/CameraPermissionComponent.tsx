import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Button1 from "@/components/buttons/Button1";
import { globalColors } from "@/assets/GlobalColors";

const CameraPermissionComponent = ({ onPress }) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={styles.container}>
        <Text
          style={{
            textAlign: "center",
            color: globalColors.neutralWhite,
            marginBottom: "10%",
          }}
        >
          We need your permission to show the camera
        </Text>
        <Button1 onPress={onPress} title="grant permission" />
      </View>
    </View>
  );
};

export default CameraPermissionComponent;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: globalColors.neutral4,
    height: "30%",
    borderRadius: 10,
    width: "90%",
    marginTop: "10%",
    padding: "10%",
  },
});
