import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { fontFamilies } from "@/assets/fonts";

const ShadowButton = (onPress) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.iconContainer}>
        {/* <FontAwesome name="google" size={24} color="#BDB4F2" /> */}
      </View>
      <Text style={styles.buttonText}>Sign in with Email</Text>
    </TouchableOpacity>
  );
};

export default ShadowButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0C001A",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: "#6A50F5",
    borderWidth: 1,
    shadowColor: "#6A50F5",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
    opacity: 10,
    marginTop: "5%",
  },
  iconContainer: {
    marginRight: 10,
  },
  buttonText: {
    color: "#BDB4F2",
    fontSize: 18,
    fontFamily: fontFamilies.semiBold,
  },
});
