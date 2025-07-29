import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ViewWrapper from '@/components/ViewWrapper'
import { useAppSelector } from '@/utils/Hooks';
import ComunityItem from '@/components/ComunityItem';
import { fontFamilies } from '@/assets/fonts';
import GoBackNavigation from '@/components/Header/GoBackNavigation';
const {width} = Dimensions.get("window");

const MyCommunities = () => {
    const AllGroupList = useAppSelector((state) => state.allGroupSlice);
  return (
    <ViewWrapper>
      <View style={styles.container}>
        <GoBackNavigation header="My Communities"/>
      <FlatList
        data={AllGroupList?.data}
        numColumns={4}
        renderItem={({ item }) => (
          <ComunityItem community={item} containerStyle={{marginBottom: 10, paddingVertical: 10, marginRight: width * 0.02}} />
        )}
        keyExtractor={(item) => item.id}
      />
      </View>
    </ViewWrapper>
  )
}

export default MyCommunities

const styles = StyleSheet.create({
  sectionTitle: {
      color: "white",
      fontSize: 18,
      fontFamily: fontFamilies.bold,
    },
  container: {
    flex: 1,
    width: "100%",
    padding: 10,

  },
})