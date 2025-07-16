import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { globalColors } from "@/assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";
import {
  TravelIcon,
  SportsIcon,
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
  HealthcareIcon,
} from "@/assets/DarkIcon";

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

const CheckItemComponent = ({ id, label, checked, onPress, categoryName }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(id)}
      key={id}
      style={{
       ...styles.checkItemContainer,
       borderColor: checked
       ? globalColors.darkOrchidShade20
       : globalColors.neutral2,
       backgroundColor: checked 
       ? globalColors.darkOrchidShade80
       : globalColors.neutral1,
      }}
    >
      <Text
        style={{
          ...styles.checkItemText,
          color: checked ? globalColors.darkOrchidShade20 : globalColors.neutralWhite,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default CheckItemComponent;

const styles = StyleSheet.create({
    checkItemContainer: {
        backgroundColor: globalColors.neutral1,
        borderRadius: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 12,
        marginBottom: 12,
        marginRight: 12,
        flexShrink: 1,
    },
    iconContainer: {
        width: 20,
        height: 20,
    },
    checkItemText: {
        fontSize: 14,
          fontFamily: fontFamilies.semiBold,
          color: globalColors.neutral_white["200"],
    },
});
