import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC } from 'react'
import { ArrowLeftBigIcon, OptionsIcon, Share01Icon } from '@/assets/DarkIcon'
import { fontFamilies } from '@/assets/fonts'
import { globalColors } from '@/assets/GlobalColors'

interface HeaderGroupViewProps {
  name?: any;
  handleSharePress?: () => void;
  HandleThreeOption?: () => void;
  backPress?: () => void;
}
const HeaderGroupView:FC<HeaderGroupViewProps> = ({ name, handleSharePress, HandleThreeOption, backPress }) => {
  return (
    <View style={styles.GroupName}>
        <TouchableOpacity
          style={{ width: "10%", marginRight: 10 }}
          onPress={backPress}
        >
          <ArrowLeftBigIcon />
        </TouchableOpacity>
        <View style={{ width: "65%" }}>
          <Text
            style={{
              fontSize: 19,
              letterSpacing: -0.2,
              lineHeight: 24,
              fontFamily: fontFamilies.bold,
              color: globalColors.neutralWhite,
              flexShrink: 1,
            }}
          >
            {name}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            width: "15%",
            marginRight: "2%",
            gap: 10,
          }}
        >
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

export default HeaderGroupView

const styles = StyleSheet.create({
    GroupName: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: "5%",
        alignItems: "center",
      },
})