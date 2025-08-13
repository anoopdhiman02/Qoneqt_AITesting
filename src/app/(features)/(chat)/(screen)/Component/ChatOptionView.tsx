import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { globalColors } from '@/assets/GlobalColors'
import { BlockUserIcon, ClearChatIcon, InfoIcon } from '@/assets/DarkIcon'

const ChatOptionView = ({
  onPressReportOption,
  onPressBlockOption,
  onPressClearOption,
  block,
  screen
}) => {
  return (
    <View style={{ alignItems: "center" }}>
    <Text style={{ color: globalColors.neutralWhite, fontSize: 22 }}>
      {`${screen} option`}
    </Text>
    <TouchableOpacity
      onPress={() => onPressReportOption()}
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginLeft: "3%",
        top: "8%",
      }}
    >
      <View
        style={{
          padding: "1%",
          borderRadius: 10,
          marginRight: 10,
          backgroundColor: globalColors.neutral3,
        }}
      >
        <InfoIcon />
      </View>

      <Text
        style={{
          color: globalColors.neutralWhite,
          fontSize: 18,
          marginTop: "1%",
        }}
      >
        Report
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => onPressBlockOption()}
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginLeft: "3%",
        top: "12%",
      }}
    >
      <View
        style={{
          padding: "1%",
          borderRadius: 10,
          marginRight: 10,
          backgroundColor: globalColors.neutral3,
        }}
      >
        <BlockUserIcon />
      </View>
      <Text
        style={{
          color: globalColors.neutralWhite,
          fontSize: 18,
          marginTop: "1%",
        }}
      >
        {block ? "Block" : "Unblock"}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => onPressClearOption()}
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginLeft: "3%",
        marginTop: "3%",
        top: "12%",
      }}
    >
      <View
        style={{
          padding: "1%",
          borderRadius: 10,
          marginRight: 10,
          backgroundColor: globalColors.neutral3,
        }}
      >
        <ClearChatIcon />
      </View>
      <Text
        style={{
          color: globalColors.neutralWhite,
          fontSize: 18,
          marginTop: "1%",
        }}
      >
        Clear Chat
      </Text>
    </TouchableOpacity>
  </View>
  )
}

export default ChatOptionView

const styles = StyleSheet.create({})