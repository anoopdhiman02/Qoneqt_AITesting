import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
} from "react-native";
import React, { useRef } from "react";
import { router } from "expo-router";
import { ImageFallBackUser } from "@/utils/ImageUrlConcat";
import { fontFamilies } from "@/assets/fonts";
import { formatMemberCount } from "@/utils/ImageHelper";
const {width} = Dimensions.get("window");

const ComunityItem = ({ community, containerStyle }: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current; // Start at normal size

  const handlePress = () => {
    // Quick press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 1,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1,
        useNativeDriver: true,
      }),
    ]).start();

    router.push({
      pathname: "/groups",
      params: {
        groupId: community?.id,
      },
    });
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        key={community.id}
        style={[styles.communityContainer, containerStyle]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.communityWrapper}>
          <View style={styles.communityImageContainer}>
            <View
              style={[
                styles.communityBorder,
                // community.isActive && styles.activeCommunityBorder,
              ]}
            >
              <View style={styles.communityImageWrapper}>
                <ImageFallBackUser
                  imageData={community.loop_logo}
                  fullName={community.loop_name}
                  widths={60}
                  heights={60}
                  borders={12}
                  isGroupList={undefined}
                />
                {community.what_am_i?.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>
                      {community.what_am_i.unread > 99
                        ? "99+"
                        : community.what_am_i.unread}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          <View style={styles.communityInfo}>
            <Text style={styles.communityName} numberOfLines={1}>
              {community.loop_name}
            </Text>
            {/* Uncomment if you want to show member count */}
            {/* <Text style={styles.memberCount}>
              {formatMemberCount(community.member_count)} members
            </Text> */}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ComunityItem;

const styles = StyleSheet.create({
  communityContainer: {
    marginRight: 0,
  },
  communityWrapper: {
    width: width * 0.22,
    alignItems: "center",
    overflow: "visible",
  },
  communityImageContainer: {
    marginBottom: 8,
    position: "relative",
    overflow: "visible",
  },
  communityBorder: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  communityImageWrapper: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 13,
    backgroundColor: "#fff",
  },
  communityImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  unreadBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF8C00",
    borderRadius: 12,
    minWidth: 22.5,
    height: 22.5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#020015",
    elevation: 8,
    zIndex: 10,
  },
  unreadText: {
    color: "white",
    fontSize: 10,
    fontFamily: fontFamilies.extraBold,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  communityInfo: {
    alignItems: "center",
  },
  communityName: {
    color: "white",
    fontSize: 12,
    fontFamily: fontFamilies.bold,
    textAlign: "center",
    maxWidth: 85,
  },
  memberCount: {
    color: "#a78bfa",
    fontSize: 10,
    marginTop: 2,
    fontFamily: fontFamilies.regular,
  },
});
