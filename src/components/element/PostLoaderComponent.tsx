import { Text, View } from "react-native";
import React from "react";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { globalColors } from "@/assets/GlobalColors";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const PostLoaderComponent = () => {
  return (
    <View style={{ width: "100%", marginTop: "4%" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <ShimmerPlaceholder
          style={{
            width: 34,
            height: 34,
            borderRadius: 16,
            backgroundColor: globalColors.neutral_white["300"],
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
            width: "20%",
            height: 20,
            borderRadius: 3,
            right: "40%",
          }}
        />
      </View>
      <ShimmerPlaceholder
        style={{
          width: "95%",
          height: 35,
          marginBottom: 12,
          borderRadius: 3,
        }}
      />
      <ShimmerPlaceholder
        style={{
          width: "100%",
          height: 250,
          borderRadius: 8,
          marginBottom: 16,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          width: "50%",
        }}
      >
        <ShimmerPlaceholder
          style={{
            width: "30%",
            height: 26,
            borderRadius: 3,
          }}
        />
        <ShimmerPlaceholder
          style={{
            width: "30%",
            height: 26,
            borderRadius: 3,
          }}
        />
        <ShimmerPlaceholder
          style={{
            width: "30%",
            height: 26,
            borderRadius: 3,
          }}
        />
        <View style={{ flexDirection: "row", left: "45%", bottom: "8%" }}>
          <ShimmerPlaceholder
            style={{
              width: "65%",
              height: 32,
              borderRadius: 3,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default PostLoaderComponent;
