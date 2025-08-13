import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { globalColors } from "@/assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";
import Button1 from "@/components/buttons/Button1";
import { ArrowLeftBigIcon, CloseIcon, SearchIcon } from "@/assets/DarkIcon";
import ViewWrapper from "@/components/ViewWrapper";
import { Image } from "expo-image";
import { router } from "expo-router";

const FAQChannelScreen = () => {
  const [expandedItems, setExpandedItems] = useState([]);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchIconPress = () => setIsInputVisible(true);
  const handleSearchChange = (text: string) => setSearchQuery(text);

  const faqItems = [
    {
      question: "How to create a sub-groups?",
      answer:
        "To create a sub-groups, tap the 'Create sub-groups' button, choose a name, set privacy settings, and invite members.",
      image: require("@/assets/image/CreateChannel.jpeg"),
    },
    // {
    //   question: "What is the difference between public and private sub-groups?",
    //   answer:
    //     "Public sub-groups are open to all, while private sub-groups require an invitation or approval from the sub-groups admin.",
    // },
    {
      question: "How to join a sub-groups?",
      answer:
        "For public sub-groups, tap 'Join' on the sub-groups page. For private sub-groups, you'll need an invitation from an existing member.",
      image: require("@/assets/image/JoinChannel.jpeg"),
    },
    {
      question: "What is a private vs public sub-groups?",
      answer:
        "Navigate to the sub-groups, type your message in the text input at the bottom, and press send.",
      image: require("@/assets/image/ChannelType.jpeg"),
    },
    // {
    //   question: "How to send a message in a sub-groups?",
    //   answer:
    //     "Navigate to the sub-groups, type your message in the text input at the bottom, and press send.",
    //   image: require("@/assets/image/ChannelType.jpeg"),
    // },
  ];

  const toggleExpandItem = (question) => {
    setExpandedItems((prev) =>
      prev.includes(question)
        ? prev.filter((item) => item !== question)
        : [...prev, question]
    );
  };

  const renderFAQItem = ({ question, answer, image }) => (
    <TouchableOpacity
      key={question}
      style={{
        backgroundColor: globalColors.neutral2,
        borderRadius: 10,
        marginBottom: 10,
        overflow: "hidden",
      }}
      onPress={() => toggleExpandItem(question)}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 15,
        }}
      >
        <Text
          style={{
            color: globalColors.neutralWhite,
            fontFamily: fontFamilies.semiBold,
          }}
        >
          {question}
        </Text>
        <Text>
          {expandedItems.includes(question) ? (
            <Text
              style={{
                fontSize: 36,
                color: globalColors.neutralWhite,
                fontFamily: fontFamilies.bold,
              }}
            >
              -
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 24,
                color: globalColors.neutralWhite,
                fontFamily: fontFamilies.bold,
              }}
            >
              +
            </Text>
          )}
        </Text>
      </View>
      {expandedItems.includes(question) && (
        <View style={{ padding: 15 }}>
          <Text style={{ color: globalColors.neutral8 }}>{answer}</Text>
          {image && (
            <Image
              style={{
                alignSelf: "stretch",
                overflow: "hidden",
                height: 200,
                width: "100%",
                marginTop: 16,
                borderRadius: 10,
              }}
              contentFit="cover"
              source={image}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ViewWrapper>
      <View style={{ width: "90%" }}>
        {/* Header */}
        <View style={{ marginBottom: "4%" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: "5%",
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <ArrowLeftBigIcon />
            </TouchableOpacity>
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontFamily: fontFamilies.semiBold,
                fontSize: 22,
                marginLeft: 8,
              }}
            >
              sub-groups
            </Text>
          </View>

          {/* Search Section */}
          {/* <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: isInputVisible ? "center" : "flex-end",
              width: "100%",
            }}
          >
            {isInputVisible ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: globalColors.neutral2,
                  borderRadius: 8,
                  paddingHorizontal: 15,
                  paddingVertical: 6,
                  width: "100%",
                }}
              >
                <SearchIcon style={{ marginRight: 8 }} />
                <TextInput
                  value={searchQuery}
                  onChangeText={handleSearchChange}
                  placeholder="Search"
                  placeholderTextColor={globalColors.neutral7}
                  style={{
                    flex: 1,
                    color: globalColors.neutralWhite,
                    fontFamily: fontFamilies.regular,
                    fontSize: 14,
                  }}
                  autoFocus={true}
                />
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery("");
                    if (!searchQuery) {
                      setIsInputVisible(false);
                    }
                  }}
                >
                  <CloseIcon />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: globalColors.neutral2,
                  borderRadius: 8,
                  paddingHorizontal: "5%",
                  paddingVertical: "2.5%",
                }}
                onPress={handleSearchIconPress}
              >
                <SearchIcon />
              </TouchableOpacity>
            )}
          </View> */}
        </View>

        {/* FAQ Items */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {faqItems.map((item) => renderFAQItem(item))}
        </ScrollView>

        {/* Footer */}
        <Text
          style={{
            color: globalColors.neutral5,
            textAlign: "center",
            marginVertical: 10,
            fontFamily: fontFamilies.regular,
          }}
        >
          Need more help? We're here for you.
        </Text>
        <Button1 title="Contact Us" onPress={() => router.push("/ContactUs")} />
      </View>
    </ViewWrapper>
  );
};

export default FAQChannelScreen;
