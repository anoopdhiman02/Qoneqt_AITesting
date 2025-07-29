import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import KeyboardDismissWrapper from "./KeyboardDismissWrapper";

export interface mobilePropsType {
  onPressCountry: () => void;
  onChangeValue: ({
    nativeEvent: { text },
  }: {
    nativeEvent: { text: string };
  }) => void;
  error: boolean;
  value: string;
  countryCode: { dial_code: string; flag: string };
}

const MobileInput = ({
  onChangeValue,
  error,
  onPressCountry,
  value,
  countryCode,
}: mobilePropsType) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: { nativeEvent: { text: string } }) => {
    const { text } = e.nativeEvent;
    if (text.length <= 10) {
      onChangeValue(e);
    }
  };

  const borderColor = error
    ? globalColors.warning
    : isFocused
    ? globalColors.neutralWhite
    : globalColors.neutral9;

  return (
    <KeyboardDismissWrapper>
      <View style={styles.container}>
        <Text style={styles.label}>Enter mobile number</Text>
        <View style={[styles.inputContainer, { borderColor }]}>
          <TouchableOpacity onPress={onPressCountry} style={styles.countryCode}>
            <Text style={styles.flag}>{countryCode?.flag}</Text>
            <Text style={styles.dialCode}>{countryCode?.dial_code}</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            keyboardType="number-pad"
            maxLength={10}
            placeholder="999-999-9999"
            placeholderTextColor={globalColors.neutral8}
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>
        {error && (
          <Text style={styles.errorText}>Please enter a valid mobile number.</Text>
        )}
      </View>
    </KeyboardDismissWrapper>
  );
};

export default MobileInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: "5%",
    width: "100%",
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutralWhite,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    padding: 5,
    marginTop: "5%",
    height: 50,
    width: "100%",
  },
  countryCode: {
    width: "20%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  flag: {
    fontSize: 20,
  },
  dialCode: {
    fontSize: 14,
    marginLeft: 8,
    color: globalColors.neutralWhite,
    fontFamily: fontFamilies.regular,
  },
  textInput: {
    width: "78%",
    height: "100%",
    marginLeft: 8,
    color: globalColors.neutralWhite,
    fontFamily: fontFamilies.regular,
  },
  errorText: {
    color: globalColors.warning,
    fontSize: 12,
    marginTop: 4,
    fontFamily: fontFamilies.regular,
  },
});
