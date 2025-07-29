import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { globalColors } from "@/assets/GlobalColors";
import { ImageFallBackUser } from "@/utils/ImageUrlConcat";
import { fontFamilies } from "@/assets/fonts";
import GradientText from "@/components/element/GradientText";
import { GroupIcon } from "@/assets/DarkIcon";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { TextRenderContent } from "@/components/TextRenderContent";
import { htmlTagRemove } from "@/utils/htmlTagRemove";
import { formatMemberCount } from "@/utils/ImageHelper";

const GroupHeaderComponent = ({
  icon,
  groupName,
  category,
  groupType,
  userCount,
  channelCount,
  groupId,
  groupDesc,
  onPressJoin,
  isJoin,
  isExpanded,
  setShowReadMore,
  setIsExpanded,
  showReadMore,
  onProfileImageLayout,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleCloseModal = () => {
    setModalVisible(false);
  };

  const lines: any = htmlTagRemove(groupDesc) || [];

  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        {/* Profile Picture with layout detection */}
        <TouchableOpacity
          style={styles.profileEmptyView}
          onPress={toggleModal}
          // onLayout={onProfileImageLayout} // Add layout detection specifically to this element
        >
          <ImageFallBackUser
            imageData={icon}
            fullName={groupName}
            widths={64}
            heights={64}
            borders={10}
            isGroupList={true}
          />
        </TouchableOpacity>

        <View style={styles.groupInfoContainer}>
          {/* Group Name and Badge Container */}
          <View style={styles.nameAndBadgeContainer}>
            <Text
              style={styles.groupNameText}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {groupName}
            </Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {groupType === 1
                  ? "Public"
                  : groupType === 2
                  ? "Private"
                  : groupType === 3
                  ? "Paid"
                  : "Public"}
              </Text>
            </View>
          </View>

          {/* Group Description */}
          <View style={styles.descriptionContainer}>
            <Text
              numberOfLines={2}
              // onTextLayout={(e) =>
              //   setShowReadMore(e.nativeEvent.lines.length > 2)
              // }
              style={styles.descriptionText}
            >
              {groupDesc}
            </Text>
          </View>

          {/* {showReadMore ? (
            <TouchableOpacity
              onPress={() => setIsExpanded(!isExpanded)}
              style={styles.readView}
            >
              <GradientText style={styles.readText}>
                {isExpanded ? "Read Less" : "Read More"}
              </GradientText>
            </TouchableOpacity>
          ) : null} */}
          {/* Updated Stats Section - Tech Hub Style */}
          <View style={styles.statsContainer}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/GroupMembersScreen",
                  params: { groupId: groupId },
                })
              }
              style={styles.statItem}
            >
              <Text style={styles.statNumber}>
                {formatMemberCount(userCount)}
              </Text>
              <Text style={styles.statLabel}>Members</Text>
            </TouchableOpacity>

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{channelCount}</Text>
              <Text style={styles.statLabel}>Sub-Grps</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{category}</Text>
              <Text style={styles.statLabel}>Category</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.emptyView} />
    </View>
  );
};

export default GroupHeaderComponent;


// Simple Shimmer Effect Component
const ShimmerBox = ({ width, height, borderRadius = 8, style = {} }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.7,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    animate();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: globalColors.neutral3,
          opacity,
        },
        style,
      ]}
    />
  );
};

const GroupHeaderShimmer = () => {
  return (
    <View style={[styles.container, styles.shimmerContainer]}>
      <View style={styles.headerView}>
        {/* Profile Picture Shimmer */}
        <View style={styles.profileEmptyView}>
          <ShimmerBox width={64} height={64} borderRadius={32} />
        </View>

        <View style={styles.groupInfoContainer}>
          {/* Name and Badge Container Shimmer */}
          <View style={styles.nameAndBadgeContainer}>
            {/* Group Name Shimmer */}
            <ShimmerBox
              width={150}
              height={20}
              borderRadius={6}
              style={{ marginRight: 8 }}
            />
            {/* Badge Shimmer */}
            <ShimmerBox width={60} height={18} borderRadius={16} />
          </View>

          {/* Description Shimmer */}
          <View style={styles.descriptionContainer}>
            <ShimmerBox
              width="100%"
              height={14}
              borderRadius={4}
              style={{ marginBottom: 6 }}
            />
            <ShimmerBox width="75%" height={14} borderRadius={4} />
          </View>

          {/* Stats Container Shimmer */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <ShimmerBox
                width={35}
                height={13}
                borderRadius={4}
                style={{ marginBottom: 4 }}
              />
              <ShimmerBox width={50} height={11} borderRadius={4} />
            </View>

            <View style={styles.statItem}>
              <ShimmerBox
                width={25}
                height={13}
                borderRadius={4}
                style={{ marginBottom: 4 }}
              />
              <ShimmerBox width={50} height={11} borderRadius={4} />
            </View>

            <View style={styles.statItem}>
              <ShimmerBox
                width={45}
                height={13}
                borderRadius={4}
                style={{ marginBottom: 4 }}
              />
              <ShimmerBox width={50} height={11} borderRadius={4} />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.emptyView} />
      <View style={(styles.nameAndBadgeContainer)}>
        {/* Badge Shimmer */}
        <ShimmerBox
          width={60}
          height={24}
          borderRadius={16}
          style={{ marginRight: 20 }}
        />
        <ShimmerBox width={60} height={24} borderRadius={16} />
      </View>
    </View>
  );
};
export { GroupHeaderShimmer };


