import * as React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import ViewWrapper from "../../../../components/ViewWrapper";
import TextInputComponent from "../../../../components/element/TextInputComponent";
import { router, useLocalSearchParams } from "expo-router";
import GoBackNavigation from "../../../../components/Header/GoBackNavigation";
import { useState } from "react";
import GradientText from "@/components/element/GradientText";
import Button1 from "@/components/buttons/Button1";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import useProfileViewModel from "../viewModel/ProfileViewModel";
import { useAppSelector } from "@/utils/Hooks";

const ContactInfoScreen = () => {
  const params = useLocalSearchParams();

  const { onUpdateContactInfo, contactLoading } = useProfileViewModel();
  const profileDetailResponse: any = useAppSelector((state) => state.myProfileData);
  
    const profileDetails = React.useMemo(() => {
      if (profileDetailResponse?.data.id) {
        return profileDetailResponse.data;
      }
      return null;
    }, [profileDetailResponse]);

  React.useEffect(() => {
    if (profileDetails) {
      setWebsite(profileDetails.website);
      setCountry(profileDetails.country);
      setCity(profileDetails.city);
    }
  }, [profileDetails, profileDetailResponse]);
  const [website, setWebsite] = useState(params?.website);
  const [country, setCountry] = useState(params?.country);
  const [city, setCity] = useState(params?.city);

  return (
    <ViewWrapper>
      <View style={{ width: "90%" }}>
        {/* Header */}
        <GoBackNavigation header="Contact info" isDeepLink={true} />

        {/* Scroll View for Content */}
        <ScrollView>
          <View>
            <Text
              style={{
                fontSize: 20,
                lineHeight: 28,
                color: globalColors.neutral7,
                marginTop: "5%",
              }}
            >
              Contact info
            </Text>
            <TextInputComponent
              header="Website"
              value={website}
              onChangeText={(text) => setWebsite(text)}
            />
            <TextInputComponent
              header="Country"
              value={country}
              onChangeText={(text) => setCountry(text)}
            />
            <TextInputComponent
              header="City"
              value={city}
              onChangeText={(text) => setCity(text)}
            />
          </View>
          <View style={{ alignItems: "center", marginBottom: "20%" }}>
            <Button1
              title="Save"
              isLoading={contactLoading}
              onPress={() =>
                onUpdateContactInfo({
                  city: city,
                  country: country,
                  website: website,
                })
              }
            />

            <TouchableOpacity
              style={{ marginTop: 20 }}
              onPress={() => router.back()}
            >
              <GradientText
                style={{
                  fontFamily: fontFamilies.bold,
                  fontSize: 17,
                  color: globalColors.darkOrchid,
                }}
              >
                Cancel
              </GradientText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ViewWrapper>
  );
};

export default ContactInfoScreen;
