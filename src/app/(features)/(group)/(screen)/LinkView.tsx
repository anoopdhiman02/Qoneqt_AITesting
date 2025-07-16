import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { globalColors } from '@/assets/GlobalColors'
import { fontFamilies } from '@/assets/fonts'
import {
    CopyIcon
  } from "@/assets/DarkIcon";


const LinkView = ({groupDetails, copyToClipboard}:any) => {
  return (
    <TouchableOpacity
      style={styles.container}
    >
      <Text
        style={styles.text}
      >
        {groupDetails?.slug ? (
          `https://qoneqt.com/groups/${groupDetails?.slug}`
        ) : (
          <Text>Not Found</Text>
        )}
      </Text>
      <TouchableOpacity
        onPress={() => {
          copyToClipboard(`${groupDetails?.slug}`);
        }}
      >
        <CopyIcon />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default LinkView

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 8,
        borderColor: globalColors.neutral3,
        borderWidth: 1,
        borderStyle: "dashed",
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginTop: "5%",
      },
      text: {
        fontSize: 15,
          lineHeight: 22,
          fontFamily: fontFamilies.semiBold,
          color: globalColors.neutral7,
          width: "90%",
      },
})