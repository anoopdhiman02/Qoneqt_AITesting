import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { globalColors } from "@/assets/GlobalColors";
import { ImageFallBackUser } from "@/utils/ImageUrlConcat";
import { fontFamilies } from "@/assets/fonts";
import GradientText from "@/components/element/GradientText";
import { GroupIcon } from "@/assets/DarkIcon";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { TextRenderContent } from "@/components/TextRenderContent";
import { htmlTagRemove } from "@/utils/htmlTagRemove";

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
        {/* Profile Picture (Small) */}
        <TouchableOpacity style={styles.profileEmptyView} onPress={toggleModal}>
          <ImageFallBackUser
            imageData={icon}
            fullName={groupName}
            widths={48}
            heights={48}
            borders={24}
          />
        </TouchableOpacity>

        <View
          style={{
            marginLeft: "4%",
            flex: 1,
            flexShrink: 1,
          }}
        >
          <Text
            style={{
              fontSize: 19,
              letterSpacing: -0.2,
              lineHeight: 24,
              fontFamily: fontFamilies.bold,
              color: globalColors.neutralWhite,
              flexShrink: 1,
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {groupName}
          </Text>

          <Text
            style={{
              fontSize: 14,
              lineHeight: 18,
              color: globalColors.neutralWhite,
              marginTop: 4,
              fontFamily: fontFamilies.regular,
            }}
            numberOfLines={2}
          >
            Category : {category}
          </Text>

          <View
            style={{
              borderRadius: 16,
              backgroundColor: globalColors.neutral3,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 6,
              paddingVertical: 2,
              width: "20%",
              marginTop: "2%",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                lineHeight: 16,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
              }}
            >
              {groupType === 1
                ? "Public"
                : groupType === 2
                ? "Private"
                : groupType === 3
                ? "Paid"
                :"Public"}
            </Text>
          </View>
        </View>
      </View>

      {/* Group Description */}
      <View style={{ marginLeft: "5%", width: "90%" }}>
        <Text
          numberOfLines={isExpanded ? undefined : 2}
          onTextLayout={(e) => setShowReadMore(e.nativeEvent.lines.length > 2)}
          style={{
            fontFamily: fontFamilies.regular,
            fontSize: 14,
            color: globalColors.neutral8,
            marginTop: "5%",
            flexShrink: 1,
          }}
        >
          {lines.map((line, index) => (
        <Text key={index}>
          {line.trim()}
        </Text>
      ))}
        </Text>
      </View>

      {showReadMore ? (
        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          style={styles.readView}
        >
          <GradientText style={styles.readText}>
            {isExpanded ? "Read Less" : "Read More"}
          </GradientText>
        </TouchableOpacity>
      ) : null}

      <View style={styles.emptyView} />
      <View style={styles.channelCountView}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/GroupMembersScreen",
              params: { groupId: groupId },
            })
          }
          style={styles.countView}
        >
          <GroupIcon />
          <GradientText style={styles.userCountView}>
            <Text style={styles.userCountText}>{userCount} users</Text>
          </GradientText>
        </TouchableOpacity>

        {/* <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/ChannelGroupInfoScreen",
                params: { id: groupId },
              })
            }
            style={{
              flex: 1,
              borderRadius: 8,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderColor: "#3d3c4c",
              borderWidth: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 8,
              paddingVertical: 4,
              marginLeft: 16,
            }}
          >
            <GroupIcon />
            <Text
              style={{
                fontSize: 12,
                lineHeight: 16,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
                marginLeft: 8,
              }}
            >
              {channelCount} Sub-groups
            </Text>
          </TouchableOpacity> */}
      </View>
      {!isJoin && (
        <LinearGradient
          colors={[
            globalColors.darkOrchidShade60,
            "transparent",
            "transparent",
            globalColors.darkOrchidShade60,
          ]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.linearGradientView}
        >
          <TouchableOpacity
            onPress={() => onPressJoin({ groupId: groupId, isJoin: 1 })}
            style={styles.followContainer}
          >
            <Text style={styles.followText}>{"Follow"}</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}
    </View>
  );
};

export default GroupHeaderComponent;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    backgroundColor: globalColors.neutral2,
    borderColor: globalColors.neutral3,
    borderWidth: 0.5,
    padding: 8,
    marginBottom: "-2.5%",
    flexDirection: "column",
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileEmptyView: {
    left: "5%",
    backgroundColor: globalColors.neutral3,
    borderRadius: 50,
  },
  readView: {
    alignSelf: "flex-start",
    left: "3%",
  },
  readText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: globalColors.darkOrchid,
    marginTop: "1%",
    left: "3%",
    paddingRight: 2
  },
  emptyView: {
    borderTopWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
    marginTop: "5%",
  },
  channelCountView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "5%",
    justifyContent: "center",
  },
  countView: {
    borderRadius: 8,
    borderColor: "#3d3c4c",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  userCountView: {
    fontSize: 12,
    color: globalColors.darkOrchid,
  },
  userCountText: {
    color: globalColors.neutralWhite,
    fontSize: 14,
  },
  linearGradientView: {
    marginHorizontal: 5,
    marginTop: "6%",
    borderColor: globalColors.darkOrchidShade40,
    borderWidth: 1,
    height: 40,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 10,
  },
  followContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  followText: {
    fontSize: 12,
    fontFamily: fontFamilies.semiBold,
    color: globalColors.neutralWhite,
    marginTop: 5,
  },
});
