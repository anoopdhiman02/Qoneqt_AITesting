import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

interface ListsEmptyCommentComponentProps {
    commentLoading: boolean;
    commentData: any[];
}

const ListsEmptyCommentComponent = ({commentLoading, commentData}: ListsEmptyCommentComponentProps) => {
  if (!commentLoading || commentData.length === 0) {
            return (
              <Text style={{ color: "white", alignSelf: "center" }}>
                No comments available.
              </Text>
            );
          }
          return (
            <View style={{ paddingVertical: 10, alignItems: "center" }}>
              <ActivityIndicator size={"large"} color="grey" />
            </View>
          );
}

export default ListsEmptyCommentComponent