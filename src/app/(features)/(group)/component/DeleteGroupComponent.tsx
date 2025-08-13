import { View, Text, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import { globalColors } from '@/assets/GlobalColors'
import Button1 from '@/components/buttons/Button1'
import GradientText from '@/components/element/GradientText'
import { fontFamilies } from '@/assets/fonts'

interface DeleteGroupComponentProps {
    onDeletePress: () => void;
    onCancelPress: () => void;
}

const DeleteGroupComponent:FC<DeleteGroupComponentProps> = ({onDeletePress, onCancelPress}) => {
  return (
    <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 20,
              textAlign: "center",
              marginBottom: "5%",
            }}
          >
            Delete group
          </Text>
          <View
            style={{
              borderWidth: 0.5,
              padding: "1%",
              borderRadius: 10,
              shadowColor: "#4E4D5B",
              shadowOpacity: 0.2,
              elevation: 1,
              marginBottom: "5%",
            }}
          >
            <Text
              style={{
                color: globalColors.neutral6,
                fontSize: 14,
                textAlign: "center",
              }}
            >
              <Text style={{ color: globalColors.neutralWhite }}>
                Are you sure you want delete “Crypto Space” group?{" "}
              </Text>
              Losing all data from the feed, announcement and events Sub-groups
              is irreversible and cannot be recovered.
            </Text>
          </View>
          <Button1
            isLoading={false}
            title="Cancel"
            onPress={() => onCancelPress()}
          />
          <TouchableOpacity onPress={() => onDeletePress()}>
            <GradientText
              style={{
                fontFamily: fontFamilies.bold,
                fontSize: 17,
                color: globalColors.darkOrchid,
                textAlign: "center",
              }}
            >
              <Text style={{ color: globalColors.neutralWhite, fontSize: 17 }}>
                Delete group
              </Text>
            </GradientText>
          </TouchableOpacity>
        </View>
  )
}

export default DeleteGroupComponent