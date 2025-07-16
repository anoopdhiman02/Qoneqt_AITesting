
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
import { useSelector } from "react-redux";
import { setPrefsValue, getPrefsValue } from "@/utils/storage";

const useHomeViewModel = () => {
  const Dispatch = useAppDispatch();
  const userId = useAppStore((state) => state.userId);
  const id = useIdStore((state) => state.id);
  const setRefreshHome = useAppStore((state) => state.setRefreshHome);
const refreshHome = useAppStore((state) => state.refreshHome);
  const HomePostResponse = useAppSelector((state) => state.HomePostResponse);
  const { setMyFeedsData } = useMyPostsViewModel();
  const { setPostData } = usePostDetailViewModel();
  const myFeedsListData = useAppSelector((state) => state.myFeedsListData);
  const postDetailData: any = useAppSelector((state) => state.postDetailData);
  const myFeedData = useAppSelector((state) => state.myFeedData);

  const trendingPostResponse = useAppSelector(
    (state) => state.TrendingPostResponse
  );

  const CategoryData = useSelector((state: any) => state.CategoryPostResponse);

  // Category Post data
  const [categoryPostData, setCategoryPostData] = useState([]);
  const [categoryPostCalled, setCategoryPostCalled] = useState(false);
  const [categoryPostLoading, setCategoryPostLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


  const [isLoadingNewData, setIsLoadingNewData] = useState(false);
  const updatePostData = (postID, PostData) => {
    const updatedPosts = PostData?.map((item) => {
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

  const updateDeletePosts = (posts: any, postID: any, count: any) => {
    return (Array.isArray(posts)? posts : [...posts])?.map((item: any) => {
      if (item.id === postID) {
        return {
          ...item,
          comment_count: (item?.comment_count || 0) - count,
        };
      }
      return item;
    });
  };
  const UpdatedeletePost = (postID, count) => {
   var homeLocalPostData = getPrefsValue("homePostData");
    const updatedHomePosts = updateDeletePosts(HomePostResponse?.UpdatedData, postID,count);
    const updatedTrendingPosts = updateDeletePosts(trendingPostResponse?.data, postID,count);
    const updatedMyFeedList = updateDeletePosts(myFeedsListData.updatedData, postID,count);
    const updatedPostsDetials = updateDeletePosts(postDetailData?.data, postID,count);
    const updatedMyFeedPosts = updateDeletePosts(myFeedData?.updatedData, postID,count);
    const updatedLocalPostData = updateDeletePosts(JSON.parse(homeLocalPostData || "[]"), postID,count);
  
    // Dispatch actions in parallel using Promise.all
    Promise.all([
      Dispatch(setHomePostSlice(updatedHomePosts)),
      Dispatch(trendingUserPost(updatedTrendingPosts)),
      Dispatch(setUserFeedData(updatedMyFeedList)),
      Dispatch(updateCount(updatedPostsDetials)),
      Dispatch(setMyUserFeedData(updatedMyFeedPosts)),
      setPrefsValue("homePostData", JSON.stringify(updatedLocalPostData))
    ]);
  };

  const updatePosts = (posts, postID, count) => {
    return posts?.map((item) => {
      if (item.id === postID) {
        return {
          ...item,
          comment_count: (item?.comment_count || 0) + count,
        };
      }
      return item;
    });
  };

  const updateOtherPostData = (postID) => {
    var homeLocalPostData = getPrefsValue("homePostData");
    const updatedHomePosts = updatePosts(HomePostResponse?.UpdatedData, postID,1);
    const updatedTrendingPosts = updatePosts(trendingPostResponse?.data, postID,1);
    const updatedLocalPostData = updatePosts(JSON.parse(homeLocalPostData || "[]"), postID,1);
    

  
    // Dispatch actions in parallel using Promise.all
    Promise.all([
      Dispatch(setHomePostSlice(updatedHomePosts)),
      Dispatch(trendingUserPost(updatedTrendingPosts)),
      setPrefsValue("homePostData", JSON.stringify(updatedLocalPostData))
    ]);
    
  };

  const updateLikePosts = (posts, postID, count) => {
    return (Array.isArray(posts)? posts : [...posts])?.map((item) => {
      if (item.id === postID) {
        return {
          ...item,
          like_byme: count == 1 ? [
            {
              "id": 53307,
              "reaction": 1
            }
          ] : [],
          like_byMe: count == 1 ? [
            {
              "id": 53307,
              "reaction": 1
            }
          ] : [],
          like_count: (item.like_count || 0) + count,
        };
      }
      return item;
    });
  };
  const updateOtherLikePostData = (postID,count) => {
    var homeLocalPostData = getPrefsValue("homePostData");
    const updatedHomePosts = updateLikePosts(HomePostResponse?.UpdatedData, postID,count);
    const updatedTrendingPosts = updateLikePosts(trendingPostResponse?.data, postID,count);
    const updatedPostData = postDetailData?.newData?.id ? updateLikePosts(postDetailData?.newData ? [...postDetailData?.newData]: [], postID,count): [];
    const updatedLocalPostData = updateLikePosts(JSON.parse(homeLocalPostData || "[]"), postID,count);
    const updatedMyFeedList = updateLikePosts(myFeedsListData.updatedData, postID,count);
    const updatedMyFeedPosts = updateLikePosts(myFeedData?.updatedData, postID,count);
  
    Promise.all([
      Dispatch(setHomePostSlice(updatedHomePosts)),
      Dispatch(trendingUserPost(updatedTrendingPosts)),
      Dispatch(upgradePostData(updatedPostData.length > 0 ? updatedPostData[0] : {})),
      Dispatch(setUserFeedData(updatedMyFeedList)),
      Dispatch(setMyUserFeedData(updatedMyFeedPosts)),
      setPrefsValue("homePostData", JSON.stringify(updatedLocalPostData))
    ]);
    
  };

  const onFetchHomeHandler = useCallback(async ({ isLoadMore, isFirst, lastCount, isCheck }: any) => {
    if(userId){
    if(isLoadMore){
      // @ts-ignore
      Dispatch(onFetchHomeNextPost({
        userId: userId,
        lastCount: lastCount,
        limit_count: 100
      }));

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
        Dispatch(setHomePostSlice(newPostData?.payload?.data || []));
        setPrefsValue("homePostData", JSON.stringify(newPostData?.payload?.data || []));
        
      }
    }
    }
  }, [HomePostResponse.UpdatedData]);

  const OnRefreshHandlerHome = () => {
    if(userId){
    onFetchHomeHandler({isLoadMore:false,isFirst:false,lastCount:0,isCheck:false});
    // @ts-ignore
    Dispatch(onFetchHomeNextPost({
      userId: userId,
      lastCount: 10,
      limit_count:100
    }));
      }
    }
  

  const onFetchTrendingHandler = () => {
    Dispatch(
      onFetchTrendingPost({
        userId: userId,
        lastCount: 0,
      })
    );
  };

  // Here                   CATEGORY DATA
  useEffect(() => {
    if (categoryPostCalled && CategoryData?.success) {
      setCategoryPostData((prevData) => [
        ...prevData,
        ...CategoryData?.data,
      ]);
      setCategoryPostCalled(false);
      setCategoryPostLoading(false);
      setRefreshHome(false);
    } else if (categoryPostCalled && !CategoryData?.success) {
      setCategoryPostCalled(false);
      setCategoryPostLoading(false);
    }
  }, [CategoryData]);

  const onFetchCategoryHandler = ({ catId }) => {
    Dispatch(
      onFetchCategoryPost({
        userId: userId,
        catId: catId,
        lastCount: categoryPostData.length,
      })
    );
    setCategoryPostCalled(true);
    setCategoryPostLoading(true);
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
    updateOtherLikePostData
  };
};

export default useHomeViewModel;
