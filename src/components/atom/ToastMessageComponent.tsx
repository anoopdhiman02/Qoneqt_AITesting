import Toast from "react-native-toast-message";

interface ToastProps {
  type: "success" | "error" | "info";
  text1: string;
  text2?: string;
  position?: "top" | "bottom";
  visibilityTime?: number;
}

export const showToast = ({ type, position = "bottom", text1, text2, visibilityTime = 2000 }: ToastProps) => {
  Toast.show({
    type: type,
    text1: text1,
    text2: text2,
    position: position,
    visibilityTime: visibilityTime,
  });
};