const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 8,
    marginBottom: "-2.5%",
    flexDirection: "column",
  },
  shimmerContainer: {
    // backgroundColor: globalColors.neutral2,
  },
  headerView: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  profileEmptyView: {
    left: "5%",
    backgroundColor: globalColors.neutral3,
    borderRadius: 20,
  },
  groupInfoContainer: {
    marginLeft: "7%",
    flex: 1,
    flexShrink: 1,
  },
  nameAndBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  groupNameText: {
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 24,
    fontFamily: fontFamilies.extraBold,
    color: globalColors.neutralWhite,
    marginRight: 8,
  },
  badgeContainer: {
    borderRadius: 16,
    backgroundColor: globalColors.neutral3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 10,
    lineHeight: 14,
    fontFamily: fontFamilies.light,
    color: globalColors.neutralWhite,
  },
  descriptionContainer: {
    width: "98%",
    minHeight: 25,
  },
  descriptionText: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: globalColors.neutral8,
    flexShrink: 1,
  },
  readView: {
    alignSelf: "flex-start",
  },
  readText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: globalColors.darkOrchid,
    marginTop: "1%",
    left: "2%",
    paddingRight: 2,
  },
  emptyView: {
    // borderTopWidth: 0.5,
    // borderColor: "rgba(255, 255, 255, 0.15)",
    marginTop: "5%",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: "5%",
    gap: 18,
  },
  statItem: {
    alignItems: "flex-start",
    minWidth: 55,
  },
  statNumber: {
    fontSize: 13,
    fontFamily: fontFamilies.bold,
    color: globalColors.neutralWhite,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11.5,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutral8,
  },
  shimmer: {
    backgroundColor: globalColors.neutral3,
    borderRadius: 8,
    minHeight: 20,
    minWidth: 60,
  },
});

// const GroupHeaderComponentold = ({
//   icon,
//   groupName,
//   category,
//   groupType,
//   userCount,
//   channelCount,
//   groupId,
//   groupDesc,
//   onPressJoin,
//   isJoin,
//   isExpanded,
//   setShowReadMore,
//   setIsExpanded,
//   showReadMore,
// }) => {
//   const [isModalVisible, setModalVisible] = useState(false);
//   const toggleModal = () => {
//     setModalVisible(!isModalVisible);
//   };

//   const toggleCloseModal = () => {
//     setModalVisible(false);
//   };
//   return (
//     <View style={styles.container}>
//       <View style={styles.headerView}>
//         {/* Profile Picture (Small) */}
//         <TouchableOpacity style={styles.profileEmptyView} onPress={toggleModal}>
//           <ImageFallBackUser
//             imageData={icon}
//             fullName={groupName}
//             widths={48}
//             heights={48}
//             borders={24}
//           />
//         </TouchableOpacity>

//         <View
//           style={{
//             marginLeft: "4%",
//             flex: 1,
//             flexShrink: 1,
//           }}
//         >
//           <Text
//             style={{
//               fontSize: 19,
//               letterSpacing: -0.2,
//               lineHeight: 24,
//               fontFamily: fontFamilies.bold,
//               color: globalColors.neutralWhite,
//               flexShrink: 1,
//             }}
//             numberOfLines={2}
//             ellipsizeMode="tail"
//           >
//             {groupName}
//           </Text>

//           <Text
//             style={{
//               fontSize: 14,
//               lineHeight: 18,
//               color: globalColors.neutralWhite,
//               marginTop: 4,
//               fontFamily: fontFamilies.regular,
//             }}
//             numberOfLines={2}
//           >
//             Category : {category}
//           </Text>

//           <View
//             style={{
//               borderRadius: 16,
//               backgroundColor: globalColors.neutral3,
//               flexDirection: "row",
//               alignItems: "center",
//               justifyContent: "center",
//               paddingHorizontal: 6,
//               paddingVertical: 2,
//               width: "20%",
//               marginTop: "2%",
//             }}
//           >
//             <Text
//               style={{
//                 fontSize: 10,
//                 lineHeight: 16,
//                 fontFamily: fontFamilies.regular,
//                 color: globalColors.neutralWhite,
//               }}
//             >
//               {groupType === 1
//                 ? "Public"
//                 : groupType === 2
//                 ? "Private"
//                 : groupType === 3
//                 ? "Paid"
//                 : "Public"}
//             </Text>
//           </View>
//         </View>
//       </View>

