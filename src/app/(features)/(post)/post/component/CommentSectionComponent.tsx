import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { memo } from 'react'
import PostLikeComponent from '@/app/(features)/(viewPost)/component/PostLikeComponent';
import { CommentIcon } from '@/assets/DarkIcon';
import { fontFamilies } from '@/assets/fonts';
import { globalColors } from '@/assets/GlobalColors';
import InteractionButton from './InteractionButton';
import ListsEmptyCommentComponent from './ListsEmptyCommentComponent';

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
interface CommentSectionComponentProps {
  isLiked?: boolean;
  likeCount?: number;
  postId?: string;
  Type?: string;
  setID?: (id: string) => void;
  onPressCommentHandler?: (postId: string) => void;
  catclick?: (categoryId: string) => void;
  onShare?: (data: any) => void;
  postData?: any;
  fetchCommentsResponse?: any;
  updateLastCount?: () => void;
  hasMoreData?: boolean;
  commentLoading?: boolean;
  renderComment?: any;
  categoryId?: any;
  categoryName?: any;
}

const CommentSectionComponent: React.FC<CommentSectionComponentProps> = ({
  isLiked,
  likeCount,
  postId,
  Type,
  setID,
  onPressCommentHandler,
  onShare,
  postData,
  fetchCommentsResponse,
  updateLastCount,
  renderComment,
  categoryName,
  categoryId,
  catclick,
}) => {

  return (
    <>
      <View
        style={{
          width: "99%",
          marginHorizontal: "1%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 10,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            // marginTop: "5%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: "5%",
              marginBottom: 2,
            }}
          >
            <PostLikeComponent
              Liked={isLiked ? 1 : 0}
              count={likeCount}
              postId={postId}
              updateLikeStatus={() => {}}
            />
          </View>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: "5%",
              marginBottom: 2,
            }}
            onPress={() => {
              if (Type == "home") {
                setID("3");
              } else if (Type == "trending") {
                setID("4");
              } else if (Type == "Profile") {
                setID("1");
              }
              onPressCommentHandler(postId);
            }}
          >
            {/* <CommentIcon height={24} width={24} /> */}
            <Ionicons name="chatbubble-outline" size={24} color="grey" />
            <Text
              style={{
                marginLeft: 5,
                fontSize: 17,
                fontFamily: fontFamilies.regular,
                color: "grey",
              }}
            >
              {postData?.post_comments_aggregate?.aggregate?.count ||
                postData?.comment_count}
            </Text>
          </TouchableOpacity>

          {/* <InteractionButton
                onPress={() => onShare({ id: postData?.id })}
                count={0}
              /> */}
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            flex: 1,
            marginLeft: "2%",
            // marginTop: "5%",
          }}
        >
          <TouchableOpacity
            // onPress={() => catclick(categoryId)}
            style={{
              borderRadius: 50,
              backgroundColor: globalColors.neutral2,
              borderStyle: "solid",
              borderColor: "#a78bfa",
              borderWidth: 0.8,
              padding: 5,
              justifyContent: "center",
              alignItems: "center",
              right: 18,
              width: categoryName.length + 85,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                fontFamily: fontFamilies.semiBold,
                // color: globalColors.neutral_white["200"],
                color: "#a78bfa",
              }}
            >
              {categoryName}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Comments Section */}
      <View
        style={{ flexDirection: "column", maxHeight: "35%", width: "100%" }}
      >
        <View>
          <FlatList
            data={
              fetchCommentsResponse?.isLoaded
                ? []
                : fetchCommentsResponse?.data || []
            }
            renderItem={renderComment}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              fetchCommentsResponse?.data?.length === 0 &&
              fetchCommentsResponse?.isLoaded ? (
                <ListsEmptyCommentComponent
                  commentLoading={fetchCommentsResponse?.loading}
                  commentData={fetchCommentsResponse?.data || []}
                />
              ) : null
            }
            onEndReached={updateLastCount}
            onEndReachedThreshold={0.5}
          />
        </View>
      </View>
    </>
  );
};

export default memo(CommentSectionComponent)