import {
  Dimensions,
  Linking,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { globalColors } from "@/assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";
import ButtonTwo from "../buttons/ButtonTwo";
import { LinearGradient } from "expo-linear-gradient";
import { CloseBigIcon, MailIcon } from "@/assets/DarkIcon";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { DynamicContentReq } from "@/redux/reducer/home/DynamicContentrequest";
import { useAppStore } from "@/zustand/zustandStore";
import { DynamicContentStatusReq } from "@/redux/reducer/home/DynamicContentStatus";
import { useIsFocused } from "@react-navigation/native";
import { DynamicActionReq } from "@/redux/reducer/home/DynamicActionReq";
import { fetchMyProfileDetails } from "@/redux/reducer/Profile/FetchProfileDetailsApi";

const { width } = Dimensions.get("window");

interface DynamicContentModalProps {
    onPressModal?: () => void;
  onPress?: () => void;
  loading?: boolean;
}

const DynamicContentModal = ({ onPressModal, onPress, loading }: DynamicContentModalProps) => {
  const [modalVisible, setModalVisible] = useState(true);
  const dynamiContent: any = useAppSelector((state) => state?.dynamicContent);
  const dispatch = useAppDispatch();

  const [getApiCalled, setGetApiCalled] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [buttontext, setButtonText] = useState("");

  const [listLoading, setListLoading] = useState(false);
  const [contentList, setContentList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [type, setType] = useState("");

  //following list
  const { userId } = useAppStore();
  const isFocused = useIsFocused();
  const openWebPage = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err)
    );
  };


  const getDynamicData = async ()=>{
   var dynamicValue = await dispatch(DynamicContentReq({ user_id: userId }));

   if(dynamicValue.payload.success){
    setType(dynamicValue.payload?.data?.button_type || "");
    setName(dynamicValue.payload?.data?.name || "");
    setContent(dynamicValue.payload?.data?.content || "");
    setButtonText(dynamicValue.payload?.data?.button_text);
    setContentList(dynamicValue.payload?.data);
   }
  }

  useEffect(() => {
    if (userId && !dynamiContent?.data?.name) {
      getDynamicData();
    }
  }, [userId]);

 

  const dynamiContentStatus = useAppSelector(
    (state) => state?.dynamicContentStatusSlice
  );
  useEffect(() => {
    if (userId && isFocused && !dynamiContent?.data?.name) {
      dispatch(DynamicContentStatusReq({ user_id: userId }));
      dispatch(fetchMyProfileDetails({userId: userId}))
      setGetApiCalled(true);
    }
  }, [userId, isFocused, dynamiContentStatus, getApiCalled]);

  useEffect(() => {
    if (dynamiContent && dynamiContent.data) {
      
    }
  }, [dynamiContentStatus]);

  const onVerifyDynamicActionReq = () => {
    dispatch(
      //@ts-ignore
      DynamicActionReq({
        campaign_id: dynamiContent.data.id,
        user_id: userId,
        status: "0",
      })
    );
  };

  const onCancelDynamicActionReq = () => {
    dispatch(
      //@ts-ignore
      DynamicActionReq({
        campaign_id: dynamiContent.data.id,
        user_id: userId,
        status: "1",
      })
    );
  };

  return (
    <TouchableOpacity onPress={onPressModal}>
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <LinearGradient
            colors={globalColors.cardBg1}
            start={{ x: 3.5, y: 0 }}
            end={{ x: 1, y: 3 }}
            style={{
              width: "85%",
              height: 400,
              borderRadius: 12,
              paddingVertical: 20,
              paddingHorizontal: 15,
              alignItems: "center",
              marginTop: "15%",
            }}
          >
            {/* Top Close Icon Section */}
            <View
              style={{
                width: "20%",
                alignItems: "flex-end",
                left: "40%",
              }}
            >
              <TouchableOpacity
                style={{ alignSelf: "center" }}
                onPress={() => {
                  onCancelDynamicActionReq();
                  setModalVisible(false);
                }}
              >
                <CloseBigIcon />
              </TouchableOpacity>
            </View>

            {/* Image Content Section */}
            {
            dynamiContent?.data.image &&
            dynamiContent?.data.image !== null ? (
              <Image
                style={{ width: "70%", height: 200 }}
                contentFit="cover"
                source={{ uri: dynamiContent.data.image }}
              />
            ) : (
              <Image
                style={{ width: "70%", height: 200 }}
                contentFit="cover"
                source={require("@/assets/image/image2.png")}
              />
            )}

            {/* Description Content Section */}
            <View
              style={{
                alignSelf: "center",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 19,
                  lineHeight: 24,
                  fontFamily: fontFamilies.medium,
                  color: globalColors.neutralWhite,
                  alignSelf: "center",
                }}
              >
                {dynamiContent?.data.name || ''}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutral8,
                  marginTop: 4,
                  alignSelf: "center",
                }}
              >
                {dynamiContent?.data.content ||''}
              </Text>
            </View>

            {/* Action Button Section */}
            <View style={{ alignSelf: "center", marginTop: 10 }}>
              <ButtonTwo
                onPress={() => {
                  setModalVisible(false);
                  onVerifyDynamicActionReq();
                  switch (dynamiContent?.data.button_type) {
                    case "1":
                      return openWebPage("mailto:support@qoneqt.com");
                      break;

                    case "2":
                      // return router.push(dynamiContent.data.button_url);
                      onPress();
                      break;

                    case "3":
                      return openWebPage("tel:+919082541607");
                      break;

                    case "4":
                      return openWebPage("mailto:support@qoneqt.com");
                      break;

                    default:
                      console.log("No action for this type");
                    // Default action (optional)
                  }
                }}
                label={dynamiContent?.data?.button_text || ''}
              />
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

export default DynamicContentModal;
