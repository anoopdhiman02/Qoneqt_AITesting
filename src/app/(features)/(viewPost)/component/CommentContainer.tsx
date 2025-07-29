import {
  Dimensions,
  KeyboardAvoidingView,
  LayoutAnimation,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Image } from "expo-image";
import { ImageUrlConcated } from "@/utils/ImageUrlConcat";
import {
  DeleteIcon,
  PaperPlaneIcon,
  UserIcon,
  VerifiedIcon,
} from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import moment from "moment";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { onCommentDelete } from "@/redux/reducer/post/CommentDelete";
import {
  useCommentRef,
  useCommentStore,
  useDeleteIdStore,
  useIdStore,
} from "@/customHooks/CommentUpdateStore";
import usePostCommentsHook from "@/customHooks/PostCommentsHook";
import { useAppStore } from "@/zustand/zustandStore";
import { UpdateData } from "@/redux/slice/post/FetchCommentsSlice";
import { usePostDetailStore } from "@/zustand/PostDetailStore";
import useHomeViewModel from "../../(home)/viewModel/HomeViewModel";
import { debounce } from "lodash";

const {width, height} = Dimensions.get("window");

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const animateLayout = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};

const CommentContainer = ({
  postId,
  commentLoading,
  enterComment,
  onEnterComment,
  addComment,
}: any) => {
  const Dispatch = useAppDispatch();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [key, setKey] = React.useState(null);
  const inputRef = useRef<TextInput>(null); // Reference for TextInput
  const {
    expandModal,
    setExpandModal,
    inputRef: globalInputRef,
    setInputRef,
    setCommentId,
    CommentId,
    replyingTo,
    setReplyingTo,
    replyStatus,
    setReplyStatus,
    repliedId,
    setRepliedId,
  } = useCommentRef();

  useEffect(() => {
    if (expandModal) inputRef.current?.focus();
  }, [expandModal]);

  const { onRefreshHandler } = useHomeViewModel();

  const { Deleteid, setDeleteID } = useDeleteIdStore();
  const { UpdatedeletePost } = useHomeViewModel();
  const postDetailsResponse = useAppSelector((state) => state.postDetailData);

  const handleDeleteComment = ({ CommentId }) => {
    if (!fetchCommentsResponse?.data) return;

    const newData = fetchCommentsResponse?.data?.filter(
      (item: { id: any }) => item.id !== CommentId
    );

    Dispatch(
      onCommentDelete({
        userId: userId,
        commentId: CommentId,
        postId: postId,
      })
    );

    Dispatch(UpdateData(newData));
    setModalVisible(false);
  };
  const { id, setID } = useIdStore();

  const myPostListResponse = useAppSelector((state) => state.myFeedsListData);
  const HomePostResponse = useAppSelector((state) => state.HomePostResponse);
  const discoverPostResponse = useAppSelector(
    (state) => state.DiscoverPostResponse
  );
  const trendingPostResponse = useAppSelector(
    (state) => state.TrendingPostResponse
  );
  const postDetailResponse = useAppSelector((state) => state.myFeedData);

  const onPressConfirmHandler = (key) => {
    setModalVisible(true);
    setKey(key);
  };
  const handleReplyDeleteComment = ({ ReplyId, CommentId }) => {
    if (!fetchCommentsResponse?.data) return;

    const updatedComments = fetchCommentsResponse?.data.map((item) => {
      if (item.id === CommentId) {
        return {
          ...item,
          replies: item.replies.filter((reply) => reply.id !== ReplyId),
        };
      }
      return item;
    });

    Dispatch(UpdateData(updatedComments));

    Dispatch(
      onCommentDelete({
        userId: userId,
        commentId: ReplyId,
        postId: postId,
      })
    );
  };

  const UpdateDeleteCount = () => {
    if (id === "1") {
      UpdatedeletePost(
        postId,

        myPostListResponse.updatedData
      );
    } else if (id === "2") {
      UpdatedeletePost(postId, discoverPostResponse?.data);
    } else if (id === "3") {
      UpdatedeletePost(postId, HomePostResponse?.UpdatedData);
    } else if (id === "4") {
      UpdatedeletePost(postId, trendingPostResponse?.data);
    } else if (id === "5") {
      UpdatedeletePost(postId, postDetailsResponse?.data);
    } else if (id === "6" && postDetailResponse?.updatedData[0].post_by) {
      UpdatedeletePost(postId, postDetailResponse?.updatedData);
    }
  };
  const { userId } = useAppStore();

  const { postedByUserId } = usePostDetailStore();

  const [hideReplies, setHideReplies] = useState({});

  const fetchCommentsResponse = useAppSelector(
    (state) => state.fetchCommentsData
  );

  if (commentLoading) {
    return (
      <View>
        <Text
          style={{
            fontFamily: fontFamilies.semiBold,
            fontSize: 24,
            color: globalColors.neutralWhite,
          }}
        >
          Loading
        </Text>
      </View>
    );
  } else {
    const toggleHideReplies = (CommentId) => {
      setHideReplies((prevState) => ({
        ...prevState,
        [CommentId]: !prevState[CommentId], // Toggle the visibility for the specific comment ID
      }));
    };

    const handleAddComment = (data) => {
      addComment({
        postId: postId,
        parentId: replyStatus ? CommentId : 0,
        userId: userId,
        content: data,
        timestamp: moment().toISOString(),
      });
    };


    return (
      <View>
          <View
            style={{
              borderStyle: "solid",
              borderColor: globalColors.neutral4,
              borderTopWidth: 0.5,
              height: 1,
              margin: "5%",
              width: width,
              alignSelf: "center",
            }}
          />
          <View style={{paddingHorizontal: '5%', flex:1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {fetchCommentsResponse?.data?.length > 0 ? (
            fetchCommentsResponse?.data?.map((data, index) => {
              const hasReplies = data.replies && data.replies.length > 0;

              return (
                <View key={data.id.toString()}>
                  <TouchableOpacity
                    onLongPress={() => {
                      setCommentId(data.id);
                      onPressConfirmHandler(1);
                    }}
                    key={index}
                    style={{
                      borderRadius: 8,
                      flexDirection: "row",
                      padding: "3%",
                      marginTop: "5%",
                      width: "100%",
                    }}
                  >
                    {data?.user?.profile_pic?.length > 0 ? (
                      <Image
                        style={{
                          borderRadius: 30,
                          width: 38,
                          height: 38,
                          borderColor: globalColors.slateBlueTint20,
                          borderWidth: 0.5,
                          backgroundColor: globalColors.neutralWhite,
                        }}
                        contentFit="cover"
                        source={{
                          uri: ImageUrlConcated(data?.user?.profile_pic),
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          shadowColor: globalColors.darkOrchidShade80,
                        }}
                      >
                        <UserIcon />
                      </View>
                    )}

                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: fontFamilies.semiBold,
                            color: globalColors.neutralWhite,
                          }}
                        >
                          {data?.user?.full_name}
                        </Text>
                        {data?.user?.verified && (
                          <VerifiedIcon style={{ marginLeft: 5 }} />
                        )}
                        <Text
                          style={{
                            fontSize: 12,
                            lineHeight: 18,
                            fontFamily: fontFamilies.regular,
                            color: globalColors.neutral9,
                            marginLeft: 8,
                          }}
                        >
                          {moment
                            .utc(data?.created_at)
                            .utcOffset("+05:30")
                            .fromNow(true)}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          marginTop: 3,
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: 14,
                            fontFamily: fontFamilies.regular,
                            color: globalColors.neutralWhite,
                          }}
                        >
                          {data?.comment}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: "1%",
                        }}
                      >
                        <View>
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "flex-start",
                            }}
                            onPress={() => {
                              setCommentId(data.id);
                              inputRef.current?.focus();
                              setReplyStatus(true);
                              setReplyingTo(data?.user);
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                fontFamily: fontFamilies.regular,
                                color: globalColors.neutral8,
                              }}
                            >
                              Reply
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {data?.replies?.map((repliedData, key) => {
                        const isHidden = hideReplies[CommentId];
                        return (
                          !isHidden && (
                            <View
                              key={key}
                              style={{
                                borderRadius: 8,
                                flexDirection: "row",
                                padding: "3%",
                                marginTop: "5%",
                                width: "100%",
                              }}
                            >
                              {repliedData.user.profile_pic?.length > 0 ? (
                                <Image
                                  style={{
                                    borderRadius: 30,
                                    width: 30,
                                    height: 30,
                                    borderColor: globalColors.slateBlueTint20,
                                    borderWidth: 0.5,
                                    backgroundColor: globalColors.neutralWhite,
                                  }}
                                  contentFit="cover"
                                  source={{
                                    uri: ImageUrlConcated(
                                      repliedData.user.profile_pic
                                    ),
                                  }}
                                />
                              ) : (
                                <View
                                  style={{
                                    shadowColor: globalColors.darkOrchidShade80,
                                  }}
                                >
                                  <UserIcon />
                                </View>
                              )}

                              <View style={{ marginLeft: 12, flex: 1 }}>
                                <TouchableOpacity
                                  onPress={() => {}}
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 16,
                                      fontFamily: fontFamilies.semiBold,
                                      color: globalColors.neutralWhite,
                                    }}
                                  >
                                    {repliedData.user.full_name}
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 11,
                                      lineHeight: 18,
                                      fontFamily: fontFamilies.regular,
                                      color: globalColors.neutral9,
                                      marginLeft: 8,
                                    }}
                                  >
                                    {moment
                                      .utc(repliedData?.created_at)
                                      .utcOffset("+05:30")
                                      .fromNow(true)}
                                  </Text>
                                </TouchableOpacity>

                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    marginTop: 3,
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 14,
                                      fontFamily: fontFamilies.regular,
                                      color: globalColors.neutralWhite,
                                    }}
                                  >
                                    {repliedData?.comment}
                                  </Text>
                                </View>
                                <TouchableOpacity
                                  onPress={() => {
                                    setRepliedId(repliedData.id);
                                    onPressConfirmHandler(2);
                                  }}
                                  style={{
                                    marginTop: "1%",
                                  }}
                                >
                                  <Text
                                    style={{ color: globalColors.neutral8 }}
                                  >
                                    Delete
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          )
                        );
                      })}
                      {hasReplies && (
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
                              color: globalColors.neutral7,
                            }}
                          >
                            {hideReplies[CommentId]
                              ? "--View Replies"
                              : "--Hide Replies"}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                  >
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: globalColors.neutral2,
                          borderRadius: 10,
                          padding: 20,
                          alignItems: "center",
                          elevation: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            fontFamily: fontFamilies.bold,
                            color: globalColors.neutralWhite,
                            marginBottom: 10,
                          }}
                        >
                          Delete Comment
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: fontFamilies.regular,
                            color: globalColors.neutralWhite,
                            marginBottom: 20,
                            textAlign: "center",
                          }}
                        >
                          Are you sure you want to delete?
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            width: "100%",
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              paddingVertical: 10,
                              paddingHorizontal: 20,
                              borderRadius: 5,
                              minWidth: 100,
                              alignItems: "center",
                              backgroundColor: globalColors.neutral4,
                            }}
                            onPress={() => setModalVisible(false)}
                          >
                            <Text
                              style={{
                                color: globalColors.neutralWhite,
                                fontFamily: fontFamilies.medium,
                              }}
                            >
                              Cancel
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              paddingVertical: 10,
                              paddingHorizontal: 20,
                              borderRadius: 5,
                              minWidth: 100,
                              alignItems: "center",
                              backgroundColor: globalColors.neutral4,
                            }}
                            onPress={() => {
                              setModalVisible(false);
                              UpdateDeleteCount();
                              if (key === 1) {
                                handleDeleteComment({
                                  CommentId: CommentId,
                                });
                              } else if (key === 2) {
                                handleReplyDeleteComment({
                                  ReplyId: repliedId,
                                  CommentId: data.id,
                                });
                              }
                            }}
                          >
                            <Text
                              style={{
                                color: globalColors.neutralWhite,
                                fontFamily: fontFamilies.medium,
                              }}
                            >
                              Delete
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View>
              );
            })
          ) : (
            <View style={{ marginTop: "5%" }}>
              <Text
                style={{
                  fontFamily: fontFamilies.semiBold,
                  fontSize: 22,
                  color: globalColors.neutral7,
                  textAlign: "center",
                }}
              >
                No Comments
              </Text>
            </View>
          )}
        </ScrollView>
        </View>

        {replyStatus && (
          <View
            style={{
              marginTop: "2%",
              marginBottom: "2%",
              borderRadius: 25,
              width: "90%",
              flexDirection: "row",
              backgroundColor: "#3f385b",
              padding: "2%",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#e1d4fc" }}>Replying to {replyingTo?.full_name}</Text>
            </View>

            <View style={{ alignSelf: "flex-end" }}>
              <TouchableOpacity onPress={() => setReplyStatus(false)}>
                <Image
                  style={{
                    borderRadius: 8,
                    width: 15,
                    height: 15,
                  }}
                  source={require("./../../../../../assets/images/close.png")}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View
          style={{
            width: width *0.9,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: width *0.05,
            paddingHorizontal: '5%'
          }}
        >
          <TextInput
            ref={inputRef} // Set the ref here
            style={{
              fontSize: 14,
              height: 50,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutralWhite,
              width: "100%",
              textAlignVertical: "top",
              borderWidth: 0.6,
              borderColor: globalColors?.neutral4,
              marginRight: "3%",
              alignItems: "center",
              padding: 14,
              justifyContent: "center",
              borderRadius: 15,
            }}
            numberOfLines={6}
            placeholder={"Enter Comment..."}
            placeholderTextColor={globalColors.neutral5}
            onChangeText={(text)=>onEnterComment(text)}
            value={enterComment}
            onBlur={() => {
              setReplyStatus(false);
              setCommentId("");
            }}
          />
          <TouchableOpacity onPress={()=>handleAddComment(enterComment)}>
            <PaperPlaneIcon />
          </TouchableOpacity>
        </View>
      {/* </KeyboardAvoidingView> */}
      </View>
    );
  }
};

export default memo(CommentContainer);
