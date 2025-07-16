import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { fontFamilies } from "@/assets/fonts";

interface RepliesComponentProps {
  CommentId?: any;
  hideReplies?: any;
  toggleHideReplies?: any;
}

const RepliesComponent = ({
  CommentId,
  hideReplies,
  toggleHideReplies,
}: RepliesComponentProps) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: 5,
        alignSelf: "flex-start",
      }}
      onPress={() => toggleHideReplies(CommentId)}
    >
      <Text
        style={{
          fontSize: 14,
          fontFamily: fontFamilies.regular,
          color: "grey",
        }}
      >
        {hideReplies[CommentId] ? "--View Replies" : "--Hide Replies"}
      </Text>
    </TouchableOpacity>
  );
};

export default React.memo(RepliesComponent);
