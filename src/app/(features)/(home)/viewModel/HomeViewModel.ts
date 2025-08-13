
import React, { 
  useCallback, 
  useEffect, 
  useState,  
} from "react";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { useAppStore } from "@/zustand/zustandStore";
import { onFetchHomeNextPost, onFetchHomePost } from "@/redux/reducer/home/HomePostApi";
import { router } from "expo-router";
import { onFetchTrendingPost } from "@/redux/reducer/home/TrendingPostApi";
import { onFetchCategoryPost } from "@/redux/reducer/home/CategoryPostApi";
import useMyPostsViewModel from "@/structure/viewModels/profile/MyPostsViewModel";
import { useIdStore } from "@/customHooks/CommentUpdateStore";
import { setUserFeedData } from "@/redux/slice/profile/UserFeedsSlice";
import { setHomePostSlice } from "@/redux/slice/home/HomePostSlice";
import { trendingUserPost } from "@/redux/slice/home/TrendingPostSlice";
import { updateCount, upgradePostData } from "@/redux/slice/post/PostDetailSlice";
import usePostDetailViewModel from "../../(viewPost)/viewModel/PostDetailViewModel";
import { setMyUserFeedData } from "@/redux/slice/profile/ProfileMyFeedsSlice";
import { setPrefsValue, getPrefsValue } from "@/utils/storage";
import { AllGroupReq } from "@/redux/reducer/group/AllGroups";
import { calculateHeight } from "@/utils/ImageHelper";
import { Dimensions, InteractionManager } from "react-native";
import { setHomeNextPostData } from "@/redux/slice/home/HomePostNextSlice";
import { updateReactions } from "@/redux/slice/group/GroupFeedsListSlice";
import { updateCategoryPostData } from "@/redux/slice/home/CategoryPostSlice";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const useHomeViewModel = () => {
  const Dispatch = useAppDispatch();
  const userId = useAppStore((state) => state.userId);
  const id = useIdStore((state) => state.id);
  const setRefreshHome = useAppStore((state) => state.setRefreshHome);
  const HomePostResponse = useAppSelector((state) => state.HomePostResponse);
  const { setMyFeedsData } = useMyPostsViewModel();
  const { setPostData } = usePostDetailViewModel();
  const myFeedsListData = useAppSelector((state) => state.myFeedsListData);
  const postDetailData: any = useAppSelector((state) => state.postDetailData);
  const myFeedData = useAppSelector((state) => state.myFeedData);
  const categoryData = useAppSelector((state) => state.CategoryPostResponse);
const groupFeedsListData: any = useAppSelector(
    (state) => state.groupFeedsListData
  );
  const trendingPostResponse = useAppSelector(
    (state) => state.TrendingPostResponse
  );
  
  const AllGroupList = useAppSelector((state) => state.allGroupSlice);

  // Category Post data
  const [categoryPostData, setCategoryPostData] = useState([]);
  const [categoryPostLoading, setCategoryPostLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


  const [isLoadingNewData, setIsLoadingNewData] = useState(false);
  const updatePostData = (postID: any, PostData: any) => {
    const updatedPosts = PostData?.map((item: any) => {
      if (item.id == postID) {
        if (
          item.comment_count
        ) {
          return {
            ...item,
            comment_count: (item?.comment_count || 0) + 1,
          };
        }
      }
      return item;
    });

    if (id === "3") {
      Dispatch(setHomePostSlice(updatedPosts));
    } else if (id === "1") {
      setMyFeedsData(updatedPosts);
      Dispatch(setUserFeedData(updatedPosts));
    } else if (id === "4") {
      Dispatch(trendingUserPost(updatedPosts));
    } else if (id === "5") {
      setPostData(updatedPosts);
      Dispatch(updateCount(updatedPosts));
    }
  };

  const UpdatedeletePost = (postID, count) => {
    const homeLocalPostData = JSON.parse(getPrefsValue("homePostData") || "[]");
    // Batch all updates with optimized function
    const updates = [
      { data: HomePostResponse?.UpdatedData || [], action: setHomePostSlice },
      { data: trendingPostResponse?.data || [], action: trendingUserPost },
      { data: myFeedsListData?.updatedData || [], action: setUserFeedData },
      { data: myFeedData?.updatedData || [], action: setMyUserFeedData },
      { data: groupFeedsListData?.UpdatedData || [], action: updateReactions },
      { data: postDetailData?.data || [], action: updateCount },
      { data: categoryData?.updatedData || [], action: updateCategoryPostData }
    ];
  
    const dispatchPromises = updates.map(({ data, action }) => {
      const updatedData = updateCommentPostsFast(data, postID, true);
      return Dispatch(action(updatedData));
    });
  
    // Handle local storage and post detail
    const updatedLocalData: any = updateCommentPostsFast(homeLocalPostData, postID, true);
    // @ts-ignore
    dispatchPromises.push(setPrefsValue("homePostData", JSON.stringify(updatedLocalData)));

    if (postDetailData?.newData?.id) {
      const updatedPostData: any = updateCommentPostsFast([postDetailData.newData], postID, true);
      // @ts-ignore
      dispatchPromises.push(Dispatch(upgradePostData(updatedPostData[0])));
    }
    return Promise.all(dispatchPromises);
  };


  const updateOtherPostData = (postID) => {
    const homeLocalPostData = JSON.parse(getPrefsValue("homePostData") || "[]");
    // Batch all updates with optimized function
    const updates = [
      { data: HomePostResponse?.UpdatedData || [], action: setHomePostSlice },
      { data: trendingPostResponse?.data || [], action: trendingUserPost },
      { data: myFeedsListData?.updatedData || [], action: setUserFeedData },
      { data: myFeedData?.updatedData || [], action: setMyUserFeedData },
      { data: groupFeedsListData?.UpdatedData || [], action: updateReactions },
      { data: categoryData?.updatedData || [], action: updateCategoryPostData }
    ];
  
    const dispatchPromises = updates.map(({ data, action }) => {
      const updatedData = updateCommentPostsFast(data, postID, true);
      return Dispatch(action(updatedData));
    });
  
    // Handle local storage and post detail
    const updatedLocalData: any = updateCommentPostsFast(homeLocalPostData, postID, true);
    // @ts-ignore
    dispatchPromises.push(setPrefsValue("homePostData", JSON.stringify(updatedLocalData)));
    
    if (postDetailData?.newData?.id) {
      const updatedPostData: any = updateCommentPostsFast([postDetailData.newData], postID, true);
      // @ts-ignore
      dispatchPromises.push(Dispatch(upgradePostData(updatedPostData[0])));
    }
  
    return Promise.all(dispatchPromises);
    
  };

  const updateCommentPostsFast = (posts, postID, isAdd) => {
    // if (!Array.isArray(posts)) return posts;
    var isArryValue = Array.isArray(posts)? posts : [...posts];
    
    const targetIndex = isArryValue.findIndex(item => item?.id === postID);
    if (targetIndex === -1) return posts;
    
    // Shallow copy with single item update
    const updatedPosts = [...isArryValue];
    const targetPost = isArryValue[targetIndex];
    
    updatedPosts[targetIndex] = {
      ...targetPost,
      comment_count: (targetPost?.comment_count || 0) + (isAdd ? 1 : -1),
    };
    
    return Array.isArray(posts)? updatedPosts : updatedPosts[0];
  };

  const updateOtherLikePostData = (postID, count) => {
    const homeLocalPostData = JSON.parse(getPrefsValue("homePostData") || "[]");
    
    // Pre-compute the like update object
    const likeUpdate = {
      likeByMe: count === 1 ? [{ id: 53307, reaction: 1 }] : [],
      countDelta: count
    };
    
    // Batch all updates with optimized function
    const updates = [
      { data: HomePostResponse?.UpdatedData || [], action: setHomePostSlice },
      { data: trendingPostResponse?.data || [], action: trendingUserPost },
      { data: myFeedsListData.updatedData || [], action: setUserFeedData },
      { data: myFeedData?.updatedData || [], action: setMyUserFeedData },
      { data: groupFeedsListData?.UpdatedData || [], action: updateReactions },
      { data: categoryData?.updatedData || [], action: updateCategoryPostData }
    ];
  
    const dispatchPromises = updates.map(({ data, action }) => {
      const updatedData = updateLikePostsFast(data, postID, likeUpdate);
      return Dispatch(action(updatedData));
    });
  
    // Handle local storage and post detail
    const updatedLocalData: any = updateLikePostsFast(homeLocalPostData, postID, likeUpdate);
    // @ts-ignore
    dispatchPromises.push(setPrefsValue("homePostData", JSON.stringify(updatedLocalData)));
    
    if (postDetailData?.newData?.id) {
      const updatedPostData: any = updateLikePostsFast([postDetailData.newData], postID, likeUpdate);
      // @ts-ignore
      dispatchPromises.push(Dispatch(upgradePostData(updatedPostData[0])));
    }
    if(categoryPostData?.length > 0){
      const updatedPostData: any = updateLikePostsFast(categoryPostData, postID, likeUpdate);
      setCategoryPostData(updatedPostData);
    }
  
    return Promise.all(dispatchPromises);
  };

  const updateLikePostsFast = (posts, postID, likeUpdate) => {
    // if (!Array.isArray(posts)) return posts;
    var isArryValue = Array.isArray(posts)? posts : [...posts];
    
    const targetIndex = isArryValue.findIndex(item => item?.id === postID);
    if (targetIndex === -1) return posts;
    
    // Shallow copy with single item update
    const updatedPosts = [...isArryValue];
    const targetPost = isArryValue[targetIndex];
    
    updatedPosts[targetIndex] = {
      ...targetPost,
      likeByMe: likeUpdate.likeByMe,
      like_count: (targetPost?.like_count || 0) + likeUpdate.countDelta,
    };
    
    return Array.isArray(posts)? updatedPosts : updatedPosts[0];
  };

  const MyCommunities = useCallback(() => {
    Dispatch(AllGroupReq({ fromApp: 1, last_count: 0, user_id: userId }));
  }, []);

  


  const onFetchHomeHandler = useCallback(async ({ isLoadMore, isFirst, lastCount, isCheck }: any) => {
    if(userId){
    if(isLoadMore){
      // @ts-ignore
   var newNextPostData: any =   Dispatch(onFetchHomeNextPost({
        userId: userId,
        lastCount: lastCount,
        limit_count: 100
      }));  

      if(newNextPostData?.payload?.data?.length > 0){
        var newData = await Promise.all(newNextPostData?.payload?.data?.map(async (item) => {
          if(item?.file_type == "image"){
            return {
              ...item,
              display_height: (await Promise.all(calculateHeight(item)))
            };
          }
          return {
            ...item
          };
        }));
         Dispatch(setHomeNextPostData(newData));
        
      }

    }else  {
     var newPostData: any =  await Dispatch(
        // @ts-ignore
        onFetchHomePost({
          userId: userId,
          lastCount: 0,
          limit_count:10
        })
      );

      if(newPostData?.payload?.data?.length > 0){
        var newData = await Promise.all(newPostData?.payload?.data?.map(async (item) => {
          if(item?.file_type == "image"){
            return {
              ...item,
              display_height: (await Promise.all(calculateHeight(item)))
            };
          }
          return {
            ...item
          };
        }));
        Dispatch(setHomePostSlice(newData));
        InteractionManager.runAfterInteractions(() => {
        setPrefsValue("homePostData", JSON.stringify(newData));
        });
        
      }
    }
    }
  }, [HomePostResponse.UpdatedData]);

  const OnRefreshHandlerHome = async () => {
    if(userId){
    onFetchHomeHandler({isLoadMore:false,isFirst:false,lastCount:0,isCheck:false});
    // @ts-ignore
   var newNextPostData: any = await Dispatch(onFetchHomeNextPost({
      userId: userId,
      lastCount: 10,
      limit_count:100
    }));
    if(newNextPostData?.payload?.data?.length > 0){
      var newData = await Promise.all(newNextPostData?.payload?.data?.map(async (item) => {
        if(item?.file_type == "image"){
          return {
            ...item,
            display_height: (await Promise.all(calculateHeight(item)))
          };
        }
        return {
          ...item
        };
      }));
      Dispatch(setHomeNextPostData(newData));
      
    }
      }
    }
  

  const onFetchTrendingHandler = async () => {
   var newTrendingPostData: any = await Dispatch(
      onFetchTrendingPost({
        userId: userId,
        lastCount: 0,
      })
    );
    if(newTrendingPostData?.payload?.data?.length > 0){
      var newData = await Promise.all(newTrendingPostData?.payload?.data?.map(async (item) => {
        if(item?.file_type == "image"){
          return {
            ...item,
            display_height: (await Promise.all(calculateHeight(item)))
          };
        }
        return {
          ...item
        };
      }));
      Dispatch(trendingUserPost(newData));
      
    }
  };


  const onFetchCategoryHandler = async({ catId }) => {
    try{
    setCategoryPostLoading(true);
   var newCategoryPostData: any = await Dispatch(
      onFetchCategoryPost({
        userId: userId,
        catId: catId,
        lastCount: categoryPostData.length,
      })
    );
    if(newCategoryPostData?.payload?.data?.length > 0){
      var newData = await Promise.all(newCategoryPostData?.payload?.data?.map(async (item) => {
        if(item?.file_type == "image"){
          return {
            ...item,
            display_height: (await Promise.all(calculateHeight(item)))
          };
        }
        return {
          ...item
        };
      }));
      Dispatch(updateCategoryPostData(categoryPostData.length > 0 ? [...categoryData?.updatedData, ...newData]:newData));
      setCategoryPostData((prevData) => [
        ...prevData,
        ...newData,
      ]);
    }
  }
  catch(e){
    console.log("e", e);
  }
  finally{
    setCategoryPostLoading(false);
  }
  };

  const onRefreshHandler = () => {
    setRefreshing(true);
    setRefreshHome(true);
    onFetchHomeHandler({ isLoadMore: false, isFirst: false ,lastCount: 0 });
  };

  const onPressPostReport = ({ id, from }) => {
    router.push({
      pathname: "/ReportProfileScreen",
      params: { id, from },
    });
  };

  return {
    onFetchHomeHandler,
    onPressPostReport,

    //trending post
    onFetchTrendingHandler,

    //Category posts
    onFetchCategoryHandler,
    categoryPostData,
    categoryPostLoading,
    onRefreshHandler,
    refreshing,
    setIsLoadingNewData,
    isLoadingNewData,
    updatePostData,
    updateOtherPostData,
    UpdatedeletePost,
    OnRefreshHandlerHome,
    updateOtherLikePostData,
    MyCommunities,
    AllGroupList,
  };
};

export default useHomeViewModel;
