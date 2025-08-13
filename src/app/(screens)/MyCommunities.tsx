import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ViewWrapper from '@/components/ViewWrapper'
import { useAppSelector } from '@/utils/Hooks';
import ComunityItem from '@/components/ComunityItem';
import { fontFamilies } from '@/assets/fonts';
import GoBackNavigation from '@/components/Header/GoBackNavigation';
import { useDispatch } from 'react-redux';
import { AllGroupReq } from '@/redux/reducer/group/AllGroups';
import { setAllGroupsLoading } from '@/redux/slice/group/AllGroupSlice';
import { globalColors } from '@/assets/GlobalColors';
import { useAppStore } from '@/zustand/zustandStore';
const {width} = Dimensions.get("window");

const MyCommunities = () => {
    const AllGroupList = useAppSelector((state) => state.allGroupSlice);
    const userId = useAppStore((state) => state.userId);
    const Dispatch = useDispatch();
    const loadMore = () => {
      if(AllGroupList?.isLoaded || AllGroupList?.lastData.length === 0){
        return;
      }
      Dispatch(setAllGroupsLoading(true));
      //@ts-ignore
        Dispatch(AllGroupReq({ fromApp: 1, last_count: AllGroupList?.data?.length, user_id: userId }));
    }
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
        onEndReachedThreshold={0.5}
        onEndReached={loadMore}
        ListFooterComponent={<View style={{marginVertical: 20, }} >
          {AllGroupList?.isLoaded && <ActivityIndicator size="large" color={globalColors.warmPink} />}
        </View>}
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