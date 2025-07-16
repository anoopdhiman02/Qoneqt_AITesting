import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../utils/Hooks";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { onSearchDataApi } from "../../redux/reducer/search/SearchDataApi";
import { useAppStore } from "@/zustand/zustandStore";

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
      clearTimeout(timeoutRef.current); // Clear any existing timeout before setting a new one
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
      if (searchResults?.payload?.success) {
        if (type === 1) {
          setUsersData(searchResults?.payload?.data?.profiles);
        } else if (type === 2) {
          setPostsData(searchResults?.payload?.data?.posts);
        } else if (type === 3) {
          setGroupsData(searchResults?.payload?.data?.groups);
        } else {
          setHashtagsList(searchResults?.payload?.data?.hashtags);
        }

        setTotalPostsCount(searchResults?.payload?.data?.total_posts);
        setTotalGroupsCount(searchResults?.payload?.data?.total_groups);
        setTotalUsersCount(searchResults?.payload?.data?.total_profiles);
        setTotalHashtagsCount(searchResults?.payload?.data?.total_hashtags);
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
    if (searchQuery == searchAllData?.search && typeData.length == 0 && searchQuery != '') {
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
  };

  const onReachEndHandler = async () => {
    const nextLastCount =
      selectedCategory === 1
        ? usersData.length
        : selectedCategory === 2
        ? postsData.length
        : selectedCategory === 3
        ? groupsData.length
        : hashtagsList.length;
    const tot =
      selectedCategory === 1
        ? totalUsersCount
        : selectedCategory === 2
        ? totalPostsCount
        : selectedCategory === 3
        ? totalGroupsCount
        : totalHashtagsCount;
    if (!searchQuery || searchLoading) {
      return; // Don't load more if the search query is cleared or loading
    }

    if (nextLastCount !== 0 && tot !== nextLastCount) {
      setSearchLoading(true);
      var newSearchData = await Dispatch(
        onSearchDataApi({
          user_id: userId,
          last_count: nextLastCount,
          query: searchQuery,
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
      setSearchLoading(false);
      if (newSearchData?.payload?.success) {
        if (selectedCategory === 1) {
          setUsersData([
            ...usersData,
            ...newSearchData?.payload?.data?.profiles,
          ]);
          setTotalUsersCount(newSearchData?.payload?.data.total_profiles);
        } else if (selectedCategory === 2) {
          setPostsData([...postsData, ...newSearchData?.payload?.data?.posts]);
          setTotalPostsCount(newSearchData?.payload?.data.total_posts);
        } else if (selectedCategory === 3) {
          setGroupsData([
            ...groupsData,
            ...newSearchData?.payload?.data?.groups,
          ]);
          setTotalGroupsCount(newSearchData?.payload?.data.total_groups);
        } else {
          setHashtagsList([
            ...hashtagsList,
            ...newSearchData?.payload?.data?.hashtags,
          ]);
          setTotalHashtagsCount(newSearchData?.payload?.data.total_hashtags);
        }
      }
    }
  };

  const setSearchData = (data) => {
    setPostsData(
      data?.posts
        ? data?.posts.length > 0
          ? data?.posts
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
    setHashtagsList(
      data?.hashtags
        ? data?.hashtags.length > 0
          ? data?.hashtags
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
  };
};

export default useSearchViewModel;
