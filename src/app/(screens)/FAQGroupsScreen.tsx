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
import GoBackNavigation from "@/components/Header/GoBackNavigation";

const FAQGroupsScreen = () => {
  const [expandedItems, setExpandedItems] = useState([]);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchIconPress = () => setIsInputVisible(true);
  const handleSearchChange = (text: string) => setSearchQuery(text);

  const faqItems = [
    {
      question: "How to create a group?",
      answer:
        "To create a group, navigate to the 'Group' section, tap the 'Plus icon', and provide the required details.",
      image: require("./../../assets/image/CreatePostGroup.png"),
    },
    {
      question: "How to join a group?",
      answer:
        "You can join a group by visiting the group page and tapping the 'Join' button, if the group is open or you have an invite.",
    },
    {
      question: "What is a private vs paid group?",
      answer:
        "A private group requires approval or an invitation to join, while a paid group involves a subscription or fee for access.",
    },
    {
      question: "How to create a post?",
      answer:
        "To create a post, tap on 'Plus icon,' write your content, and hit the 'Post' button.",
      image: require("./../../assets/image/CreatePostGroup.png"),
    },
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
                overflow: "hidden",
                height: 250,
                width: "100%",
                marginTop: 16,
                borderRadius: 10,
              }}
              contentFit="fill"
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
              <ScrollView showsVerticalScrollIndicator={false}>
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
              Groups
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
          {faqItems.map((item) => renderFAQItem(item))}

        {/* Footer */}
        <Text
          style={{
            color: globalColors.neutral5,
            textAlign: "center",
            marginVertical: 10,
            fontFamily: fontFamilies.regular,
          }}
        >
          Got more questions? We're here to help you.
        </Text>
        <Button1 title="Contact Us"  onPress={() => router.push("/ContactUs")} />
        </ScrollView>

      </View>
    </ViewWrapper>
  );
};

export default FAQGroupsScreen;
