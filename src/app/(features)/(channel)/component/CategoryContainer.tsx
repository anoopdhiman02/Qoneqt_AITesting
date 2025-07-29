import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { ArrowDownIcon, ArrowUpIcon, OptionsIcon } from "@/assets/DarkIcon";
import { globalColors } from "@/assets/GlobalColors";
import ChannelItemComponent from "./ChannelItemComponent";
import { useChannelStore } from "@/zustand/channelStore";
import { fontFamilies } from "@/assets/fonts";

const CategoryContainer = ({
  data,
  onPressCategoryOption,
  onPressChannelHandler,
  selectedChannel,
  showChannelOption,
  onPressChannelOption,
  onDeleteChannel,
}) => {
  const { setCategoryId, setCategoryDetails } = useChannelStore();
  const [show, setShow] = useState({});
  const [selectedCat, setSelectedCat] = useState(null);
  const onExpandCategory = (id) => {
    setSelectedCat(id);
    setCategoryId(id);
    setShow((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };
  const renderRightActions = (progress, dragX, channelId) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => onPressChannelOption({ channelId })}
          style={{
            backgroundColor: globalColors.neutral5,
            justifyContent: "center",
            alignItems: "center",
            width: "40%",
            height: "88%",
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            marginTop: "8%",
          }}
        >
          <Animated.View
            style={{
              transform: [{ scale }, { rotate: "90deg" }],
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <OptionsIcon color="white" size={24} />
          </Animated.View>
          <Text style={{ color: globalColors.neutral9 }}>More</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView
      style={{
        padding: "2%",
        backgroundColor: globalColors.neutral2,
        borderRadius: 10,
      }}
    >
      {data?.length > 0 ? (
        data.map((categories, index) => (
          <React.Fragment key={categories.id}>
            {index > 0 && (
              <View
                style={{
                  height: 1,
                  backgroundColor: globalColors.neutral4,
                  marginVertical: 8,
                }}
              />
            )}
            <View
              style={{
                backgroundColor: globalColors.neutral2,
                borderRadius: 8,
                marginVertical: 8,
                paddingVertical: 6,
                paddingHorizontal: 8,
              }}
            >
              {/* Category Header */}
              <TouchableOpacity
                onPress={() => onExpandCategory(categories?.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {show[categories?.id] ? <ArrowDownIcon /> : <ArrowUpIcon />}
                  <Text
                    style={{
                      color: globalColors.neutralWhite,
                      fontSize: 18,
                      marginLeft: 10,
                    }}
                  >
                    {categories.category}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    onPressCategoryOption({
                      catData: {
                        catId: categories?.id,
                        catName: categories?.category,
                      },
                    })
                  }
                  style={{
                    padding: 5,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <OptionsIcon width={24} height={24} />
                </TouchableOpacity>
              </TouchableOpacity>

              {/* Channel List */}
              {show[categories?.id] && (
                <View>
                  {categories?.channel_list?.length > 0 ? (
                    categories?.channel_list?.map((dat) => (
                      // <Swipeable

                      //   comment
                      //   avoid
                      //   key={dat?.id}
                      //   renderRightActions={(progress, dragX) =>
                      //     renderRightActions(progress, dragX, dat?.id)
                      //   }
                      // >
                      <View
                        style={{
                          marginTop: "3%",
                          borderRadius: 5,
                          borderWidth: 1,
                          borderColor: globalColors.neutral4,
                          overflow: "hidden",
                        }}
                      >
                        <ChannelItemComponent
                          categoryName={dat?.channel_name||""}
                          channelId={dat?.id||""}
                          channelLogo={dat?.channel_image||""}
                          channelName={dat?.channel_name||"No Name"}
                          lastMsg=""
                          messagerName="test"
                          unReadCount={10}
                          onPressChannel={onPressChannelHandler}
                          selectedChannel={selectedChannel}
                          showChannelOption={showChannelOption}
                        />
                      </View>
                      // </Swipeable>
                    ))
                  ) : (
                    <Text
                      style={{
                        color: globalColors.neutralWhite,
                        marginTop: 10,
                      }}
                    >
                      No Sub-groups
                    </Text>
                  )}
                </View>
              )}
            </View>
          </React.Fragment>
        ))
      ) : (
        <Text
          style={{
            color: globalColors.neutralWhite,
            fontSize: 16,
            fontFamily: fontFamilies.regular,
            textAlign: "center",
          }}
        >
          No Categories
        </Text>
      )}
    </ScrollView>
  );
};
export default CategoryContainer;
