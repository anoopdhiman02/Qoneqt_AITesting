import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { fontFamilies } from "../../assets/fonts";
import { Image } from "expo-image";
import { globalColors } from "@/assets/GlobalColors";

export interface inputProps extends TextInputProps {
  header?: string;
  onChangeValue?: (e: { nativeEvent: { text: string } }) => void;
  value?: any;
  error?: { status: boolean; message?: string };
  placeHolder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: "calender" | React.ReactNode;
  onPressRightIcon?: () => void;
  mainStyle?: any;
  style?: any;
  onSofteyPress?: () => void;
  noTop?: boolean;
  containerHeight?: number;
  isRequired?: boolean;
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  textColor?: any;
  defaultValue?: any
}

const TextInputComponent = ({
  header,
  value,
  error,
  onChangeValue,
  placeHolder,
  leftIcon,
  rightIcon,
  onPressRightIcon,
  onChangeText,
  keyboardType = "default",
  onBlur,
  onFocus,
  placeholderTextColor = globalColors.neutral9,
  secureTextEntry,
  maxLength,
  autoCapitalize,
  editable = true,
  onSofteyPress,
  noTop,
  containerHeight,
  isRequired,
  defaultValue,
  textColor = "#ffffff"
}: inputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const borderColor = error?.status
    ? "red"
    : isFocused
    ? globalColors.neutralWhite
    : globalColors.neutral6;

  return (
    <View style={[styles.container, { marginTop: noTop ? 0 : "5%" }]}>
      {!!header && (
        <Text style={[styles.header, { color: isFocused ? globalColors.neutralWhite : globalColors.neutral9 }]}>
          {header}
          {isRequired && <Text style={{ color: "red" }}> *</Text>}
        </Text>
      )}

      <View style={[styles.inputWrapper, { borderColor, height: containerHeight === 1 ? 70 : 50 }]}>
        {leftIcon}
        <TextInput
          style={styles.input}
          placeholder={placeHolder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          defaultValue={defaultValue}
          onChange={onChangeValue}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSofteyPress}
          editable={editable}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          multiline={containerHeight === 1}
          numberOfLines={6}
          textAlignVertical="top"
        />
        {rightIcon === "calender" ? (
          <TouchableOpacity onPress={onPressRightIcon}>
            <Image source={require("@/assets/image/calender.png")} style={styles.icon} />
          </TouchableOpacity>
        ) : (
          rightIcon
        )}
      </View>

      {error?.status && (
        <Text style={styles.errorText}>{error?.message}</Text>
      )}
    </View>
  );
};

export default TextInputComponent;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    fontSize: 14,
    fontFamily: fontFamilies.regular,
    textAlign: "left",
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "5%",
    paddingVertical: 12,
    marginTop: 12,
    justifyContent: "space-between",
  },
  input: {
    fontSize: 14,
    flex: 1,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutralWhite,
    width: "85%",
  },
  icon: {
    width: 25,
    height: 25,
  },
  errorText: {
    color: globalColors.warning,
    fontFamily: fontFamilies.regular,
    marginTop: "2%",
  },
});
