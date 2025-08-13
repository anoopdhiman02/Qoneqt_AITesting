import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import { rupee } from "@/utils/Helpers";
import {
  EyeCloseIcon,
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

const { width } = Dimensions.get("window");

const WalletComponent = ({
  walletBal,
  onAddMoney,
  onWithdraw,
  onTransaction,
}) => {
  const [showBalance, setShowBalance] = useState(false);

  return (
    <TouchableOpacity activeOpacity={1}>
      <LinearGradient
        colors={[
          globalColors.neutral1,
          globalColors.darkOrchidShade40,
          globalColors.neutral1,
          globalColors.neutral1,
          globalColors.darkOrchidShade40,
        ]}
        start={{ x: 1.5, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={{
          borderRadius: 16,
          borderColor: globalColors.neutral2,
          borderWidth: 1,
          width: "100%",
          overflow: "hidden",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "4%",
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
          <View>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 18,
                fontFamily: fontFamilies.medium,
                color: globalColors.neutralWhite,
                marginTop: 4,
              }}
            >
              Wallet balance
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
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
                {showBalance ? walletBal : "****"}
              </Text>
              <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                {showBalance ? <EyeOpenIcon /> : <EyeCloseIcon />}
              </TouchableOpacity>
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
            flexDirection: "row",
            alignItems: "flex-start",
            marginTop: 16,
          }}
        >
          {/* <TouchableOpacity
          onPress={onAddMoney}
          style={{ alignItems: "center", marginLeft: 20 }}
        >
          <View
            style={{
              borderRadius: 8,
              backgroundColor: globalColors.darkOrchidShade60,
              width: 48,
              height: 48,
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
        </TouchableOpacity> */}

          <TouchableOpacity
            onPress={onWithdraw}
            style={{ alignItems: "center", marginLeft: 20 }}
          >
            <View
              style={{
                borderRadius: 8,
                backgroundColor: globalColors.darkOrchidShade60,
                width: 48,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
              }}
            >
              <WithdrawMoney8Icon />
            </View>
            <Text
              style={{
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
            onPress={onTransaction}
            style={{ alignItems: "center", marginLeft: 20 }}
          >
            <View
              style={{
                borderRadius: 8,
                backgroundColor: globalColors.darkOrchidShade60,
                width: 48,
                height: 48,
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
                marginTop: 12,
              }}
            >
              Transaction
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default WalletComponent;
