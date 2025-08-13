import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Image } from "expo-image";
import { router } from "expo-router";
import { rupee } from "@/utils/Helpers";
import {
  EyeOpenIcon,
  PiggyBankIcon,
  TransactionIcon,
  WalletIcon,
  WithdrawMoney7Icon,
  WithdrawMoney8Icon,
} from "@/assets/DarkIcon";
import { LinearGradient } from "expo-linear-gradient";
import { globalColors } from "@/assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";

const { width, height } = Dimensions.get("window");

const WalletComponent = ({
  walletBal,
  onAddMoney,
  onWithdraw,
  onTransaction,
}) => {
  return (
    <LinearGradient
      colors={globalColors.cardBg3}
      start={{ x: 7, y: -3 }}
      end={{ x: 3, y: 20 }}
      style={{
        borderRadius: 16,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderStyle: "solid",
        borderColor: "#282b32",
        borderWidth: 1,
        width: "100%",
        overflow: "hidden",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: 16,
        marginTop: 24,
      }}
    >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={{}}>
            <Text
              style={{
                alignSelf: "stretch",

                fontSize: 16,
                lineHeight: 18,
                fontFamily: fontFamilies.medium,
                color: globalColors.neutralWhite,

                zIndex: 1,
                marginTop: 4,
              }}
            >
              Wallet balance
            </Text>
            <View
              style={{
                alignSelf: "stretch",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                zIndex: 2,
                marginTop: 4,
                gap: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  lineHeight: 26,
                  fontFamily: fontFamilies.bold,
                  color: globalColors.neutralWhite,
                }}
              >
                {rupee.format(walletBal ? walletBal : "0")}
              </Text>
              <EyeOpenIcon />
            </View>
          </View>
          <Image
            source={require("@/assets/image/PiggyBankIcon.png")}
            style={{
              width: (width * 40) / 100,
              height: (width * 40 * (78 / 117)) / 100,
            }}
            contentFit="contain"
          />
        </View>

        <View
          style={{
            alignSelf: "stretch",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "flex-start",

            zIndex: 2,
            marginTop: 16,
          }}
        >
          <TouchableOpacity
            // onPress={() => AddMoneyRef.current.expand()}
            style={{
              alignItems: "center",
              marginLeft: 20,
            }}
          >
            <View
              style={{
                borderRadius: 8,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                width: 48,
                height: 48,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
              }}
            >
              <WalletIcon />
            </View>
            <Text
              style={{
                fontSize: 12,
                lineHeight: 16,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,

                marginTop: 12,
              }}
            >
              Add money
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // WithdrawAmount.current.expand();
            }}
            style={{
              alignItems: "center",
              marginLeft: 20,
            }}
          >
            <View
              style={{
                borderRadius: 8,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                width: 48,
                height: 48,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
              }}
            >
              <WithdrawMoney8Icon />
            </View>
            <Text
              style={{
                alignSelf: "stretch",
                fontSize: 12,
                lineHeight: 16,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
                textAlign: "center",
                marginTop: 12,
              }}
            >
              Withdraw money
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.push("/transaction");
            }}
            style={{
              flex: 1,
              height: "50%",
              marginLeft: "8%",
            }}
          >
            <View
              style={{
                borderRadius: 8,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                width: 48,
                height: 48,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
              }}
            >
              <TransactionIcon />
            </View>
            <Text
              style={{
                fontSize: 12,
                lineHeight: 16,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
                textAlign: "left",
                marginTop: 12,
              }}
            >
              Transaction
            </Text>
          </TouchableOpacity>
        </View>
    </LinearGradient>
  );
};

export default WalletComponent;

const styles = StyleSheet.create({});