//       {/* Group Description */}
//       <View style={{ marginLeft: "5%", width: "90%" }}>
//         <Text
//           numberOfLines={isExpanded ? undefined : 2}
//           onTextLayout={(e) => setShowReadMore(e.nativeEvent.lines.length > 2)}
//           style={{
//             fontFamily: fontFamilies.regular,
//             fontSize: 14,
//             color: globalColors.neutral8,
//             marginTop: "5%",
//             flexShrink: 1,
//           }}
//         >
//           {groupDesc}
//         </Text>
//       </View>

//       {showReadMore ? (
//         <TouchableOpacity
//           onPress={() => setIsExpanded(!isExpanded)}
//           style={styles.readView}
//         >
//           <GradientText style={styles.readText}>
//             {isExpanded ? "Read Less" : "Read More"}
//           </GradientText>
//         </TouchableOpacity>
//       ) : null}

//       <View style={styles.emptyView} />
//       <View style={styles.channelCountView}>
//         <TouchableOpacity
//           onPress={() =>
//             router.push({
//               pathname: "/GroupMembersScreen",
//               params: { groupId: groupId },
//             })
//           }
//           style={styles.countView}
//         >
//           <GroupIcon />
//           <GradientText style={styles.userCountView}>
//             <Text style={styles.userCountText}>{userCount} users</Text>
//           </GradientText>
//         </TouchableOpacity>

//         {/* <TouchableOpacity
//             onPress={() =>
//               router.push({
//                 pathname: "/ChannelGroupInfoScreen",
//                 params: { id: groupId },
//               })
//             }
//             style={{
//               flex: 1,
//               borderRadius: 8,
//               backgroundColor: "rgba(255, 255, 255, 0.1)",
//               borderColor: "#3d3c4c",
//               borderWidth: 1,
//               flexDirection: "row",
//               alignItems: "center",
//               justifyContent: "center",
//               paddingHorizontal: 8,
//               paddingVertical: 4,
//               marginLeft: 16,
//             }}
//           >
//             <GroupIcon />
//             <Text
//               style={{
//                 fontSize: 12,
//                 lineHeight: 16,
//                 fontFamily: fontFamilies.regular,
//                 color: globalColors.neutralWhite,
//                 marginLeft: 8,
//               }}
//             >
//               {channelCount} Sub-groups
//             </Text>
//           </TouchableOpacity> */}
//       </View>
//       {!isJoin && (
//         <LinearGradient
//           colors={[
//             globalColors.darkOrchidShade60,
//             "transparent",
//             "transparent",
//             globalColors.darkOrchidShade60,
//           ]}
//           start={{ x: 1, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.linearGradientView}
//         >
//           <TouchableOpacity
//             onPress={() => onPressJoin({ groupId: groupId, isJoin: 1 })}
//             style={styles.followContainer}
//           >
//             <Text style={styles.followText}>{"Follow"}</Text>
//           </TouchableOpacity>
//         </LinearGradient>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     borderRadius: 16,
//     backgroundColor: globalColors.neutral2,
//     borderColor: globalColors.neutral3,
//     borderWidth: 0.5,
//     padding: 8,
//     marginBottom: "-2.5%",
//     flexDirection: "column",
//   },
//   headerView: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   profileEmptyView: {
//     left: "5%",
//     backgroundColor: globalColors.neutral3,
//     borderRadius: 50,
//   },
//   readView: {
//     alignSelf: "flex-start",
//     left: "3%",
//   },
//   readText: {
//     fontFamily: fontFamilies.bold,
//     fontSize: 14,
//     color: globalColors.darkOrchid,
//     marginTop: "1%",
//     left: "3%",
//     paddingRight: 2
//   },
//   emptyView: {
//     borderTopWidth: 0.5,
//     borderColor: "rgba(255, 255, 255, 0.15)",
//     marginTop: "5%",
//   },
//   channelCountView: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: "5%",
//     justifyContent: "center",
//   },
//   countView: {
//     borderRadius: 8,
//     borderColor: "#3d3c4c",
//     borderWidth: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//   },
//   userCountView: {
//     fontSize: 12,
//     color: globalColors.darkOrchid,
//   },
//   userCountText: {
//     color: globalColors.neutralWhite,
//     fontSize: 14,
//   },
//   linearGradientView: {
//     marginHorizontal: 5,
//     marginTop: "6%",
//     borderColor: globalColors.darkOrchidShade40,
//     borderWidth: 1,
//     height: 40,
//     width: "100%",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     overflow: "hidden",
//     borderRadius: 10,
//   },
//   followContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   followText: {
//     fontSize: 12,
//     fontFamily: fontFamilies.semiBold,
//     color: globalColors.neutralWhite,
//     marginTop: 5,
//   },
// });
