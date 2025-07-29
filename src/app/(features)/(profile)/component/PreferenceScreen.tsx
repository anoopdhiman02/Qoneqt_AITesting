import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import {
  TravelIcon,
  SportsIcon,
  HealthcareIcon,
  TourismIcon,
  EntertainmentIcon,
  Web30Icon,
  NewsIcon,
  CryptoCurrencyIcon,
  BlockchainIcon,
  FitnessIcon,
  TechNewsIcon,
  HealthAndFoodIcon,
  CompanyIcon,
  PoliticsIcon,
  MusicIcon,
  LanguageIcon,
  JobIcon,
  GeneralIcon,
  StockIcon,
  BusinessIcon,
  TechnologyIcon,
  EducationIcons,
  CurrencyIcons,
  CityIcons,
} from "@/assets/DarkIcon";
import { useAppStore } from "@/zustand/zustandStore";
import { router } from "expo-router";
import GradientText from "@/components/element/GradientText";
import { onAddPreference } from "@/redux/reducer/Profile/AddPreference";
import { showToast } from "@/components/atom/ToastMessageComponent";
import ViewWrapper from "@/components/ViewWrapper";
import Button1 from "@/components/buttons/Button1";
import { useScreenTracking } from "@/customHooks/useAnalytics";
import categoryList from '@/RowData/categoryList.json';

const iconMapping = {
  travel: TravelIcon,
  healthcare: HealthcareIcon,
  sports: SportsIcon,
  tourism: TourismIcon,
  entertainment: EntertainmentIcon,
  web3: Web30Icon,
  news: NewsIcon,
  cryptocurrency: CryptoCurrencyIcon,
  blockchain: BlockchainIcon,
  fitness: FitnessIcon,
  technews: TechNewsIcon,
  healthandfood: HealthAndFoodIcon,
  company: CompanyIcon,
  politics: PoliticsIcon,
  music: MusicIcon,
  language: LanguageIcon,
  jobs: JobIcon,
  general: GeneralIcon,
  stocks: StockIcon,
  business: BusinessIcon,
  history: NewsIcon,
  country: CompanyIcon,
  science: PoliticsIcon,
  community: BlockchainIcon,
  technology: TechnologyIcon,
  education: EducationIcons,
  currency: CurrencyIcons,
  city: CityIcons,
};

// const getIconForCategory = (categoryName) => {
//   return iconMapping[categoryName.toLowerCase()] || EntertainmentIcon;
// };

const CheckItemComponent = ({ id, label, categoryName, checked, onPress }) => {
  // const IconComponent = getIconForCategory(categoryName);
  return (
    <TouchableOpacity
      onPress={() => onPress(id)}
      key={id}
      style={{
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
      }}
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
    </TouchableOpacity>
  );
};

const PreferenceScreen = ({ catIdData }) => {
  useScreenTracking("PreferenceScreen");
  const { userId } = useAppStore();
  const Dispatch = useAppDispatch();
  const preferenceListResponse = useAppSelector(
    (state) => state.preferenceListResponse
  );

  const addPreferenceResponse = useAppSelector(
    (state) => state.addPreferenceData
  );

  const [apiCalled, setApiCalled] = useState(false);
  const [loading, setLoading] = useState(false);
   const [categoryLists, setCategoryList] = useState(categoryList);
  const [isAnyOptionSelected, setIsAnyOptionSelected] = useState(false);
  const [error, setError] = useState("");
  const [shakeAnimation] = useState(new Animated.Value(0));

  //submit preference
  const [submitCalled, setSubmitCalled] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    // Initialize categoryList based on catIdData
    const updatedCategories = categoryLists.map((category) => ({
      ...category,
      isSelected: catIdData.includes(category.id), // Set selected based on catIdData
    }));
    setCategoryList(updatedCategories);
  }, [catIdData]); // Run this effect when catIdData changes

  const toggleCuisine = useCallback((id) => {
    setCategoryList((prevCategories) => {
      const newCategories = prevCategories.map((category) =>
        category.id === id
          ? { ...category, isSelected: !category.isSelected }
          : category
      );
      const anySelected = newCategories.some((category) => category.isSelected);
      setIsAnyOptionSelected(anySelected);
      if (anySelected) setError("");
      return newCategories;
    });
  }, []);


  //Submit Preference
  useEffect(() => {
    if (submitCalled && addPreferenceResponse?.success) {
      setSubmitCalled(false);
      setSubmitLoading(false);
      router.replace("/DashboardScreen");
      showToast({ type: "success", text1: addPreferenceResponse?.message });
    } else if (submitCalled && !addPreferenceResponse?.success) {
      setSubmitCalled(false);
      setSubmitLoading(false);
    }
  }, [addPreferenceResponse]);

  // useEffect(() => {
  //   onFetchListHandler();
  // }, []);

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

  const CategoriesList = () => {
    return (
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
    );
  };

  const Caption = () => {
    return (
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
          {/* We will customize your feed according to the preferences you've
          chosen. */}
          Based on your updated preferences, we will tailor your feed to better
          suit your interests.
        </Text>
      </View>
    );
  };

  const onSubmitFavCategory = () => {
    const selectedCategories = categoryLists.filter((item) => item.isSelected);
    if (selectedCategories.length >= 5) {
      Dispatch(
        onAddPreference({
          userId: userId,
          category: selectedCategories.map((item) => item.id),
        })
      );
      setSubmitCalled(true);
      setSubmitLoading(true);
    } else {
      const remaining = 5 - selectedCategories.length;
      setError(`Please select at least ${remaining} more ${remaining === 1 ? 'category' : 'categories'}.`);
      showToast({
        type: "error",
        text1: `Please select at least ${remaining} more ${remaining === 1 ? 'category' : 'categories'}.`,
      });
    }
  };


  return (
    <View
      style={{
        width: "95%",
        marginBottom: "35%",
        height: 600,
      }}
    >
      <Caption />

      <ScrollView>
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
          <CategoriesList />
        )}
      </ScrollView>
      <View
        style={{
          width: "100%",
        }}
      >
        <Button1
          isLoading={submitLoading}
          title="Save"
          onPress={onSubmitFavCategory}
        />
      </View>
    </View>
  );
};

export default PreferenceScreen;
