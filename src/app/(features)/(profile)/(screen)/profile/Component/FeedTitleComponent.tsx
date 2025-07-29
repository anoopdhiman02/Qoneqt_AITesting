import { View, Text } from 'react-native'
import React from 'react'
import { globalColors } from '@/assets/GlobalColors'

interface FeedTitleComponentProps {
    profileDetails: any;
}

const FeedTitleComponent = ({ profileDetails }: FeedTitleComponentProps) => {
  return (
    <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    lineHeight: 28,
                    fontFamily: "Nunito-Regular",
                    color: globalColors.neutral9,
                    textAlign: "left",
                  }}
                >
                  Feed ({profileDetails?.post_count})
                </Text>
              </View>
  )
}

export default FeedTitleComponent