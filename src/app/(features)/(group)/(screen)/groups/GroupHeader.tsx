import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ArrowLeftBigIcon, OptionsIcon, Share01Icon } from '@/assets/DarkIcon'
import { router } from 'expo-router'

const GroupHeader = ({handleSharePress,HandleThreeOption}) => {
  return (
    <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => router.back()}>
      <ArrowLeftBigIcon style={styles.backButton} />
    </TouchableOpacity>

    <View style={styles.headerActions}>
      <TouchableOpacity onPress={handleSharePress}>
        <Share01Icon />
      </TouchableOpacity>
      <TouchableOpacity onPress={HandleThreeOption}>
        <OptionsIcon width={24} height={24} />
      </TouchableOpacity>
    </View>
  </View>
  )
}

export default GroupHeader

const styles = StyleSheet.create({
    headerContainer: {
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: "5%",
      },
      backButton: {
        marginRight: 10,
      },
      headerActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: "10%",
        paddingVertical: "2%",
        width: "30%",
        gap: 10,
      },
})