import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
  ActivityIndicator,
  Modal,
  Keyboard,
  BackHandler,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef, useState } from "react";
import ViewWrapper from "@/components/ViewWrapper";
import HomePostComponent from "@/components/modules/HomePostComponent";
import useHomeViewModel from "@/app/(features)/(home)/viewModel/HomeViewModel";
import CommentsBottomSheet from "@/app/(features)/(viewPost)/component/CommentsBottomSheet";
import usePostCommentsHook from "@/customHooks/PostCommentsHook";
import { usePostDetailStore } from "@/zustand/PostDetailStore";
import GoBackNavigation from "@/components/Header/GoBackNavigation";
import PostLoaderComponent from "@/components/element/PostLoaderComponent";
import { useReportStore } from "@/zustand/reportStore";
import { useAppStore } from "@/zustand/zustandStore";
import ProfileOptionBottomSheet from "@/components/bottomSheet/ProfileOptionBottomSheet";
import BlockUserBottomSheet from "@/components/bottomSheet/BlockUserBottomSheet";
import useBlockUserHook from "@/customHooks/BlockUserHook";
import { router, useLocalSearchParams } from "expo-router";
import { globalColors } from "@/assets/GlobalColors";
import DeletePostModal from "@/components/modal/DeletePostModal";
import { commentLoading } from "@/redux/slice/post/FetchCommentsSlice";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useScreenTracking } from "@/customHooks/useAnalytics";
import useKeyboardVisible from "../hooks/useKeyboardVisible";

const { width } = Dimensions.get("window");

