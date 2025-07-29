import { View, Text } from 'react-native'
import React from 'react'
import ViewWrapper from '@/components/ViewWrapper'
import GoBackNavigation from '@/components/Header/GoBackNavigation'

const Likes = () => {
  return (
    <ViewWrapper>
      <View style={{ flex: 1, width: "90%", marginHorizontal: '5%' }}>
        <GoBackNavigation header="Likes" isDeepLink={true}/>
      <Text>Likes</Text>
    </View>
    </ViewWrapper>
  )
}

export default Likes