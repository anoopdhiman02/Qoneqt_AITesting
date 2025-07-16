import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { globalColors } from '@/assets/GlobalColors'
import { fontFamilies } from '@/assets/fonts'
import GradientText from '@/components/element/GradientText'
import Button1 from '@/components/buttons/Button1'
import TextInputComponent from '@/components/element/TextInputComponent'

interface AddMoneyProps {
    onPressSubmitMoney: () => void;
    cancelHandler: () => void;
}

const AddMoneyComponent: React.FC<AddMoneyProps> = ({ onPressSubmitMoney, cancelHandler }) => {
  return (
    <View style={{ alignItems: "center" }}>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: globalColors.neutralWhite,
          fontSize: 20,
          textAlign: "center",
        }}
      >
        Add money
      </Text>
    </View>
    <View style={{ width: "100%" }}>
      <TextInputComponent placeHolder="+1000" />
    </View>
    <View style={{ flexDirection: "row" }}>
      <View
        style={{
          borderColor: globalColors.neutral9,
          borderWidth: 0.4,
          paddingHorizontal: "3%",
          marginVertical: "3%",
          borderRadius: 10,
        }}
      >
        <Text style={{ color: globalColors.neutralWhite }}>+50</Text>
      </View>
    </View>

    <Button1
      isLoading={false}
      title="Add money"
      onPress={onPressSubmitMoney}
    />
    <TouchableOpacity onPress={cancelHandler}>
      <GradientText
        style={{
          fontFamily: fontFamilies.bold,
          fontSize: 17,
          color: globalColors.darkOrchid,
          textAlign: "center",
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

export default AddMoneyComponent