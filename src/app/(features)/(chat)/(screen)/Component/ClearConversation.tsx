import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { globalColors } from '@/assets/GlobalColors'
import Button1 from '@/components/buttons/Button1'
import GradientText from '@/components/element/GradientText'
import { fontFamilies } from '@/assets/fonts'

const ClearConversation = ({clearChatConfirm, cancelHandler}) => {
  return (
    <View style={styles.container}>
              <View
                    style={styles.headerContainer}
              >
                <Text
                  style={styles.clearConversationText}
                >
                  Clear conversation
                </Text>
              </View>
              <View
                style={styles.messageContainer}
              >
                <Text
                  style={styles.messageText}
                >
                  This conversation will be deleted from your inbox. Other people in
                  the conversation will still be able to see it.
                </Text>
              </View>
    
              <Button1
                isLoading={false}
                title="Clear chat"
                onPress={() => clearChatConfirm()}
              />
              <TouchableOpacity onPress={cancelHandler}>
                <GradientText
                  style={styles.cancelGradientText}
                >
                  <Text style={styles.cancelText}>
                    Cancel
                  </Text>
                </GradientText>
              </TouchableOpacity>
            </View>
  )
}

export default ClearConversation

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "center",
        marginBottom: "5%",
    },
    messageContainer: {
        padding: "3%",
        borderRadius: 10,
        backgroundColor: "#2B0A6E",
    },
    messageText: {
        color: "gray",
        fontSize: 14,
        textAlign: "center",
    },
    clearConversationText: {
        color: globalColors.neutralWhite,
        fontSize: 20,
        textAlign: "center",
    },
    cancelGradientText: {
       fontFamily: fontFamilies.bold,
       fontSize: 17,
       color: globalColors.darkOrchid,
       textAlign: "center",
    },
    cancelText: {
        color: globalColors.neutralWhite,
        fontSize: 17,
    }
})