import React, { useEffect, useState } from "react";
import { FlatList, View, Dimensions } from "react-native";
import { router } from "expo-router";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import GroupBox from "./GroupBox";
import { globalColors } from "@/assets/GlobalColors";

const { width } = Dimensions.get("window");
const ShimWidth = (width - 70) / 2;

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const MyGroupComponent = ({ data, onScroll, ListEmptyComponent, ListFooterComponent }: any) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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

  const onPressGroup = (id) => {
    router.push({ pathname: "/groups/[slug]", params: { slug: id } });
  };

  const renderItem = ({ item, index }) => {
    return (
      <GroupBox
        id={item?.id}
        logo={item?.loop_logo}
        memberCount={item?.member_count}
        name={item?.loop_name}
        onPressGroup={onPressGroup}
        key={index}
      />
    );
  };
  if (isLoading) {
    return (
      <View style={{ marginTop: "5%" }}>
        <FlatList
          contentContainerStyle={{
            width: "100%",
            paddingHorizontal: 10,
          }}
          numColumns={2}
          data={[1, 2, 3, 4, 5, 6,7,8]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={RenderShimmer}
        />
      </View>
    );
  } 
  else {
    return (
      <FlatList
        numColumns={2}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        onScrollEndDrag={onScroll}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
      />
    );
  }
};

export default MyGroupComponent;
