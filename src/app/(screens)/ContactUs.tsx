import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import React from "react";
import GoBackNavigation from "@/components/Header/GoBackNavigation";
import ViewWrapper from "@/components/ViewWrapper";
import {
  FacebookIcon,
  InstagramIcon,
  LocationIcon,
  MailIcon,
  PhoneIcon,
  TwitterIcon,
} from "@/assets/DarkIcon";
import { globalColors } from "@/assets/GlobalColors";
import { LinearGradient } from "expo-linear-gradient";
const { width, height } = Dimensions.get("window");

const ContactUs = () => {
  
  const openWebPage = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  return (
    <ViewWrapper>
      <GoBackNavigation header="Contact Us" isDeepLink={true} />
      <ScrollView
        style={{
          width: "100%",
          padding: "5%",
          paddingHorizontal: "2%",
          marginBottom: "5%",
        }}
      >
        <LinearGradient
          colors={globalColors.cardBg3}
          start={{ x: -4.2, y: 2 }}
          end={{ x: -4, y: -5 }}
          style={{
            width: "100%",
            borderColor: "#4E4D5B",
            borderWidth: 0.5,
            borderRadius: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: "5%",
              paddingVertical: "2%",
              width: "100%",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: globalColors.neutral3,
                padding: "2%",
                borderRadius: 10,
                alignSelf: "center",
              }}
            >
              <LocationIcon />
            </View>
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 14,
                lineHeight: 18,
                marginLeft: "5%",
                flex: 1,
              }}
            >
              Human Quotient Private Limited 04, first floor, old building, MBC
              park, Kasarvadavli, Thane - 400615
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: "5%",
              paddingVertical: "2%",
              width: "100%",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: globalColors.neutral3,
                padding: "2%",
                borderRadius: 10,
                alignSelf: "center",
              }}
              onPress={() => openWebPage("mailto:support@qoneqt.com")}
            >
              <MailIcon />
            </TouchableOpacity>
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 14,
                marginLeft: "5%",
              }}
            >
              support@qoneqt.com
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: "5%",
              paddingVertical: "2%",
              width: "100%",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: globalColors.neutral3,
                padding: "2%",
                borderRadius: 10,
                alignSelf: "center",
              }}
              onPress={() => openWebPage("tel:+919082541607")}
            >
              <PhoneIcon />
            </TouchableOpacity>
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 14,
                marginLeft: "5%",
              }}
            >
              +91 9082541607
            </Text>
          </View>

          <View
            style={{
              borderStyle: "solid",
              borderColor: globalColors.neutral8,
              borderTopWidth: 0.5,
              marginVertical: "1%",
              width: "95%",
              alignSelf: "center",
            }}
          />

          <View
            style={{
              flexDirection: "row",
              padding: "3%",
              gap: 5,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: globalColors.neutral3,
                padding: "1%",
                borderRadius: 10,
                alignSelf: "center",
              }}
              onPress={() =>
                openWebPage("https://www.instagram.com/qoneqtapp/")
              }
            >
              <InstagramIcon />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: globalColors.neutral3,
                padding: "1%",
                borderRadius: 10,
                alignSelf: "center",
              }}
              onPress={() =>
                openWebPage(
                  "https://x.com/i/flow/login?redirect_after_login=%2Fqoneqtapp"
                )
              }
            >
              <TwitterIcon />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: globalColors.neutral3,
                padding: "1%",
                borderRadius: 10,
                alignSelf: "center",
              }}
              onPress={() => openWebPage("https://www.facebook.com/qoneqtapp/")}
            >
              <FacebookIcon />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ScrollView>
    </ViewWrapper>
  );
};

export default ContactUs;

{
  /* <Text
          style={{
            fontSize: 22,
            color: globalColors.neutralWhite,
            marginTop: "5%",
          }}
        >
          Contact Form
        </Text>
        <TextInputComponent header="Name" placeHolder="Enter name here" />
        <TextInputComponent header="Email" placeHolder="Enter email here" />
        <TextInputComponent header="Subject" placeHolder="Enter subject here" />
        <TextInputComponent header="Message" placeHolder="Enter message here" />
        <Button1
          title="Send"
          isLoading={false}
          onPress={() => router.push("/SettingScreen")}
        /> */
}
