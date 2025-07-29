import { View, Text, TouchableOpacity, ViewStyle } from 'react-native'
import React from 'react'
import { globalColors } from '@/assets/GlobalColors'
import { LinearGradient } from 'expo-linear-gradient'
import { fontFamilies } from '@/assets/fonts'

interface ProfileButtonProps {
    onPress?: () => void;
    label?: string;
    containerStyle?: ViewStyle;
}

const ProfileButton = ({ onPress, label, containerStyle }: ProfileButtonProps) => {
  return (
     <View
            style={{
              width: "30%",
              marginTop: "6%",
              marginHorizontal: 5,
              borderRadius: 5,
              borderColor: globalColors.darkOrchidShade40,
              borderWidth: 1,
              ...containerStyle
            }}
          >
            <LinearGradient
              colors={[
                globalColors.darkOrchidShade40,
                globalColors.neutral1,
                globalColors.neutral1,
                globalColors.neutral1,
                globalColors.darkOrchidShade40,
              ]}
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                height: 50,
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                
              }}
            >
              <TouchableOpacity onPress={onPress}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fontFamilies.medium,
                    color: globalColors.neutralWhite,
                  }}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
  )
}

export default ProfileButton