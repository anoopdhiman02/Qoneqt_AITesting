import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { getUserDeatils } from "@/localDB/LocalStroage";
import ViewWrapper from "@/components/ViewWrapper";
import { useAppStore } from "@/zustand/zustandStore";
import { setPrefsValue } from "@/utils/storage";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const KycLoadingScreen = () => {
  const { onSetUserLoginType } = useAppStore();

  useEffect(() => {
    const fetchUserRecord = async () => {
      try {
        const userDetails = await getUserDeatils();
        if (userDetails) {
          onSetUserLoginType(userDetails?.join_type);
        } else {
        }
      } catch (error) {
        console.error("Error fetching user details: ", error);
      }
    };
    fetchUserRecord();
    return () => {
      setPrefsValue("notificationInfo", "");
    };
  }, []);





  return (
    <ViewWrapper>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 24,
          width: "100%",
        }}
      >
        {/* Step Progress Placeholder */}
        <ShimmerPlaceholder
          style={{
            width: "100%",
            height: 30,
            borderRadius: 4,
            marginBottom: 42,
          }}
          shimmerColors={["#333", "#666", "#333"]}
        />

        {/* First Name and Last Name Shimmer Placeholders */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <ShimmerPlaceholder
            style={{ width: "48%", height: 53, borderRadius: 8 }}
            shimmerColors={["#333", "#666", "#333"]}
          />
          <ShimmerPlaceholder
            style={{ width: "48%", height: 53, borderRadius: 8 }}
            shimmerColors={["#333", "#666", "#333"]}
          />
        </View>

        {/* Email Address Placeholder */}
        <ShimmerPlaceholder
          style={{
            width: "100%",
            height: 53,
            borderRadius: 8,
            marginBottom: 40,
          }}
          shimmerColors={["#333", "#666", "#333"]}
        />

        {/* Date of Birth Placeholder */}
        <ShimmerPlaceholder
          style={{
            width: "100%",
            height: 53,
            borderRadius: 8,
            marginBottom: 40,
          }}
          shimmerColors={["#333", "#666", "#333"]}
        />

        {/* Gender Options Placeholder */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <ShimmerPlaceholder
            style={{
              width: "30%",
              height: 50,
              borderRadius: 8,
            }}
            shimmerColors={["#333", "#666", "#333"]}
          />
          <ShimmerPlaceholder
            style={{
              width: "30%",
              height: 50,
              borderRadius: 8,
            }}
            shimmerColors={["#333", "#666", "#333"]}
          />
          <ShimmerPlaceholder
            style={{
              width: "30%",
              height: 50,
              borderRadius: 8,
            }}
            shimmerColors={["#333", "#666", "#333"]}
          />
        </View>

        {/* "Why is this needed?" Placeholder */}
        <ShimmerPlaceholder
          style={{
            width: "100%",
            height: 50,
            borderRadius: 8,
            marginBottom: 32,
          }}
          shimmerColors={["#333", "#666", "#333"]}
        />

        {/* Next Button Placeholder */}
        <View style={{ alignItems: "center" }}>
          <ShimmerPlaceholder
            style={{
              width: "70%",
              height: 50,
              borderRadius: 15,
            }}
            shimmerColors={["#333", "#666", "#333"]}
          />
        </View>
      </View>
    </ViewWrapper>
  );
};

export default KycLoadingScreen;

