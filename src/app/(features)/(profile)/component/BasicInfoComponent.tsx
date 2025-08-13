import React, { useState, useCallback } from "react";
import { View, Text } from "react-native";
import { globalColors } from "@/assets/GlobalColors";
import TextInputComponent from "@/components/element/TextInputComponent";
import Button1 from "@/components/buttons/Button1";
import useProfileViewModel from "../viewModel/ProfileViewModel";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { useScreenTracking } from "@/customHooks/useAnalytics";

// Memoized TextInput to avoid unnecessary re-renders
const MemoInput = React.memo(TextInputComponent);

interface BasicInfoProps {
  fName?: string|any;
  lName?: string|any;
  sName?: string|any;
  hline?: string|any;
}

const BasicInfoComponent = ({ fName = "", lName = "", sName = "", hline = "" }: BasicInfoProps) => {
  useScreenTracking("BasicInfoComponent");
  const { onUpdateBasicInfo, basicLoading } = useProfileViewModel();

  const [firstName, setFirstName] = useState(fName);
  const [lastName, setLastName] = useState(lName);
  const [socialName, setSocialName] = useState(sName === "undefined" ? "" : sName);
  const [headline, setHeadline] = useState(hline);

  const handleSave = useCallback(() => {
    if (!firstName || !headline) {
      showToast({
        type: "error",
        text1: `Please fill ${
          !firstName ? "your first name" : "your headline"
        }`,
      });
      return;
    }

    onUpdateBasicInfo({
      fname: firstName,
      lname: lastName,
      socail: socialName,
      headline,
    });
  }, [firstName, lastName, socialName, headline, onUpdateBasicInfo]);

  return (
    <View style={{
      width: "90%",
      alignSelf: "center",
    }}>
      <Text
        style={{
          fontSize: 20,
          lineHeight: 28,
          color: globalColors.neutralWhite,
          marginTop: "3%",
        }}
      >
        Basic info
      </Text>

      <MemoInput
        isRequired
        header="First name"
        value={firstName}
        placeHolder="Enter First name"
        onChangeText={setFirstName}
      />
      <MemoInput
        header="Last name"
        value={lastName}
        placeHolder="Enter Last name"
        onChangeText={setLastName}
      />
      <MemoInput
        header="Social Name"
        value={socialName}
        placeHolder="Enter Social name"
        onChangeText={setSocialName}
      />
      <MemoInput
        isRequired
        header="Headline"
        value={headline}
        placeHolder="Enter Headline"
        onChangeText={setHeadline}
      />

      <Button1
        isLoading={basicLoading}
        title="Save"
        onPress={handleSave}
      />
    </View>
  );
};

export default React.memo(BasicInfoComponent);
