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
  FlatList,
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
import { logEvent, useScreenTracking } from "@/customHooks/useAnalytics";
import useKeyboardVisible from "../hooks/useKeyboardVisible";
import index from '../../components/atom/BottomTab/index';
import HomePostContainer from "@/components/element/HomePostContainer";
import TrackPlayer from "react-native-track-player";
import { upgradePostData } from "@/redux/slice/post/PostDetailSlice";
import { useAppSelector } from "@/utils/Hooks";

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
  const categoryData = useAppSelector((state) => state.CategoryPostResponse);

  const deletePostHandler = () => {
    setIsDeleteModal(false);
    profileOptionRef.current.close();
  };

  const debouncedEndReached = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (!isLoading && categoryData?.updatedData.length >4) {
        setIsLoading(true);
        onFetchCategoryHandler({ catId: categoryId });
        setTimeout(() => setIsLoading(false), 1000);
      }
    }, 300);
  }, [isLoading]);


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
    BlockUserRef.current.expand();
  };

  const onSubmitBlockHandler = ({ profileId, isBlock }) => {
    BlockUserRef.current.close();
    onPressBlockHandler({ profileId: profileId, isBlock: isBlock });
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
          Type: "categories",
          isNotification: "here",
          categoryName: data?.loop_group?.category.category_name,
        },
      });
    };

  const renderItem = useCallback(({item, index}) =>{
if(categoryPostLoading && categoryData?.updatedData.length === 0){
    return(
    <View
      key={index}
      style={{
        width: width ,
        height: (width * 80 * (402 / 308)) / 100,
        marginHorizontal: 10,
        marginBottom: 20,
      }}
    >
      <PostLoaderComponent />
    </View>)
}
else {
    return (<HomePostContainer
      Type={"categories"}
      onPressComment={(postId) => onPressCommentHandler(postId,userId )}
      onPressPostOption={(data) => onPressPostOption(data)}
      data={item}
      index={index}
      key={index}
      userInfo={userDetailsData?.data}
      postPress={() => {
        onPressPost(item);
      }}
    />
  )
}}, [categoryData?.updatedData, categoryPostLoading, onPressCommentHandler, onPressPost, onPressPostOption, userDetailsData]);

const ListFooterComponent = () => {
  if(categoryData?.updatedData.length != 0 && categoryPostLoading){
    return (
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
    );
  }
  return (
    <View
      style={{
        height: 20,
      }}
    />
  );
};
  return (
    <ViewWrapper>
      <GoBackNavigation header="Category Posts" isDeepLink={true} />
    <FlatList
    style={{width: "100%"}}
    scrollEventThrottle={16}
    bounces={false}
    showsVerticalScrollIndicator={false}
    data={(categoryPostLoading && categoryData?.updatedData.length === 0) ? [...Array(5)] : categoryData?.updatedData}
    renderItem={renderItem}
    keyExtractor={(item, index) => index.toString()}
    ListFooterComponent={ListFooterComponent}
    onEndReached={debouncedEndReached}
    onEndReachedThreshold={0.3}
    />
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
