import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { globalColors } from '@/assets/GlobalColors';
import { fontFamilies } from '@/assets/fonts';
import Button1 from '@/components/buttons/Button1';
import GradientText from '@/components/element/GradientText';

const DeleteMessageChat = ({handleDeleteMessage, cancelHandler}) => {
  return (
    <View style={{ alignItems: "center", width: "100%", padding: 36 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
            marginBottom: "5%",
          }}
        >
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 20,
              textAlign: "center",
            }}
          >
            Delete message
          </Text>
        </View>
        <View
          style={{
            padding: "1%",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            Are you sure you want to delete this message?
          </Text>
        </View>

        <Button1
          isLoading={false}
          title="Delete"
          onPress={handleDeleteMessage}
        />
        <TouchableOpacity
          onPress={() => {
            cancelHandler()
            // DeleteMessageRef.current.close();
          }}
        >
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

export default DeleteMessageChat

const styles = StyleSheet.create({})