import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ViewWrapper from '@/components/ViewWrapper'
import { useAppSelector } from '@/utils/Hooks';
import { useAppStore } from '@/zustand/zustandStore';
import { useDispatch } from 'react-redux';
import { setAllGroupsLoading } from '@/redux/slice/group/AllGroupSlice';
import ComunityItem from '@/components/ComunityItem';
import { globalColors } from '@/assets/GlobalColors';

const SelectCommunity = () => {
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
    </ViewWrapper>
  )
}

export default SelectCommunity

const styles = StyleSheet.create({})