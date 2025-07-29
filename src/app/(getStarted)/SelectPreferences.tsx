import React, { useCallback, useState } from "react";
import {
  ScrollView,
  View,
  Animated,
  StyleSheet,
} from "react-native";
import ViewWrapper from "../../components/ViewWrapper";
import Button1 from "../../components/buttons/Button1";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { useAppDispatch } from "@/utils/Hooks";
import { useAppStore } from "@/zustand/zustandStore";
import { router, useLocalSearchParams } from "expo-router";
import { onAddPreference } from "@/redux/reducer/Profile/AddPreference";
import { showToast } from "@/components/atom/ToastMessageComponent";
import categoryList from "@/RowData/categoryList.json";
import Caption from "@/components/SelectPreferencesComponents/Caption";
import CategoriesList from "@/components/SelectPreferencesComponents/CategoriesList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logEvent, useScreenTracking } from "@/customHooks/useAnalytics";

const SelectPreferences = () => {
  useScreenTracking("SelectPreferences");
  const { userId } = useAppStore();
  const { user_id } = useLocalSearchParams();
  const dispatch = useAppDispatch()
  const [categoryData, setCategoryData] = useState(categoryList);
  const [error, setError] = useState("");
  const [shakeAnimation] = useState(new Animated.Value(0));
  //submit preference
  const [submitLoading, setSubmitLoading] = useState(false);

  const toggleCuisine = useCallback((id) => {
    setCategoryData((prevCategories) => {
      const newCategories = prevCategories.map((category) =>
        category.id === id
          ? { ...category, isSelected: !category.isSelected }
          : category
      );
      const anySelected = newCategories.some((category) => category.isSelected);
      if (anySelected) setError("");
      return newCategories;
    });
  }, []);

  const shakeError = () => {
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
  };

  const onSubmitFavCategory = async () => {
    try {
    const selectedCategories = categoryData.filter((item: any) => item.isSelected);
    if (selectedCategories.length >= 5) {
      setSubmitLoading(true);
     var response = await dispatch(
        onAddPreference({
          userId: user_id ||userId,
          category: selectedCategories.map((item) => item.id),
        })
      );
      logEvent("submit_preference", {
        category: selectedCategories.map((item) => item.id),
      });      
      setSubmitLoading(false);
      if(response?.payload?.success){
       await AsyncStorage.setItem("isNewUser", "true");
        router.replace("/DashboardScreen");
      }
      else{
        showToast({ type: "error", text1: response?.payload?.message });
      }
    } else {
      setSubmitLoading(false);
      const remaining = 5 - selectedCategories.length;
setError(`Please select at least ${remaining} more ${remaining === 1 ? 'category' : 'categories'}.`);
      shakeError();
    }
    } catch (error) {
      setSubmitLoading(false);
      showToast({ type: "error", text1: error?.message });
    }
  };


  return (
    <ViewWrapper>
      <Caption />
      <View
        style={styles.mainContainer}
      >
        {error !== "" && (
          <Animated.Text
            style={{
              ...styles.errorText,
              transform: [{ translateX: shakeAnimation }],
            }}
          >
            {error}
          </Animated.Text>
        )}
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
        >
            <CategoriesList categoryData={categoryData} toggleCuisine={toggleCuisine} />
        </ScrollView>
        <Button1
          title="Continue"
          onPress={onSubmitFavCategory}
          isLoading={submitLoading}
          containerStyle={styles.buttonContainer}
        />
      </View>
    </ViewWrapper>
  );
};

const styles = StyleSheet.create({
  // Main Container
  mainContainer: {
    width: "98%",
    marginBottom: "65%",
  },
  // Error Styles 
  errorText: {
    color: globalColors.warning,
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    marginTop: "1%",
    left: "2%",     
  },
  scrollViewContainer: {
    paddingBottom: "10%",
    paddingHorizontal: "2%",
    width: "100%",
  },
  buttonContainer: {
    width: "90%",
    marginHorizontal: "5%",
  },
});

export default SelectPreferences;
