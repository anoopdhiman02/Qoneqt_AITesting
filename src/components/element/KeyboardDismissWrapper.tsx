import React from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";

const KeyboardDismissWrapper = ({ children }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default KeyboardDismissWrapper;
