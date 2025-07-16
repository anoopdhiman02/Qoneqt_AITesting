import React, { useEffect, useRef, useState } from "react";
import { Image } from "expo-image";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button1 from "../../../components/buttons/Button1";
import GoBackNavigation from "../../../components/Header/GoBackNavigation";
import { ArrowUpIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import ViewWrapper from "@/components/ViewWrapper";
import {
  router,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import { ImageUrlConcated } from "@/utils/ImageUrlConcat";
import { useAppStore } from "@/zustand/zustandStore";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { createEventPost } from "@/redux/reducer/post/CreateEventPost";
import { getUserDeatils } from "@/localDB/LocalStroage";
import {
  changeLoader,
  clearEventData,
} from "@/redux/slice/post/CreateEventPostSlice";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const { width } = Dimensions.get("window");

const CreateEventPostScreen = (data) => {
  useScreenTracking("CreateEventPostScreen");
  const param: any = useLocalSearchParams();
  const params = JSON.parse(param.postData)
  

  const setUserId = useAppStore((state) => state.setUserId);

  const [userIdnew, setUserIdNew] = useState();
  const [isEvent, setIsEvent] = useState(false);

  const Dispatch = useAppDispatch();

  //Submit post
  const submitPostResponse = useAppSelector(
    (state) => state?.createEventPostData
  );

  useEffect(() => {
    const userData = async () => {
      const UserDetails = await getUserDeatils();
      setUserIdNew(UserDetails?.id);
      setUserId(UserDetails?.id);
    };

    userData();
  }, []);

  useEffect(() => {
    if (!submitPostResponse.Loader) {
      if (submitPostResponse.success && submitPostResponse.message) {
        showToast({ type: "success", text1: submitPostResponse.message });
        Dispatch(clearEventData([]));
        router.back();
      } else if (submitPostResponse.error) {
        showToast({
          type: "error",
          text1: submitPostResponse.message || "Something went wrong",
        });

        Dispatch(clearEventData([]));
        router.back();
      }
    }
  }, [submitPostResponse]);
  

  const onSubmitEventPostHandler = () => {
    Dispatch(changeLoader(true));

    Dispatch(
      createEventPost({
        attachType: "image",
        catId: "1",
        userId: userIdnew,
        desc: params?.post_content,
        file: params?.post_image,
        group_id: params?.group_id,
        postType: 0,
        eventName: params?.event_name,
        imgHeight: params?.img_height
      })
    );
  };
console.log("params?.postData>>",params.post_id, JSON.stringify(params), data)
  return (
    <ViewWrapper>
      <GoBackNavigation header="Create Event post" isHome isDeepLink={"false"} />
      <ScrollView
        style={{ width: "100%", alignSelf: "center" }}
        contentContainerStyle={{ alignItems: "center" }}
        scrollEnabled={false}
      >
        <View
          style={{
            alignItems: "center",

            width: "93%",
            marginTop: "5%",
            paddingBottom: "30%",
          }}
        >
          <View
            style={{
              height: 180,
              width: "100%",
              borderRadius: 10,
              justifyContent: "flex-start",
              borderColor: "white", 
              borderWidth: 1,
              marginBottom: "5%",
            }}
          >
            <TextInput
              editable={isEvent ? false : true}
              multiline={true} 
              placeholder="Write your caption here..." 
              placeholderTextColor="#bbbbbb" 
              style={{
                fontSize: 22,
                color: globalColors.neutralWhite,
                height: 180,
                padding: 10, 
                paddingTop: 10, 
                textAlignVertical: "top", 
                borderRadius: 5,
              }}
              defaultValue={
                params?.post_content || ""
              }
            />
          </View>

          <Image
            style={{
              width: (width * 80) / 100,
              height: (width * 80 * (120 / 180)) / 100,
              // width: 300,
              // height: 200,
              borderRadius: 15,
            }}
            contentFit="contain"
            source={{
              uri: ImageUrlConcated(params?.post_image),
            }}
          />

          <Text
            style={{
              color: globalColors.neutralWhite,
              fontFamily: fontFamilies.regular,
              alignSelf: "flex-start",
              marginTop: "10%",
            }}
          >
            Select Group
          </Text>

          <TouchableOpacity
            disabled={true}
            style={{
              borderWidth: 0.5,
              borderRadius: 8,
              borderColor: globalColors.neutral5,
              padding: "2.5%",
              marginTop: 12,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
                fontSize: 16,
              }}
            >
              {params?.group_name || "Event Feeds"}
            </Text>
            <ArrowUpIcon />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          bottom: 60,
          width: "90%",
        }}
      >
        <Button1
          isLoading={submitPostResponse.Loader}
          title={params?.post_id ? "Claim" : "Post"}
          onPress={() => {
            onSubmitEventPostHandler();
          }}
        />
      </View>
    </ViewWrapper>
  );
};

export default CreateEventPostScreen;
