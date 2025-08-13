import { StyleSheet, Text, View } from "react-native";
import React, { useCallback } from "react";
import { ImageFallBackUser } from "@/utils/ImageUrlConcat";
import { ArrowLeftBigIcon } from "@/assets/DarkIcon";
import { OptionsIcon } from "@/assets/DarkIcon";
import { VerifiedIcon } from "@/assets/DarkIcon";
import { TouchableOpacity } from "react-native";
import styles from "../UserChatScreen.styles";

const ChatHeaderView = ({
  chatUserDetails,
  profilePress,
  backPre,
  from,
  name,
  logo,
  paramsData,
  onOptionsPress,
}) => {
  const Header = useCallback(() => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.headerProfileSection}
          disabled={chatUserDetails?.id == undefined}
          onPress={() => {
            profilePress();
          }}
        >
          <ImageFallBackUser
            imageData={chatUserDetails?.profile_pic || logo}
            fullName={
              from == "1"
                ? chatUserDetails?.full_name || name
                : `# ${paramsData?.name}`
            }
            widths={35}
            heights={35}
            borders={16}
          />
          <Text style={styles.headerUserName}>
            {from == "1"
              ? chatUserDetails?.full_name || name
              : `# ${paramsData?.name}`}
          </Text>
          {(chatUserDetails?.kyc_status == 1 || paramsData?.kyc == "1") && (
            <VerifiedIcon />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onOptionsPress}>
          <OptionsIcon width={24} height={24} />
        </TouchableOpacity>
      </View>
    );
  }, [chatUserDetails]);
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        onPress={() => backPre()}
        // style={{ right: "45%", marginTop: "3%" }}
      >
        <ArrowLeftBigIcon style={{ left: "25%" }} />
      </TouchableOpacity>
      <Header />
    </View>
  );
};

export default ChatHeaderView;
