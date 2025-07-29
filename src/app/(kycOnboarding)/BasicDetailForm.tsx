import { memo, useEffect, useMemo, useState } from "react";
import { Image } from "expo-image";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button1 from "../../components/buttons/Button1";
import TextInputComponent from "../../components/element/TextInputComponent";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { InfoIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { showToast } from "@/components/atom/ToastMessageComponent";
import {
  getFirstNameLocal,
  getLastNameLocal,
  getLoggedMobile,
} from "@/localDB/LocalStroage";
import MobileInput from "@/components/element/MobileInput";
import { CountryPicker } from "react-native-country-codes-picker";
import { useDispatch } from "react-redux";
import { kycBasicDetails } from "@/redux/reducer/kyc/kycDetails";
import { useAppStore } from "@/zustand/zustandStore";
import { useAppSelector } from "@/utils/Hooks";
import { router } from "expo-router";
import {
  clearAllValues,
  setKycLoading,
} from "@/redux/slice/kyc/kycDetailsSlice";
import { genderData } from "@/utils/defaultDb";
import { useScreenTracking } from "@/customHooks/useAnalytics";
import { updateProfileData } from "@/redux/slice/profile/ProfileMyDetailsSlice";

interface BasicDetailFormProps {
  fName?: any;
  lName?: any;
  email?: any;
  type?: number;
}

const BasicDetailForm = ({
  fName,
  lName,
  email,
  type,
}: BasicDetailFormProps) => {
  useScreenTracking("BasicDetailForm");
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [contact, setContact] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Male");
  const [isLoginMobile, setIsLoginMobile] = useState(0);
  const dispatch = useDispatch();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const {width} = Dimensions.get("window");
  const profileDetailResponse: any = useAppSelector((state) => state.myProfileData);
  const profileDetails = profileDetailResponse?.data?.id
    ? profileDetailResponse?.data
    : {};

  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState({
    code: "IN",
    dial_code: "+91",
    flag: "🇮🇳",
  });
  const [error, setError] = useState({ status: false, message: "", type: 0 });
  const { userId, userFromType, setContactValue } = useAppStore();

  const kycDetailsResponse = useAppSelector(
    (state) => state.kycDetailsResponse
  );

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
    if (dob) {
      setDob(date.toISOString().split("T")[0]);
    } else {
      const date1 = new Date(date);
      date1.setTime(date1.getTime() + 24 * 60 * 60 * 1000);
      setDob(date1.toISOString().split("T")[0]);
    }
  };

  const onChangeFirstName = (val) => {
    setFirstname(val);
  };

  const onChangeLastName = (val) => {
    setLastname(val);
  };

  const onChangeContact = (val) => {
    setContact(val);
  };

  const onEnterMobile = ({ nativeEvent: { text } }) => {
    setContact(text);
  };

  const onSetGender = (val) => {
    setGender(val);
  };

  const validateForm = () => {
    if (!firstName) {
      showToast({
        type: "info",
        text1: "Please Enter First Name",
      });
      return false;
    }

    if (!lastName) {
      showToast({
        type: "info",
        text1: "Please Enter Last Name",
      });
      return false;
    }

    if (!contact) {
      showToast({
        type: "info",
        text1: "Please Enter Email",
      });
      return false;
    }

    if (!dob) {
      showToast({
        type: "info",
        text1: "Please Select Date of birth",
      });
      return false;
    }

    return true;
  };

  const onSubmitDataHandler = async () => {
    if (validateForm()) {
      dispatch(setKycLoading(true));
      var res: any = await dispatch(
        //@ts-ignore
        kycBasicDetails({
          userId: userId,
          firstName: firstName,
          lastName: lastName,
          contact:
            isLoginMobile === 1 ? countryCode?.dial_code + contact : contact,
          dob: dob,
          gender: gender,
          identificationType:
            userFromType === "event" ? 2 : userFromType === "google" ? 4 : 0,
          isMobile: isLoginMobile === 0 ? 1 : 0,
        })
      );

      setContactValue(
        isLoginMobile === 1 ? countryCode?.dial_code + contact : contact
      );

      if (res?.payload?.success) {
        console.log("profileDetails>>", res);
        dispatch(updateProfileData({data:{
          ...profileDetails,
          kyc_details: profileDetails?.kyc_details ?  {
            ...profileDetails?.kyc_details,
            phone: isLoginMobile === 1 ? countryCode?.dial_code + contact : contact,
            temp_email: isLoginMobile === 1 ? '': contact,
          }: {
            phone: isLoginMobile === 1 ? countryCode?.dial_code + contact : contact,
            temp_email: isLoginMobile === 1 ? '': contact,  
          }
      }}))
        router.push({ pathname: "/KycOnboardHoc", params: { kycStepData: 1, isBasicDetail: "true" } });
        dispatch(clearAllValues(""));
      } else {
        showToast({
          type: "error",
          text1: res?.payload?.message || "Something went wrong",
        });
      }
    }
  };

  useEffect(() => {
    setFirstname(getFirstNameLocal());
    setLastname(getLastNameLocal());
    setIsLoginMobile(getLoggedMobile());
    if (type == 4) {
      setContact(email);
    }
  }, []);

  const onPressCountry = () => setShow(true);

  const onSelectCountryCode = (item) => {
    const { code, dial_code, flag } = item;
    setCountryCode({ code, dial_code, flag });
    setShow(false);
  };

  const defaultDOB = useMemo(() => {
    return new Date(
      new Date().getFullYear() - 18,
      new Date().getMonth(),
      new Date().getDate()
    );
  }, []);

  return (
    
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
        <View style={{ width: width *0.8 }}>
          <View style={{ marginTop: "10%" }}>
            {/* @ts-ignore */}
            <CountryPicker
              enableModalAvoiding={true}
              show={show}
              pickerButtonOnPress={onSelectCountryCode}
              popularCountries={["IN"]}
              style={{
                modal: {
                  position: "absolute",
                  top: 0,
                  marginTop: "15%",
                },
              }}
            />
          </View>
          <DateTimePickerModal
            timePickerModeAndroid="spinner"
            isVisible={isDatePickerVisible}
            mode="date"
            onChange={(date: Date) => {
              // setDob(date.toISOString().split("T")[0]);
            }}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            pickerContainerStyleIOS={{ backgroundColor: "#020015" }}
            date={dob ? new Date(dob) : defaultDOB}
            display="spinner"
            maximumDate={
              new Date(
                new Date().getFullYear() - 18,
                new Date().getMonth(),
                new Date().getDate()
              )
            }
            minimumDate={new Date(1950, 0, 1)}
            style={{ backgroundColor: "red" }}
          />

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ width: "48%" }}>
              <TextInputComponent
                header="First Name"
                placeHolder="Enter first name"
                onChangeText={onChangeFirstName}
                value={firstName}
              />
            </View>
            <View style={{ width: "48%" }}>
              <TextInputComponent
                header="Last Name"
                placeHolder="Enter last name"
                onChangeText={onChangeLastName}
                value={lastName}
              />
            </View>
          </View>

          {isLoginMobile === 1 ? (
            <MobileInput
              value={contact}
              onChangeValue={onEnterMobile}
              onPressCountry={onPressCountry}
              countryCode={countryCode}
              error={error.status}
            />
          ) : (
            <TextInputComponent
              header="Email Address"
              placeHolder="eg: xyz@email.com"
              onChangeText={onChangeContact}
              value={contact}
              editable={email ? false : true}
              keyboardType={"email-address"}
            />
          )}

          <TextInputComponent
            header="Date Of Birth"
            placeHolder="Select your DOB"
            rightIcon={"calender"}
            onPressRightIcon={showDatePicker}
            editable={false}
            value={dob}
          />

          {/* Gender Section */}
          <View
            style={{
              width: "100%",
              flexDirection: "column",
              alignItems: "flex-start",
              marginTop: 16,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                lineHeight: 18,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutral9,
              }}
            >
              Gender
            </Text>

            <View style={{ flexDirection: "row", marginTop: "5%", gap: 20 }}>
              {genderData.map((dat) => (
                <TouchableOpacity
                  onPress={() => onSetGender(dat.title)}
                  key={dat?.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{ width: 24, height: 24 }}
                    contentFit="cover"
                    source={
                      dat?.title === gender
                        ? require("@/assets/image/checkcircle.png")
                        : require("@/assets/image/radio-botton1.png")
                    }
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 18,
                      fontFamily: fontFamilies.semiBold,
                      color: globalColors.neutral8,
                      marginLeft: 8,
                    }}
                  >
                    {dat?.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Why is this needed? */}

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              marginTop: "10%",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                showToast({
                  type: "info",
                  text1: "Identity verification required",
                })
              }
            >
              <InfoIcon />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 24,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutral7,
                textAlign: "center",
                marginLeft: "2%",
              }}
            >
              Why is this needed?
            </Text>
          </View>

          <Button1
            isLoading={kycDetailsResponse.isLoaded}
            title="Next"
            onPress={onSubmitDataHandler}
          />
        </View>
      </KeyboardAvoidingView>
      </ScrollView>
    
  );
};

export default BasicDetailForm;
