import React from "react";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import GradientText from "@/components/element/GradientText";
import RadioButton from "@/components/RadioButton";

const StepIndicator = ({isActive, onPress}) => {
  const steps = [1, 2, 3];

  return (
    <View style={{ marginTop: "3%" }}>
      <TouchableOpacity onPress={onPress} style={{flexDirection: 'row', alignItems:'center', width: '100%', borderWidth:1, justifyContent:"space-between" }}>
        
      <Text
        style={{
          fontSize: 20,
          // lineHeight: 21,
          fontFamily: fontFamilies.semiBold,
          color: globalColors.neutralWhite,
          marginLeft: "2%",
          
        }}
      >
        Send Invites
      </Text>
      <RadioButton onPress={onPress} isActive={isActive}/>
      </TouchableOpacity>
      {isActive && (<View
        style={{
          borderColor: globalColors.neutral4,
          borderWidth: 0.5,
          padding: "5%",
          borderRadius: 5,
          backgroundColor: globalColors.neutral2,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            lineHeight: 21,
            fontFamily: fontFamilies.semiBold,
            color: globalColors.neutralWhite,
            marginBottom: "5%",
          }}
        >
          How It Works ?
        </Text>
        {steps.map((step) => (
          <View
            key={step}
            style={{
              flexDirection: "row",
              marginBottom: "5%",
              backgroundColor: globalColors.neutral1,
              padding: 16,
              borderRadius: 12,
              shadowColor: globalColors.neutral1,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 5,
              width: "100%",
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 5,
                backgroundColor: globalColors.neutral2,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
              }}
            >
              <GradientText
                style={{
                  fontFamily: fontFamilies.bold,
                  fontSize: 17,
                  color: globalColors.darkOrchid,
                }}
              >
                {step}
              </GradientText>
              {/* <View
                style={{
                  borderColor: globalColors.neutral10,
                  borderWidth: 0.6,
                  height: 30,
                  borderStyle: "dashed",
                  top: "5%",
                }}
              /> */}
            </View>

            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fontFamilies.medium,
                  color: globalColors.neutralWhite,
                  marginBottom: 4,
                }}
              >
                Step {step}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 21,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutral7,
                }}
              >
                {step === 1 &&
                  "Your friend registers on Qoneqt using the referral link"}
                {step === 2 &&
                  "Your friend completes their profile and verifies their account"}
                {step === 3 &&
                  "You and your friend each earn 50 coins on their successful login"}
              </Text>
            </View>
          </View>
        ))}
      </View>) }
      
    </View>
  );
};

export default StepIndicator;
