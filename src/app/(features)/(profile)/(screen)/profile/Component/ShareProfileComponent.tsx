import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { globalColors } from '@/assets/GlobalColors'
import { CopyLink01Icon, ShareIcon } from '@/assets/DarkIcon'

interface ShareProfileComponentProps {
    onShare: () => void;
    copyToClipboard: () => void;
}

const ShareProfileComponent: React.FC<ShareProfileComponentProps> = ({ onShare, copyToClipboard }) => {
  return (
    <View style={{}}>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 22,
              alignSelf: "center",
            }}
          >
            Share profile
          </Text>
          <TouchableOpacity
            onPress={onShare}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: "6%",
            }}
          >
            <TouchableOpacity
              style={{
                padding: "1%",
                borderRadius: 10,
                backgroundColor: globalColors.slateBlueShade60,
              }}
            >
              <ShareIcon height={24} width={24}/>
            </TouchableOpacity>
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 18,
                marginTop: "1%",
                marginLeft: "5%",
              }}
            >
              Share via
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={copyToClipboard}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: "6%",
            }}
          >
            <View
              style={{
                padding: "1%",
                borderRadius: 10,
                backgroundColor: globalColors.slateBlueShade60,
              }}
            >
              <CopyLink01Icon />
            </View>
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 18,
                marginTop: "1%",
                marginLeft: "5%",
              }}
            >
              Copy via
            </Text>
          </TouchableOpacity>
        </View>
  )
}

export default ShareProfileComponent