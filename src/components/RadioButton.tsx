import { View, Text, Image } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { globalColors } from '@/assets/GlobalColors'

const RadioButton = ({isActive}) => {
  return (
    <View style={{width: 20, height: 20, justifyContent:'center', alignItems:'center'}}>
            <Image style={{width: 20, height:20, transform: [{ rotate: isActive ? '180deg' : '0deg' }]}} source={require('../assets/image/down_Icon.png')}/>
          </View>
  )
}

export default RadioButton