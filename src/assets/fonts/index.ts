import { Platform } from "react-native";

export const fontFamilies = {
  extraLight:
    Platform.OS === "ios" ? "Nunito-ExtraLight" : "Nunito_200ExtraLight",
  light: Platform.OS === "ios" ? "Nunito-Light" : "Nunito_300Light",
  regular: Platform.OS === "ios" ? "Nunito-Regular" : "Nunito_400Regular",
  medium: Platform.OS === "ios" ? "Nunito-Medium" : "Nunito_500Medium",
  semiBold: Platform.OS === "ios" ? "Nunito-SemiBold" : "Nunito_600SemiBold",
  bold: Platform.OS === "ios" ? "Nunito-Bold" : "Nunito_700Bold",
  extraBold: Platform.OS === "ios" ? "Nunito-ExtraBold" : "Nunito_800ExtraBold",
  black: Platform.OS === "ios" ? "Nunito-Black" : "Nunito_900Black",
  extraLightItalic:
    Platform.OS === "ios"
      ? "Nunito-ExtraLightItalic"
      : "Nunito_200ExtraLight_Italic",
  lightItalic:
    Platform.OS === "ios" ? "Nunito-LightItalic" : "Nunito_300Light_Italic",
  regularItalic:
    Platform.OS === "ios" ? "Nunito-RegularItalic" : "Nunito_400Regular_Italic",
  mediumItalic:
    Platform.OS === "ios" ? "Nunito-MediumItalic" : "Nunito_500Medium_Italic",
  semiBoldItalic:
    Platform.OS === "ios"
      ? "Nunito-SemiBoldItalic"
      : "Nunito_600SemiBold_Italic",
  boldItalic:
    Platform.OS === "ios" ? "Nunito-BoldItalic" : "Nunito_700Bold_Italic",
  extraBoldItalic:
    Platform.OS === "ios"
      ? "Nunito-ExtraBoldItalic"
      : "Nunito_800ExtraBold_Italic",
  blackItalic:
    Platform.OS === "ios" ? "Nunito-BlackItalic" : "Nunito_900Black_Italic",
};
