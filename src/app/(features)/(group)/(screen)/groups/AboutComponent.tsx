import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { globalColors } from "@/assets/GlobalColors";
import { ImageFallBackUser } from "@/utils/ImageUrlConcat";
import { fontFamilies } from "@/assets/fonts";
import { Ionicons } from "@expo/vector-icons";
import GradientText from "@/components/element/GradientText";
import { GroupIcon } from "@/assets/DarkIcon";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { formatMemberCount } from "@/utils/ImageHelper";
import ShareLink from "./ShareLink";
import LinkView from "../LinkView";
import RichText from "@/utils/RichText";

const GroupAboutComponent = ({
  group,
  isExpanded,
  setShowReadMore,
  setIsExpanded,
  showReadMore,
  handlePressProfile,
  copyToClipboard,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <TouchableOpacity activeOpacity={1}>
      <View style={styles.container}>
        <View style={styles.emptyView} />
        <View style={styles.descriptionContainer} pointerEvents="none">
          <Text
            //   numberOfLines={isExpanded ? undefined : 2}
            //   onTextLayout={(e) => setShowReadMore(e.nativeEvent.lines.length > 2)}
            style={styles.descriptionText}
          >
              <RichText
                text={
                  group.loop_description ||
                  "This group is a vibrant community where members share ideas, collaborate on projects, and support"
                }
                mentions={[]}
                styles={{
                  normalText: styles.descriptionText,
                }}
              />
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

        {/**Creator view */}
        <View style={stylenew.subgroupItemBox}>
          <Text style={stylenew.subgroupMembers}>{"Created by"}</Text>
          <TouchableOpacity
            style={stylenew.subgroupItem}
            onPress={() => handlePressProfile()}
          >
            <View style={stylenew.subgroupIconContainer}>
              <ImageFallBackUser
                imageData={group?.created_by?.profile_pic}
                fullName={group?.created_by?.full_name}
                widths={48}
                heights={48}
                borders={10}
              />
            </View>
            <View style={stylenew.subgroupInfo}>
              <Text style={stylenew.subgroupName}>
                {group?.created_by?.full_name}
              </Text>
              <Text style={stylenew.subgroupDescription}>
                {"@" + group?.created_by?.social_name ||
                  group?.created_by?.username}
              </Text>
              {/* <Text style={stylenew.subgroupMembers}>
            {formatMemberCount(groupDetailsData?.data?.member_count) || 0}{" "}
            members
          </Text> */}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8954F6" />
          </TouchableOpacity>
        </View>

        {/**Share view */}
        <View style={{ paddingHorizontal: 12 }}>
          <Text style={stylenew.subgroupMembers}>
            Share this link to join this community
          </Text>

          <LinkView groupDetails={group} copyToClipboard={copyToClipboard} />
        </View>
        {/**Info view */}
        <View style={{ paddingHorizontal: 12, marginVertical: 14 }}>
          <Text style={stylenew.subgroupMembers}>Other information</Text>

          <View style={stylenew.subgroupItem} pointerEvents="none">
            <View style={stylenew.subgroupIconContainer}>
              <Ionicons name={"people"} size={24} color="#8954F6" />
            </View>
            <View style={stylenew.subgroupInfo}>
              <Text style={stylenew.subgroupDescription}>
                {
                  "Only group members can access and engage in posts and subgroups"
                }
              </Text>
            </View>
          </View>
          <View style={stylenew.subgroupItem} pointerEvents="none">
            <View style={stylenew.subgroupIconContainer}>
              <Ionicons
                name={group.loop_cat == 2 ? "lock-closed" : "earth"}
                size={24}
                color="#8954F6"
              />
            </View>
            <View style={stylenew.subgroupInfo}>
              <Text style={stylenew.subgroupDescription}>
                {group.loop_cat == 1 &&
                  "This is a Public group. Anyone can join this group"}
                {group.loop_cat == 2 &&
                  "This is a Private group. Anyone can send request then admin decide to add in group"}
                {group.loop_cat == 3 &&
                  "This is a Paid group. Pay and join this group"}
              </Text>
            </View>
          </View>
          <View style={stylenew.subgroupItem} pointerEvents="none">
            <View style={stylenew.subgroupIconContainer}>
              <Ionicons name={"shield-checkmark"} size={24} color="#8954F6" />
            </View>
            <View style={stylenew.subgroupInfo}>
              <Text style={stylenew.subgroupDescription}>
                {
                  "Group rules are enforced by Group admins and are in addition to Qoneqt’s rules."
                }
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GroupAboutComponent;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 8,
    flexDirection: "column",
  },
  groupNameText: {
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 24,
    fontFamily: fontFamilies.extraBold,
    color: globalColors.neutralWhite,
    marginRight: 8,
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
  emptyView: {
    // borderTopWidth: 0.5,
    // borderColor: "rgba(255, 255, 255, 0.15)",
    marginTop: "2%",
  },
  // Share Sheet Styles
  shareSheetContainer: {
    alignItems: "center",
  },
  shareSheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  shareSheetTitle: {
    color: globalColors.neutralWhite,
    fontSize: 20,
    textAlign: "center",
  },
});

const stylenew = StyleSheet.create({
  subgroupItemBox: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    // backgroundColor: "rgba(116, 84, 244, 0.03)",
    borderRadius: 16,
    borderWidth: 0.7,
    marginVertical: 12,
    borderColor: "rgba(116, 84, 244, 0.1)",
  },
  subgroupItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    // backgroundColor: "rgba(116, 84, 244, 0.05)",
    borderRadius: 16,
    // marginBottom: 12,
    // borderWidth: 1,
    // borderColor: "rgba(116, 84, 244, 0.1)",
  },
  subgroupIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(116, 84, 244, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  subgroupInfo: {
    flex: 1,
  },
  subgroupName: {
    color: "white",
    fontSize: 16,
    marginBottom: 4,
    fontFamily: fontFamilies.bold,
  },
  subgroupDescription: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 22,
    fontFamily: fontFamilies.regular,
  },
  subgroupMembers: {
    color: "#8954F6",
    fontSize: 12,
    fontFamily: fontFamilies.regular,
  },
  listContent: {
    padding: 16,
  },
});
