import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC } from 'react'
import { globalColors } from '@/assets/GlobalColors'
import { fontFamilies } from '@/assets/fonts'
import Button1 from '@/components/buttons/Button1'
import GradientText from '@/components/element/GradientText'
import { CheckCircleIcon } from '@/assets/DarkIcon'

interface CustomMuteUnMuteProps {
    cancelPress: () => void;
    mutePress: () => void;
    options: any[];
    selectedOption: any;
    setSelectedOption: (option: any) => void;
    
}

const CustomMuteUnMute: FC<CustomMuteUnMuteProps> = ({cancelPress, mutePress, options, selectedOption, setSelectedOption}) => {

    const renderOption = (option) => {
        const isSelected = selectedOption === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={{
              flexDirection: "row",
              marginTop: "5%",
              borderWidth: 0.3,
              borderColor: globalColors.neutral8,
              width: "100%",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 5,
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onPress={() => setSelectedOption(option.value)}
          >
            <Text style={{ color: globalColors.neutral8 }}>{option.label}</Text>
            <Text style={{ color: globalColors.neutral8 }}>{option.label}</Text>
            {isSelected ? (
              <View>
                <CheckCircleIcon />
              </View>
            ) : (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: globalColors.neutral8,
                }}
              />
            )}
          </TouchableOpacity>
        );
      };

  return (
    <View style={{ alignItems: "center" }}>
    <View style={styles.BottomSheetWrap}>
      <View>
        <Text
          style={{
            color: globalColors.neutralWhite,
            fontSize: 20,
            textAlign: "center",
          }}
        >
          Mute notification
        </Text>
        <View
          style={{
            borderRadius: 10,
            padding: "1%",
          }}
        >
          <Text
            style={{
              marginTop: "2.5%",
              color: globalColors.neutral8,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            The chat stays muted privately, without alerting others, while
            you still receive notifications if mentioned.
          </Text>
        </View>
      </View>
    </View>

    {options.map(renderOption)}

    <Button1
      title="Mute"
      onPress={() => {
        mutePress();
      }}
      isLoading={false}
    />

    <TouchableOpacity onPress={() => cancelPress()}>
      <GradientText
        style={{
          fontFamily: fontFamilies.semiBold,
          fontSize: 17,
          color: globalColors.darkOrchid,
        }}
      >
        <Text style={{ color: globalColors.neutralWhite, fontSize: 17 }}>
          Cancel
        </Text>
      </GradientText>
    </TouchableOpacity>
  </View>
  )
}

export default CustomMuteUnMute

const styles = StyleSheet.create({
    BottomSheetWrap: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "center",
      },
})