import { View, Text, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { globalColors } from '@/assets/GlobalColors';
import { CloseBigIcon } from '@/assets/DarkIcon';
import LottieView from 'lottie-react-native';
import { fontFamilies } from '@/assets/fonts';
import ButtonTwo from '@/components/buttons/ButtonTwo';

interface OpenVerifyComponentProps {
    setKycModalVisible: (value: boolean) => void;
    verifyPress: () => void;
}

const OpenVerifyComponent = ({ setKycModalVisible, verifyPress }: OpenVerifyComponentProps) => {
  return (
    <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <LinearGradient
              colors={globalColors.cardBg1}
              start={{ x: 3.5, y: 0 }}
              end={{ x: 1, y: 3 }}
              style={{
                width: "85%",
                height: 400,
                borderRadius: 12,
                paddingVertical: 20,
                paddingHorizontal: 15,
                alignItems: "center",
                marginTop: "15%",
                marginHorizontal: '7.5%'
              }}
            >
              <View
                style={{
                  width: "20%",
                  alignItems: "flex-end",
                  left: "45%",
                }}
              >
                <TouchableOpacity
                  style={{ alignSelf: "center" }}
                  onPress={() => setKycModalVisible(false)}
                >
                  <CloseBigIcon />
                </TouchableOpacity>
              </View>

              <LottieView
                style={{ width: "100%", height: 200 }}
                source={require("../../../../../../assets/lottie/KycAnimation2.json")}
                autoPlay
                loop
              />
              <View
                style={{
                  alignSelf: "center",
                  width: "100%",
                  bottom: "10%",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 19,
                    lineHeight: 24,
                    fontFamily: fontFamilies.medium,
                    color: globalColors.neutralWhite,
                    alignSelf: "center",
                  }}
                >
                  Complete blue tick verification
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 20,
                    fontFamily: fontFamilies.regular,
                    color: globalColors.neutral8,
                    marginTop: 4,
                    alignSelf: "center",
                  }}
                >
                  Earn ₹83 on completion of your bluetick verification*
                </Text>
                <ButtonTwo
                  onPress={() => {
                    verifyPress()
                  }}
                  label="Verify"
                />
              </View>
            </LinearGradient>
          </View>
  )
}

export default memo(OpenVerifyComponent)

