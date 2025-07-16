import { View, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { onFetchChannelGroupInfo } from "@/redux/reducer/channel/ChannelGroupInfo";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { useAppStore } from "@/zustand/zustandStore";
import { onDeleteCategory } from "@/redux/reducer/channel/DeleteCategory";
import { onFetchChannelCategoryList } from "@/redux/reducer/channel/ChannelCategoryList";
import BottomSheet from "@gorhom/bottom-sheet";
import useCreateCategoryViewModel from "@/structure/viewModels/channel/CreateCategoryViewModel";
import { useChannelStore } from "@/zustand/channelStore";
import { onEditCategoryName } from "@/redux/reducer/channel/EditCategoryName";
import { router } from "expo-router";

const useChannelGroupInfoViewModel = () => {
  const { userId } = useAppStore(); // Add this line

  const dispatch = useAppDispatch();
  const {
    onEnterCategoryHandler,
    categoryName,
    categorySubmitLoading,
    onCreateCategoryHandler,
  } = useCreateCategoryViewModel();

  const {
    setGroupId,
    setGroupDetails,
    setUserGroupRole,
    setChannelId,
    setChannelDetails,
    groupId,
    groupDetails,
    userGroupRole,
    channelId,
    channelDetails,
  } = useChannelStore();
  const { setCategoryId, setCategoryDetails } = useChannelStore();

  const channelGroupInfoResponse = useAppSelector(
    (state) => state.channelGroupInfoResponse
  );
  const deleteCategoryResponse = useAppSelector(
    (state) => state.deleteCategoryResponse
  );
  //Category list edit
  const channelCategoryListResponse = useAppSelector(
    (state) => state.channelCategoryListResponse
  );

  //submit edit category
  const editCategoryNameResponse = useAppSelector(
    (state) => state.editCategoryNameResponse
  );

  //bvottomsheet ref
  const CategoryOptionRef = useRef<BottomSheet>(null);
  const EditCategoryRef = useRef<BottomSheet>(null);
  const addNewCatNameRef = useRef<BottomSheet>(null);
  const DeleteCategoryRef = useRef<BottomSheet>(null);
  const MoreRef = useRef<BottomSheet>(null);

  //Group info api
  const [apiCalled, setApiCalled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState({});
  ///channel category
  const [categoryCalled, setCategoryCalled] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [selectCat, setSelectCat] = useState({
    category: "",
    id: 0,
  }); // Initialize with null

  //Edit Category api
  const [editCatCalled, setEditCatCalled] = useState(false);
  const [editCatLaoding, setEditCatLoading] = useState(false);

  //Channel Module state
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showChannelOption, setShowChannelOption] = useState(false);
  //role
  const [userGroupRoleState, setUserGroupRoleState] = useState(0);

  //Category Option
  const onPressCategoryOption = ({ catData }) => {
    setCategoryId(catData?.catId);
    setCategoryDetails(catData);
    CategoryOptionRef?.current?.expand();
  };

  const onPressEditCategory = () => {
    EditCategoryRef?.current?.expand();
    onFetchCategory({ groupId: groupId });
    // CategoryOptionRef?.current?.close();
  };

  //Submit edit categoty api
  useEffect(() => {
    if (editCatCalled && editCategoryNameResponse?.success) {
      showToast({ type: "success", text1: editCategoryNameResponse?.message });
      onFetchGroupInfoHandler({ groupId: groupId });
      setEditCatCalled(false);
      setEditCatLoading(false);
    } else if (categoryCalled && !editCategoryNameResponse?.success) {
      showToast({
        type: "error",
        text1: editCategoryNameResponse?.message || "something went wrong",
      });
      setEditCatCalled(false);
      setEditCatLoading(false);
    }
  }, [editCategoryNameResponse]);

  const onSubmitEditCategoryName = ({ categoryId, categoryName }) => {
    dispatch(
      onEditCategoryName({
        userId: userId,
        groupId: groupId,
        categoryId: categoryId,
        categoryName: categoryName,
      })
    );
    setEditCatCalled(true);
    setEditCatLoading(true);
  };

  ///Group detail api handling
  useEffect(() => {
    const fetchData = async () => {
      if (apiCalled && channelGroupInfoResponse?.success) {
        // console.log(
        //   "=========channelGroupInfoResponse===========================",
        //   channelGroupInfoResponse?.data?.my_role[0]?.role
        // );
        setGroupData(channelGroupInfoResponse?.data);

        setUserGroupRoleState(channelGroupInfoResponse?.data?.my_role[0]?.role);

        setGroupId(channelGroupInfoResponse?.data?.id);
        setGroupDetails({
          id: channelGroupInfoResponse?.data?.id,
          loop_cat: channelGroupInfoResponse?.data?.loop_cat,
          loop_name: channelGroupInfoResponse?.data?.loop_name,
          unique_id: channelGroupInfoResponse?.data?.unique_id,
          loop_logo: channelGroupInfoResponse?.data?.loop_logo,
          slug: channelGroupInfoResponse?.data?.slug,
          user_id: channelGroupInfoResponse?.data?.user_id,
          role: channelGroupInfoResponse?.data?.my_role[0]?.role,
        });
        setUserGroupRole(channelGroupInfoResponse?.data?.my_role[0]?.role);

        setApiCalled(false);
        setLoading(false);
      } else if (apiCalled && !channelGroupInfoResponse?.success) {
        setApiCalled(false);
        setLoading(false);
      }
    };

    fetchData();
  }, [channelGroupInfoResponse]);
  const onFetchGroupInfoHandler = ({ groupId }) => {
    dispatch(onFetchChannelGroupInfo({ userId: userId, groupId: groupId }));
    setApiCalled(true);
    setLoading(true);
  };

  const onSelectCategory = (data: any) => {
    setSelectCat({ category: data?.category, id: data?.id });
  };

  useEffect(() => {
    if (categoryCalled && channelCategoryListResponse?.success) {
      setCategoryCalled(true);
      setCategoryLoading(true);
      setCategoryList(
        channelCategoryListResponse?.data?.qoneqtdb_loop_group[0]
          ?.channel_categories
      );
    } else if (categoryCalled && !channelCategoryListResponse?.data?.success) {
      setCategoryCalled(true);
      setCategoryLoading(true);
    }
  }, [channelCategoryListResponse]);

  const onFetchCategory = (groupId) => {
    dispatch(
      onFetchChannelCategoryList({
        userId: userId,
        groupId: groupId,
      })
    );
    setCategoryCalled(true);
    setCategoryLoading(true);
    // });
  };

  const onPressAddNewCategory = () => {
    addNewCatNameRef.current?.expand();
  };

  //Delete Category
  const [deleteCategory, setDeleteCategory] = useState(false);
  const [deleteCatLoading, setDeleteCatLoading] = useState(false);

  const onDeleteCategoryOption = () => {
    DeleteCategoryRef.current.expand();
  };

  useEffect(() => {
    if (deleteCategory && deleteCategoryResponse.success) {
      onFetchGroupInfoHandler({ groupId: groupId });
      setDeleteCatLoading(false);
      setDeleteCategory(false);

      DeleteCategoryRef.current.close();
      CategoryOptionRef?.current?.close();
      showToast({ text1: deleteCategoryResponse.message, type: "success" });
    } else if (deleteCategory && !deleteCategoryResponse.success) {
      setDeleteCatLoading(false);
      setDeleteCategory(false);
      DeleteCategoryRef.current.close();
      CategoryOptionRef?.current?.close();
      showToast({ text1: deleteCategoryResponse.message, type: "error" });
    }
  }, [deleteCategoryResponse.success]);

  //channel module
  const onPressChannelHandler = ({ channelItem }) => {};

  const onPressLongChannelHandler = ({ channelItem }) => {
    setChannelId(channelItem?.channelId);
    setChannelDetails(channelItem);
    setSelectedChannel(channelItem?.channelId);
    setShowChannelOption(!showChannelOption);
  };

  const onPressChannelInfoHandler = () => {
    router.push({
      pathname: "/channel/[id]",
      params: { id: channelId, isDeepLink: "false" },
    });
  };

  const onSubmitDeleteCategory = ({ categoryId }) => {
    dispatch(
      onDeleteCategory({
        category_id: categoryId,
        fromApp: 1,
        group_id: groupId as any,
        user_id: userId,
      })
    );
    setDeleteCatLoading(true);
    setDeleteCategory(true);
  };
  return {
    onFetchGroupInfoHandler,
    loading,
    groupData,

    onDeleteCategoryOption,
    onSubmitDeleteCategory,
    deleteCatLoading,

    //category list
    onPressCategoryOption,
    onPressEditCategory,
    onSubmitEditCategoryName,
    CategoryOptionRef,
    EditCategoryRef,
    DeleteCategoryRef,
    onFetchCategory,
    categoryList,
    selectCat,
    onSelectCategory,
    categoryLoading,
    onPressAddNewCategory,
    addNewCatNameRef,
    onEnterCategoryHandler,
    categoryName,
    categorySubmitLoading,
    onCreateCategoryHandler,

    //Channel module
    onPressChannelHandler,
    onPressLongChannelHandler,
    selectedChannel,
    showChannelOption,
    onPressChannelInfoHandler,
    MoreRef,

    //role
    userGroupRoleState,
  };
};

export default useChannelGroupInfoViewModel;
