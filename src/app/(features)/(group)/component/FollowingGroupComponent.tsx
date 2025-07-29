import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import GroupBox from "./GroupBox";
import { router } from "expo-router";
import { globalColors } from "@/assets/GlobalColors";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const { width } = Dimensions.get("window");
const ShimWidth = (width - 70) / 2;
const FollowingGroupComponent = ({ data, ListEmptyComponent,onEndReached, ListFooterComponent }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const onPressGroup = (id) => {
    router.push({ pathname: "/groups", params: { groupId: id } });
  };

  const RenderShimmer = () => (
    <View
      style={{
        width: ShimWidth,
        height: 150,
        marginHorizontal: 5,
        marginBottom: 10,
        padding: 8,
        borderRadius: 10,
        backgroundColor: globalColors.darkOrchidShade80,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ShimmerPlaceholder
        style={{
          width: "50%",
          height: "50%",
          borderRadius: 5,
          marginBottom: 10,
        }}
      />
      <ShimmerPlaceholder
        style={{
          width: "60%",
          height: "10%",
          borderRadius: 4,
          marginBottom: 10,
        }}
      />
      <ShimmerPlaceholder
        style={{
          width: "80%",
          height: "15%",
          borderRadius: 4,
        }}
      />
    </View>
  );

  const renderItem = ({ item, index }) => (
    <GroupBox
    id={item?.id}
    logo={item?.loop_logo}
    memberCount={item?.members_count || item?.member_count}
    name={item?.loop_name}
    onPressGroup={onPressGroup}
    key={index}
    />
  );
  
  if (isLoading) {
    return (
      <View style={{ marginTop: "5%" }}>
        <FlatList
          contentContainerStyle={{
            width: "100%",
            paddingHorizontal: 10,
          }}
          numColumns={2}
          data={[1, 2, 3, 4, 5, 6]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={RenderShimmer}
        />
      </View>
    );
  } else {
    return (
      <View style={{ marginTop: "5%" }}>
        <FlatList
          contentContainerStyle={{
            width: "100%",
          }}
          showsVerticalScrollIndicator={false}
          style={{ gap: 5 }}
          numColumns={2}
          data={data}
          // data={data.slice(0, 1)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListEmptyComponent={ListEmptyComponent}
          onScrollEndDrag={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={ListFooterComponent}
        />
      </View>
    );
  }
};

export default FollowingGroupComponent;

const styles = StyleSheet.create({});
