import { View } from "react-native";
import React, { memo } from "react";
import HomePostContainer from "../element/HomePostContainer";
import ViewWrapper from "../ViewWrapper";

const HomePostComponent = ({
  HomePostData,
  onPressCommentHandler,
  onPressPostOption,
  Type,
}: any) => {

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
              />
            </View>
          ))}
        </View>
      </View>
    </ViewWrapper>
  );
};

export default memo(HomePostComponent);