const CategoriesPost = () => {
  useScreenTracking("CategoriesPost");
  const { categoryId } = useLocalSearchParams();

  const { onFetchCategoryHandler, categoryPostData, categoryPostLoading } =
    useHomeViewModel();
  const { setPostId, setPostedByUserId, postedByUserId } = usePostDetailStore();
  const userId = useAppStore((state) => state.userId);
  const { setReportUserDetails, reportUserDetails } = useReportStore();
  const { onFetchCommentHandler, commentData } =
    usePostCommentsHook();
  const { onPressBlockHandler, blockLoading } = useBlockUserHook();
  const [showCommentModal, setShowCommentModal] = useState(false);
  const CommentSheetRef = useRef<BottomSheet>(null);
  // ref
  const BlockUserRef = useRef<BottomSheet>(null);
  const profileOptionRef = useRef<BottomSheet>(null);

  //loader
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [postGroupData, setPostGroupData] = useState(null);
  const [isBlock, setIsBlock] = useState(false);
  const userDetailsData = useSelector((state: any) => state.myProfileData, shallowEqual);
  const dispatch = useDispatch();
  const [commentIndex, setCommentIndex] = useState(-1);
  const keyboardVisible = useKeyboardVisible();

  const deletePostHandler = () => {
    setIsDeleteModal(false);
    profileOptionRef.current.close();
  };

  const debouncedEndReached = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (!isLoading) {
        setIsLoading(true);
        onFetchCategoryHandler({ catId: categoryId });
        setTimeout(() => setIsLoading(false), 1000);
      }
    }, 300);
  }, [isLoading]);

  const handleScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
      const paddingToBottom = 20;
      if (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
      ) {
        debouncedEndReached();
      }
    },
    [debouncedEndReached]
  );

  const onPressCommentHandler = (postId: any, userId: any) => {
    dispatch(commentLoading(true));
    CommentSheetRef.current.expand();
    setShowCommentModal(true);
    onFetchCommentHandler(postId, 0);
    setPostId(postId);
    setPostedByUserId(userId);
  };

  useEffect(() => {
    onFetchCategoryHandler({ catId: categoryId });
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if(keyboardVisible){
          Keyboard.dismiss();
          return true;
        }
        if(commentIndex == -1){
          // setCommentIndex(1);
          CommentSheetRef.current?.close();
          return true;
        }
        router.back();
        
        
        return true;
      }
    );
    return () => {
      backHandler.remove();
    };
  }, []);

  const onPressReportOption = ({ reportId, name, ProfilePic }) => {
    setReportUserDetails({
      reportId: reportId,
      name: name,
      profilePic: ProfilePic,
      reportType: "post",
    });
    profileOptionRef.current.close();
    router.push("/ReportProfileScreen");
  };
  const onPressBlockOption = () => {
    profileOptionRef.current.close();
    // if(isBlock){
    //   onPressBlockHandler({ profileId: reportUserDetails?.userId, isBlock: 0 });
    //   setIsBlock(false);
    // }
    // else {
    BlockUserRef.current.expand();
    // }
  };

  const onSubmitBlockHandler = ({ profileId, isBlock }) => {
    BlockUserRef.current.close();
    onPressBlockHandler({ profileId: profileId, isBlock: isBlock });
    // setIsBlock(true);
  };

  const onPressPostOption = ({ userData, groupData }) => {
    setReportUserDetails({
      name: userData?.full_name,
      userId: userData?.id,
      profilePic: userData?.profile_pic,
      reportId: userData?.id,
    });
    setPostedByUserId(userData?.id);
    setPostGroupData(groupData);
    profileOptionRef?.current?.expand();
  };
  const onDeletePostOption = () => {
    profileOptionRef?.current?.expand();
  };
  const onChangeSheetIndex = (index: number) => {
    setCommentIndex(index);
  };
  return (
    <ViewWrapper>
      <GoBackNavigation header="Category Posts" isDeepLink={true} />

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {categoryPostLoading && categoryPostData.length === 0 ? (
          <View style={{ flexDirection: "column" }}>
            {[...Array(5)].map((_, index) => (
              <View
                key={index}
                style={{
                  width: (width * 80) / 100,
                  height: (width * 80 * (402 / 308)) / 100,
                  marginHorizontal: 10,
                  marginBottom: 20,
                }}
              >
                <PostLoaderComponent />
              </View>
            ))}
          </View>
        ) : (
          <View>
            <HomePostComponent
              type={"categories"}
              onPressCommentHandler={(postId, userId) =>
                onPressCommentHandler(postId, userId)
              }
              HomePostData={categoryPostData}
              onPressPostOption={(data) =>
                onPressPostOption({ userData: data.userData, groupData: data.groupData })
              }
              userInfo={userDetailsData?.data}
            />
            {categoryPostData.length != 0 && categoryPostLoading && (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 20,
                }}
              >
                <ActivityIndicator
                  size="large"
                  color={globalColors.neutral_white[100]}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>
      <CommentsBottomSheet
        onOpenSheet={CommentSheetRef}
        commentData={commentData}
        onPress={(id) => {
          CommentSheetRef.current.close();
          router.push({
            pathname: "/profile/[id]",
            params: { id: id, isProfile: "false" },
          });
        }}
        setIndex={onChangeSheetIndex}
      />

      <ProfileOptionBottomSheet
        profileOptionRef={profileOptionRef}
        screen={"post"}
        screen_type={"post"}
        onPressReportOption={() =>
          onPressReportOption({
            reportId: reportUserDetails?.reportId,
            name: reportUserDetails?.name,
            ProfilePic: reportUserDetails?.profilePic,
          })
        }
        onPressBlockOption={onPressBlockOption}
        onDeletePostOption={onDeletePostOption}
        postGroupData={postGroupData}
        userId={userId}
        postedByUserId={postedByUserId}
      />

      {/* 4  onSelect Block option from profile option sheet*/}
      <BlockUserBottomSheet
        BlockUserRef={BlockUserRef}
        onPressBlockButton={() =>
          onSubmitBlockHandler({
            profileId: reportUserDetails?.reportId,
            isBlock: 1,
          })
        }
        loading={blockLoading}
      />
      <Modal
              animationType="slide"
              transparent={true}
              visible={isDeleteModal}
              onRequestClose={() => setIsDeleteModal(false)}
            >
              <DeletePostModal
                setDeletePostModal={setIsDeleteModal}
                deletePostHandler={deletePostHandler}
              />
            </Modal>
    </ViewWrapper>
  );
};

export default CategoriesPost;
