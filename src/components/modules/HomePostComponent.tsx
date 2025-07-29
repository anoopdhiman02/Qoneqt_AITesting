import { View } from "react-native";
import React, { memo } from "react";
import HomePostContainer from "../element/HomePostContainer";
import ViewWrapper from "../ViewWrapper";
import { upgradePostData } from "@/redux/slice/post/PostDetailSlice";
import { logEvent } from "@/customHooks/useAnalytics";
import TrackPlayer from "react-native-track-player";
import { useDispatch } from "react-redux";
import { router } from "expo-router";

const HomePostComponent = ({
  HomePostData,
  onPressCommentHandler,
  onPressPostOption,
  Type,
  userInfo,
}: any) => {
  const dispatch = useDispatch();
  const onPressPost = (data: any) => {
    logEvent("post_click", {
      post_id: data?.id,
      type: "category",
    });

    if (data.file_type == "video") {
      TrackPlayer.stop();
    }

    dispatch(upgradePostData(data));
    router.push({
      pathname: "/post/[id]",
      params: {
        id: data?.id,
        Type: "home",
        isNotification: "here",
        categoryName: data?.loop_group?.category.category_name,
      },
    });
  };

  return (
    <ViewWrapper>
      <View
        style={{
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <View style={{ alignSelf: "center" }}>
          {HomePostData?.map((data, index) => (
            <View
              key={index}
              style={{
                marginVertical: "5%",
                width: "100%",
              }}
            >
              <HomePostContainer
                Type={Type}
                onPressComment={(postId) => onPressCommentHandler(postId)}
                onPressPostOption={(data) => onPressPostOption(data)}
                data={data}
                index={index}
                key={index}
                userInfo={userInfo}
                postPress={() => {
                  onPressPost(data);
                }}
              />
            </View>
          ))}
        </View>
      </View>
    </ViewWrapper>
  );
};

export default memo(HomePostComponent);
