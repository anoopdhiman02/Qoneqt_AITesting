import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../utils/Hooks";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { onSearchDataApi } from "../../redux/reducer/search/SearchDataApi";
import { useAppStore } from "@/zustand/zustandStore";
import { calculateHeight } from "@/utils/ImageHelper";

const useSearchViewModel = () => {
  const { userId } = useAppStore();
  const navigation = useNavigation();
  const Dispatch = useAppDispatch();

  const searchAllData = useAppSelector((state) => state.searchAllData);

  const [selectedCategory, setSelectedCategory] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastCount, setLastCount] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);

  // Data state
  const [hashtagsList, setHashtagsList] = useState([]);
  const [postsData, setPostsData] = useState([]);
  const [groupsData, setGroupsData] = useState([]);
  const [usersData, setUsersData] = useState([]);

  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const [totalGroupsCount, setTotalGroupsCount] = useState(0);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [totalHashtagsCount, setTotalHashtagsCount] = useState(0);
  const timeoutRef = useRef(null);

  // Add a ref to track if we're currently loading more data
  const isLoadingMore = useRef(false);

  useEffect(() => {
    // Clear timeout when component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [selectedCategory]);

  const onSearchInputHandler = ({ query }) => {
    setSearchQuery(query);
  };

  const onSearchData = (type) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(async () => {
      setSearchLoading(true);
      setLastCount(0);
      setPostsData([]);
      setGroupsData([]);
      setUsersData([]);
      setHashtagsList([]);

      var searchResults = await Dispatch(
        onSearchDataApi({
          user_id: userId,
          last_count: 0, // Reset to 0 for fresh search
          query: searchQuery.toLocaleLowerCase(),
          stype:
            type === 1
              ? "profiles"
              : type === 2
              ? "posts"
              : type === 3
              ? "groups"
              : "hashtags",
        })
      );

      setSearchLoading(false);

      if (searchResults?.payload?.success) {
        const data = searchResults?.payload?.data;

        if (type === 1) {
          setUsersData(data?.profiles || []);
        } else if (type === 2) {
          var newPostData = await Promise.all((data?.posts || []).map(async (item) => {
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
          setPostsData(newPostData);
        } else if (type === 3) {
          setGroupsData(data?.groups || []);
        } else {
          var newData = await Promise.all((data?.hashtags || []).map(async (item) => {
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
          setHashtagsList(newData);
        }

        setTotalPostsCount(data?.total_posts || 0);
        setTotalGroupsCount(data?.total_groups || 0);
        setTotalUsersCount(data?.total_profiles || 0);
        setTotalHashtagsCount(data?.total_hashtags || 0);
      }
    }, 300);
  };

  const onSearchHashData = (hash) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(async () => {
      setSearchLoading(true);
      setLastCount(0);
      setPostsData([]);
      setGroupsData([]);
      setUsersData([]);
      setHashtagsList([]);

      var searchResults = await Dispatch(
        onSearchDataApi({
          user_id: userId,
          last_count: 0, // Reset to 0 for fresh search
          query: hash.toLocaleLowerCase(),
          stype: "hashtags",
        })
      );

      setSearchLoading(false);

      if (searchResults?.payload?.success) {
        const data = searchResults?.payload?.data;
        var newHashtagData = await Promise.all((data?.hashtags || []).map(async (item) => {
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
        setHashtagsList(newHashtagData);
        setTotalHashtagsCount(data?.total_hashtags || 0);
        console.log("Initial hashtags loaded:", data?.hashtags?.length);
      }
    }, 300);
  };

  const onTapPress = async (type) => {
    const typeData =
      type === 1
        ? usersData
        : type === 2
        ? postsData
        : type === 3
        ? groupsData
        : hashtagsList;

    if (
      searchQuery == searchAllData?.search &&
      typeData.length == 0 &&
      searchQuery != ""
    ) {
      setSearchLoading(true);
      var searchResult = await Dispatch(
        onSearchDataApi({
          user_id: userId,
          last_count: lastCount,
          query: searchQuery.toLocaleLowerCase(),
          stype:
            type === 1
              ? "profiles"
              : type === 2
              ? "posts"
              : type === 3
              ? "groups"
              : "hashtags",
        })
      );
      setSearchLoading(false);
      setSearchData(searchResult?.payload?.data);
    } else {
      onSearchData(type);
    }
  };

  const onClearSearchHandler = () => {
    setSearchQuery("");
    setPostsData([]);
    setGroupsData([]);
    setUsersData([]);
    setHashtagsList([]);
    setTotalPostsCount(0);
    setTotalGroupsCount(0);
    setTotalUsersCount(0);
    setTotalHashtagsCount(0);
    setLastCount(0);
    setSearchLoading(false);
    isLoadingMore.current = false;
  };

  const onReachEndHandler = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isLoadingMore.current) {
      console.log("Already loading more data, skipping...");
      return;
    }

    const currentData =
      selectedCategory === 1
        ? usersData
        : selectedCategory === 2
        ? postsData
        : selectedCategory === 3
        ? groupsData
        : hashtagsList;

    const totalCount =
      selectedCategory === 1
        ? totalUsersCount
        : selectedCategory === 2
        ? totalPostsCount
        : selectedCategory === 3
        ? totalGroupsCount
        : totalHashtagsCount;

    const nextLastCount = currentData.length;

    console.log("onReachEndHandler - current data length:", nextLastCount);
    console.log("onReachEndHandler - total count:", totalCount);
    console.log("onReachEndHandler - search query:", searchQuery);
    console.log("onReachEndHandler - search loading:", searchLoading);

    if (!searchQuery || searchLoading) {
      console.log("Skipping: empty search or already loading");
      return;
    }

    if (nextLastCount === 0 || totalCount === nextLastCount) {
      console.log("Skipping: no data or all data loaded");
      return;
    }

    // Set loading flag to prevent multiple calls
    isLoadingMore.current = true;
    setSearchLoading(true);

    try {
      console.log("Loading more data with last_count:", nextLastCount);

      var newSearchData = await Dispatch(
        onSearchDataApi({
          user_id: userId,
          last_count: nextLastCount,
          query: searchQuery.toLocaleLowerCase(),
          stype:
            selectedCategory === 1
              ? "profiles"
              : selectedCategory === 2
              ? "posts"
              : selectedCategory === 3
              ? "groups"
              : "hashtags",
        })
      );

      if (newSearchData?.payload?.success) {
        const newData = newSearchData?.payload?.data;


        // Update the appropriate data array
        if (selectedCategory === 1 && newData?.profiles) {
          setUsersData((prevUsers) => {
            const updatedUsers = [...prevUsers, ...newData.profiles];
            console.log("Updated users count:", updatedUsers.length);
            return updatedUsers;
          });
          setTotalUsersCount(newData.total_profiles);
        } else if (selectedCategory === 2 && newData?.posts) {
          var newPostData = await Promise.all((newData?.posts || []).map(async (item) => {
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
          setPostsData((prevPosts) => {
            const updatedPosts = [...prevPosts, ...newPostData];
            return updatedPosts;
          });
          setTotalPostsCount(newData.total_posts);
        } else if (selectedCategory === 3 && newData?.groups) {
          setGroupsData((prevGroups) => {
            const updatedGroups = [...prevGroups, ...newData.groups];
            return updatedGroups;
          });
          setTotalGroupsCount(newData.total_groups);
        } else if (selectedCategory === 4 && newData?.hashtags) {
          var newHashtagData = await Promise.all((newData?.hashtags || []).map(async (item) => {
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
          setHashtagsList((prevHashtags) => {
            const updatedHashtags = [...prevHashtags, ...newHashtagData];
            return updatedHashtags;
          });
          setTotalHashtagsCount(newData.total_hashtags);
        }
      } else {
        console.log("API call failed or no success flag");
      }
    } catch (error) {
      console.error("Error in onReachEndHandler:", error);
    } finally {
      setSearchLoading(false);
      isLoadingMore.current = false;
    }
  }, [
    selectedCategory,
    usersData,
    postsData,
    groupsData,
    hashtagsList,
    totalUsersCount,
    totalPostsCount,
    totalGroupsCount,
    totalHashtagsCount,
    searchQuery,
    searchLoading,
    userId,
    Dispatch,
  ]);

  const setSearchData = async (data) => {
    var newPostData = await Promise.all((data?.posts || []).map(async (item) => {
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
    setPostsData(
      data?.posts
        ? data?.posts.length > 0
          ? newPostData
          : postsData
        : postsData
    );
    setGroupsData(
      data?.groups
        ? data?.groups.length > 0
          ? data?.groups
          : groupsData
        : groupsData
    );
    setUsersData(
      data?.profiles
        ? data?.profiles.length > 0
          ? data?.profiles
          : usersData
        : usersData
    );
    var newHashtagData = await Promise.all((data?.hashtags || []).map(async (item) => {
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
    setHashtagsList(
      data?.hashtags
        ? data?.hashtags.length > 0
          ? newHashtagData
          : hashtagsList
        : hashtagsList
    );
    setTotalPostsCount(
      selectedCategory === 2 ? data?.total_posts : totalPostsCount
    );
    setTotalGroupsCount(
      selectedCategory === 3 ? data?.total_groups : totalGroupsCount
    );
    setTotalUsersCount(
      selectedCategory === 1 ? data?.total_profiles : totalUsersCount
    );
    setTotalHashtagsCount(
      selectedCategory === 4 ? data?.total_hashtags : totalHashtagsCount
    );
  };

  const onPressHashtags = (props) => {
    // navigation?.navigate("SearchTabBar", { hashTag: props });
  };

  const onPressGoBack = () => {
    navigation?.goBack();
  };

  return {
    onSearchInputHandler,
    onClearSearchHandler,
    onReachEndHandler,
    searchQuery,
    hashtagsList,
    onPressHashtags,
    searchLoading,
    postsData,
    usersData,
    groupsData,
    onPressGoBack,
    selectedCategory,
    setSelectedCategory,
    onSearchData,
    onTapPress,
    setSearchQuery,
    onSearchHashData,
    totalHashtagsCount,
  };
};

export default useSearchViewModel;
