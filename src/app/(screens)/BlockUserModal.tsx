import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ViewWrapper from "../../components/ViewWrapper";
import Button1 from "../../components/buttons/Button1";
import { UserIcon, VerifiedIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";

const Profile = () => {
  return (
    <TouchableOpacity
      style={{
        alignSelf: "stretch",
        borderRadius: 8,
        borderColor: "#282b32",
        borderWidth: 1,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <UserIcon />
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            marginLeft: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                letterSpacing: -0.2,
                lineHeight: 20,

                fontFamily: fontFamilies.semiBold,
                color: globalColors.neutralWhite,
              }}
            >
              Sharathkumar
            </Text>
            <VerifiedIcon />
          </View>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 18,

              fontFamily: fontFamilies.light,
              color: globalColors.neutralWhite,
              marginTop: "3%",
            }}
          >
            @ Sharath 123
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ListItem = ({ number, text }) => (
  <View
    style={{
      alignSelf: "stretch",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      marginTop: "5%",
    }}
  >
    <View
      style={{
        borderRadius: 8,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        width: "13%",
        height: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          lineHeight: 20,

          fontFamily: fontFamilies.semiBold,
          color: globalColors.neutralWhite,
        }}
      >
        {number}
      </Text>
    </View>
    <Text
      style={{
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        fontFamily: fontFamilies.regular,
        color: globalColors.neutralWhite,
        marginLeft: 12,
      }}
    >
      {text}
    </Text>
  </View>
);

const List = () => {
  return (
    <View
      style={{
        alignSelf: "stretch",
        marginTop: "10%",
        marginBottom: "33%",
      }}
    >
      <ListItem
        number="1"
        text="They won’t be able to message you or find your profile or content on Instagram."
      />
      <ListItem
        number="2"
        text={`They won’t be noticed that you \nblocked them.`}
      />
      <ListItem
        number="3"
        text={`You can unblock them at any time\n in settings.`}
      />
    </View>
  );
};

const Buttons = () => {
  return (
    <View style={{ width: "100%" }}>
      <Button1 title="Block" onPress={() => console.log("Block")} />
      <TouchableOpacity onPress={() => console.log("Block and report")}>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 21,

            fontFamily: fontFamilies.regular,
            color: globalColors.neutralWhite,
            textAlign: "center",
            marginTop: "10%",
            marginBottom: "35%",
          }}
        >
          Block and report
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const BlockUserModal = () => {
  return (
    <ViewWrapper>
      <View
        style={{
          flex: 1,
          width: "90%",
          alignItems: "center",
          marginTop: "5%",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            lineHeight: 28,

            fontFamily: fontFamilies.medium,
            color: globalColors.neutralWhite,
            textAlign: "center",
            marginTop: "5%",
          }}
        >
          Block profile
        </Text>
        <Text
          style={{
            flex: 1,
            fontSize: 12,
            lineHeight: 17,
            fontFamily: fontFamilies.regular,
            color: globalColors.neutralWhite,
            textAlign: "center",
          }}
        >{`This will also block any other accounts that they\nmay have or create in the future.`}</Text>
        <Profile />
        <List />
        <Buttons />
      </View>
    </ViewWrapper>
  );
};

export default BlockUserModal;
