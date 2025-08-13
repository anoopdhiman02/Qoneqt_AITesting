import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Animated,
  FlatList,
} from "react-native";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import {
  CheckCircleIcon,
} from "@/assets/DarkIcon";
import { useAppStore } from "@/zustand/zustandStore";
import { router } from "expo-router";
import { onAddPreference } from "@/redux/reducer/Profile/AddPreference";
import { showToast } from "@/components/atom/ToastMessageComponent";
import Button1 from "@/components/buttons/Button1";
import { useScreenTracking } from "@/customHooks/useAnalytics";
import categoryList from '@/RowData/categoryList.json';
import { Dimensions } from "react-native";

const { height } = Dimensions.get("window");


const CheckItemComponent = React.memo(({ id, label, checked, onPress }: any) => {
  const handlePress = useCallback(() => {
    onPress(id);
  }, [id, onPress]);

  // Memoize styles to prevent recreation
  const containerStyle = useMemo(() => ({
    backgroundColor: globalColors.neutral1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: checked
      ? globalColors.darkOrchidShade20
      : globalColors.neutral2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 12,
    marginBottom: 12,
    marginRight: 12,
    flexShrink: 1,
  }), [checked]);

  const checkIconStyle = useMemo(() => ({
    position: "absolute",
    right: -10,
    top: -10
  }), []);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={containerStyle}
      activeOpacity={0.7}
    >
      <Text
        style={{
          fontSize: 14,
          fontFamily: fontFamilies.regular,
          color: globalColors.neutral_white["200"],
        }}
      >
        {label}
      </Text>
      {checked && (
        <View style={checkIconStyle}>
          <CheckCircleIcon />
        </View>
      )}
    </TouchableOpacity>
  );
});

CheckItemComponent.displayName = 'CheckItemComponent';

const Caption = React.memo(() => (
  <View
    style={{
      paddingLeft: "2%",
      width: "95%",
    }}
  >
    <Text
      style={{
        fontSize: 22,
        fontFamily: fontFamilies.semiBold,
        color: globalColors.neutral_white["100"],
      }}
    >
      Update categories of your preferences.
    </Text>
    <Text
      style={{
        fontSize: 14,
        fontFamily: fontFamilies.regular,
        color: globalColors.neutral_white["200"],
        marginTop: 10,
      }}
    >
      Based on your updated preferences, we will tailor your feed to better
      suit your interests.
    </Text>
  </View>
));

Caption.displayName = 'Caption';

const PreferenceScreen = ({ catIdData }) => {
  useScreenTracking("PreferenceScreen");
  const { userId } = useAppStore();
  const dispatch = useAppDispatch();
  const addPreferenceResponse = useAppSelector(
    (state) => state.addPreferenceData
  );
  const initialCategories = useMemo(() => {
    return categoryList.map((category) => ({
      ...category,
      isSelected: catIdData.includes(category.id),
    }));
  }, [catIdData]);

const [categoryLists, setCategoryList] = useState(initialCategories);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitCalled, setSubmitCalled] = useState(false);
  const [shakeAnimation] = useState(() => new Animated.Value(0));

  const selectedCount = useMemo(() => {
    return categoryLists.filter(item => item.isSelected).length;
  }, [categoryLists]);

  const isValidSelection = selectedCount >= 5;
  const remainingSelections = Math.max(0, 5 - selectedCount);

  const toggleCuisine = useCallback((id) => {
    setCategoryList((prevCategories) => {
      return prevCategories.map((category) =>
        category.id === id
          ? { ...category, isSelected: !category.isSelected }
          : category
      );
    });
  }, []);

  useEffect(() => {
    if (submitCalled && addPreferenceResponse?.success) {
      setSubmitCalled(false);
      setSubmitLoading(false);
      router.replace("/DashboardScreen");
      showToast({ type: "success", text1: addPreferenceResponse?.message });
    } else if (submitCalled && addPreferenceResponse && !addPreferenceResponse?.success) {
      setSubmitCalled(false);
      setSubmitLoading(false);
    }
  }, [addPreferenceResponse, submitCalled]);

  // Optimized shake animation
  const shakeError = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shakeAnimation]);

  // Optimized submit handler
  const onSubmitFavCategory = useCallback(() => {
    if (isValidSelection) {
      const selectedCategories = categoryLists
        .filter((item) => item.isSelected)
        .map((item) => item.id);
      
      dispatch(
        onAddPreference({
          userId: userId,
          category: selectedCategories,
        })
      );
      setSubmitCalled(true);
      setSubmitLoading(true);
    } else {
      const message = `Please select at least ${remainingSelections} more ${remainingSelections === 1 ? 'category' : 'categories'}.`;
      showToast({
        type: "error",
        text1: message,
      });
      shakeError();
    }
  }, [isValidSelection, categoryLists, dispatch, userId, remainingSelections, shakeError]);

  // Render item for FlatList (more performant than map)
  const renderCategoryItem = useCallback(({ item }) => (
    <CheckItemComponent
      key={item.id}
      id={item.id}
      label={item.category_name}
      categoryName={item.category_name}
      checked={item.isSelected}
      onPress={toggleCuisine}
    />
  ), [toggleCuisine]);

  // Key extractor for FlatList
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // Memoized categories list component
  const CategoriesList = useMemo(() => (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        marginTop: 20,
      }}
    >
      {categoryLists.map((item) => (
        <CheckItemComponent
          key={item.id}
          id={item.id}
          label={item.category_name}
          categoryName={item.category_name}
          checked={item.isSelected}
          onPress={toggleCuisine}
        />
      ))}
    </View>
  ), [categoryLists, toggleCuisine]);



  return (
    <View style={{ width: "100%", marginBottom: "35%", height: height * 0.68 }}>
      <Caption />

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontFamily: fontFamilies.semiBold,
            }}
          >
            Loading...
          </Text>
        ) : (
          CategoriesList
        )}
        <View style={{ width: "100%", marginTop: 20 }}>
        <Button1
          isLoading={submitLoading}
          title="Save"
          onPress={onSubmitFavCategory}
        />
      </View>
      </ScrollView>
      
      
    </View>
  );
};

export default React.memo(PreferenceScreen);