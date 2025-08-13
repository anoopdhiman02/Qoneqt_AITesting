import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import ViewWrapper from '@/components/ViewWrapper';
import GoBackNavigation from '@/components/Header/GoBackNavigation';
import { useScreenTracking } from '@/customHooks/useAnalytics';

const AboutUs = () => {
  useScreenTracking("AboutUs");
  return (
    <ViewWrapper>
      <GoBackNavigation isDeepLink={true} header="About Us" />
      <View style={{ alignContent: "center", marginTop: "4%" }}>
        <Image
          style={{
            borderRadius: 8,
            width: 350,
            height: 685,
            alignSelf: "center",
          }}
          contentFit="cover"
          source={require("@/assets/image/About.jpg")}
        />
      </View>
    </ViewWrapper>
  );
}

export default AboutUs