import { View, Text } from 'react-native'
import React from 'react'
import { globalColors } from '@/assets/GlobalColors'

const ListEmptyPostComponent = () => {
  return (
    <View
            style={{ height: 100, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "RegularFont",
                color: globalColors.neutralWhite,
              }}
            >
              No Post Found
            </Text>
          </View>
  )
}

export default ListEmptyPostComponent