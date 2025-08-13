import { View, Text } from "react-native";
import React from "react";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const PostHeaderLoader = ({ containerStyle }: any) => {
  return (
    <View style={{ width: "100%", marginTop: "4%", ...containerStyle }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <ShimmerPlaceholder
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
          }}
        />
        <View style={{ marginLeft: 9, flex: 1 }}>
          <ShimmerPlaceholder
            style={{
              width: "50%",
              height: 14,
              marginBottom: 4,
            }}
          />
          <ShimmerPlaceholder
            style={{
              width: "60%",
              height: 10,
            }}
          />
        </View>
        <ShimmerPlaceholder
          style={{
            width: 5,
            height: 20,
            borderRadius: 3,
            right: "40%",
          }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 10,
          width: "100%",
          marginBottom: "2%",
        }}
      >
        <ShimmerPlaceholder
          style={{
            width: "50%",
            height: 25,
            marginBottom: 4,
          }}
        />
        <ShimmerPlaceholder
          style={{
            width: "50%",
            height: 25,
            marginBottom: 4,
          }}
        />
      </View>
    </View>
  );
};

export default PostHeaderLoader;
