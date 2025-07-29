import { View, Text, TouchableWithoutFeedback, Keyboard, TextInput, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import { globalColors } from '@/assets/GlobalColors';
import { fontFamilies } from '@/assets/fonts';
import Button1 from '@/components/buttons/Button1';
import GradientText from '@/components/element/GradientText';

interface WithdrawComponentProps {
    profileDetails: any;
    amount: string;
    setAmount: any;
    withdrawLoading: boolean;
    withdrawPress: () => void;
    cancelPress: () => void;
}

const WithdrawComponent: React.FC<WithdrawComponentProps> = ({ profileDetails, amount, setAmount, withdrawLoading, withdrawPress, cancelPress }) => {
  return (
    <View
          style={{
            flex: 1,
            width: "100%",
          }}
        >
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 18,
              fontFamily: fontFamilies.bold,
              textAlign: "center",
              marginBottom: 2,
            }}
          >
            Withdraw Amount
          </Text>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={{
                borderColor: globalColors.neutral7,
                borderWidth: 1,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 15,
                marginBottom: 15,
              }}
            >
              <TextInput
                collapsable
                value={amount}
                onChangeText={(text) =>{
                 
                    setAmount(text)
                  
                }}
                placeholder="Enter amount to withdraw"
                placeholderTextColor={globalColors.neutral6}
                keyboardType="number-pad"
                enablesReturnKeyAutomatically
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                style={{
                  flex: 1,
                  color: globalColors.neutralWhite,
                  fontSize: 16,
                  height: 42,
                  fontFamily: fontFamilies.regular,
                }}
              />
            </View>
          </TouchableWithoutFeedback>

          <View style={{ marginBottom: 15 }}>
            <Text
              style={{
                color: globalColors.neutral9,
                fontSize: 14,
                fontFamily: fontFamilies.medium,
                marginBottom: 4,
              }}
            >
              Withdrawal Balance: {profileDetails?.total_inr}
            </Text>
            <Text
              style={{
                color: globalColors.warning,
                fontSize: 14,
                fontFamily: fontFamilies.regular,
              }}
            >
              Note: Minimum ₹100 to withdraw money
            </Text>
          </View>

          {profileDetails?.total_inr > 100 && (
            <View style={{ marginTop: "5%" }}>
              <Button1
                title="Withdraw"
                isLoading={withdrawLoading}
                onPress={() => {
                    withdrawPress()
                }}
              />

              <TouchableOpacity onPress={cancelPress}>
                <GradientText
                  style={{
                    fontFamily: fontFamilies.regular,
                    fontSize: 17,
                    color: globalColors.darkOrchid,
                  }}
                >
                  {"Cancel"}
                </GradientText>
              </TouchableOpacity>
            </View>
          )}
        </View>
  )
}

export default memo(WithdrawComponent)