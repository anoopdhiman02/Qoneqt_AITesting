import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FC, useEffect, useRef } from "react";
import { globalColors } from "@/assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";
import { CloseBig2Icon } from "@/assets/DarkIcon";

interface KycButtonContaine {
  setShowKycBtn?: any;
  onPress?: () => void;
}

const KycButton: FC<KycButtonContaine> = ({ setShowKycBtn, onPress }) => {
  const buttonVisibleRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    if (buttonVisibleRef.current) return;

    buttonVisibleRef.current = true;
    onPress?.();

    timeoutRef.current = setTimeout(() => {
      buttonVisibleRef.current = false;
    }, 2000);
  };

  useEffect(() => {
    // Clear timeout when component unmounts
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  return (
    <View style={Styles.kycContainer}>
      <View style={Styles.kycSubContainer}>
        <TouchableOpacity onPress={() => setShowKycBtn(false)}>
          <CloseBig2Icon />
        </TouchableOpacity>
        <Text style={Styles.getVerifyText}>Get verified now!</Text>
      </View>

      <TouchableOpacity
      disabled={buttonVisibleRef.current}
        onPress={handleClick}
      >
        <Text style={Styles.clickText}>Click here</Text>
        <View style={Styles.emptyView} />
      </TouchableOpacity>
    </View>
  );
};

export default KycButton;

const Styles = StyleSheet.create({
  kycContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: globalColors.slateBlueTint20,
  },
  kycSubContainer: {
    flexDirection: "row",
    width: "80%",
  },
  getVerifyText: {
    color: globalColors.neutralWhite,
    fontFamily: fontFamilies.semiBold,
    fontSize: 17.5,
    textAlign: "center",
    left: "10%",
  },
  clickText: {
    color: globalColors.neutralWhite,
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    right: "25%",
  },
  emptyView: {
    height: 0.5,
    width: "100%",
    backgroundColor: globalColors.neutralWhite,
    marginTop: 0.3,
    right: "23%",
  },
});
