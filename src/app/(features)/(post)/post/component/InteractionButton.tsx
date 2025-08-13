import { Text, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import { globalColors } from '@/assets/GlobalColors'
import { ShareIcon } from '@/assets/DarkIcon'

interface InteractionButtonProps {
    onPress: () => void;
    count?: any;
}

const InteractionButton = ({onPress, count}: InteractionButtonProps) => {
  return (
    <TouchableOpacity
          onPress={onPress}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom:4
          }}
        >
          <ShareIcon height={24} width={24}/>
          {/* <Text
            style={{
              fontSize: 14,
              lineHeight: 18,
              fontFamily: "RegularFont",
              color: globalColors.neutralWhite,
              textAlignVertical: "center",
              marginLeft: 4,
            }}
          >
            {count}
          </Text> */}
        </TouchableOpacity>
  )
}

export default memo(InteractionButton)