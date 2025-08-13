import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ImageFallBackUser } from "@/utils/ImageUrlConcat";
import { router } from "expo-router";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { formatMemberCount } from "@/utils/ImageHelper";
import ComunityItem from "@/components/ComunityItem";

const { width } = Dimensions.get("window");

// Shimmer Component
const ShimmerItem = ({ delay = 0 }) => {
  const shimmerOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerOpacity, {
          toValue: 0.8,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerOpacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );

    // Start immediately with minimal delay
    setTimeout(() => {
      shimmerAnimation.start();
    }, delay);

    return () => shimmerAnimation.stop();
  }, [shimmerOpacity, delay]);

  return (
    <View style={styles.shimmerContainer}>
      <Animated.View
        style={[styles.shimmerImageContainer, { opacity: shimmerOpacity }]}
      />
      <Animated.View
        style={[
          styles.shimmerTextLine,
          { opacity: shimmerOpacity, marginTop: 8 },
        ]}
      />
      {/* <Animated.View
        style={[
          styles.shimmerTextLineSmall,
          { opacity: shimmerOpacity, marginTop: 4 },
        ]}
      /> */}
    </View>
  );
};

// Animated Community Item
const AnimatedCommunityItem = ({ community, index }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current; // Start visible
  const slideAnim = useRef(new Animated.Value(0)).current; // Start in position

  // No animation delay - show immediately
  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <ComunityItem community={community} />
    </Animated.View>
  );
};

interface CommunityStoriesProps {
  onCommunityPress?: (community: any) => void;
  communityData?: any[];
  isLoading?: boolean;
}

export default function CommunityStories({
  onCommunityPress,
  communityData = [],
  isLoading = false,
}: CommunityStoriesProps) {
  // Show shimmer when loading or when communityData length is 0
  const showShimmer = isLoading || communityData.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>My Communities</Text>
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={() => router.push("/MyCommunities")}
        >
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Join New Community */}
        <TouchableOpacity
          style={styles.addCommunityContainer}
          onPress={() => router.push("/CreateGroupScreen")}
        >
          <View style={styles.addCommunityWrapper}>
            <LinearGradient
              colors={[
                globalColors.slateBlueTint20,
                globalColors.slateBlueTint20,
              ]}
              style={styles.addCommunityGradient}
            >
              <Ionicons name="add" size={35} color="white" />
            </LinearGradient>
            <View style={styles.addCommunityInfo}>
              <Text style={styles.addCommunityText}>New Group</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Show shimmer items when loading */}
        {showShimmer && (
          <>
            {[...Array(4)].map((_, index) => (
              <ShimmerItem key={`shimmer-${index}`} delay={index * 200} />
            ))}
          </>
        )}

        {/* Show actual community items with animation */}
        {!showShimmer &&
          (communityData || []).slice(0, 24).map((community, index) => (
            <AnimatedCommunityItem
              key={community.id || index}
              community={community}
              index={index}
            />
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomWidth: 0.2,
    borderColor: "#393753ff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "2%",
    marginBottom: 8,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontFamily: fontFamilies.bold,
  },
  seeAllButton: {
    padding: 2,
  },
  seeAllText: {
    color: "#a78bfa",
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
  },
  scrollContent: {
    paddingHorizontal: 3,
    paddingVertical: 10,
  },
  addCommunityContainer: {
    marginRight: 0,
  },
  addCommunityWrapper: {
    width: 90,
    alignItems: "center",
  },
  addCommunityGradient: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  addCommunityInfo: {
    alignItems: "center",
  },
  addCommunityText: {
    color: "white",
    fontSize: 12,
    fontFamily: fontFamilies.bold,
  },
  // Shimmer styles
  shimmerContainer: {
    width: 90,
    alignItems: "center",
    marginRight: 0,
  },
  shimmerImageContainer: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 14,
    backgroundColor: "#2a2a3e",
    marginBottom: 6,
  },
  shimmerTextLine: {
    width: 70,
    height: 10,
    borderRadius: 6,
    backgroundColor: "#2a2a3e",
  },
  shimmerTextLineSmall: {
    width: 50,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2a2a3e",
  },
});
