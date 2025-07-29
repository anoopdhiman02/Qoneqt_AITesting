import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ImageFallBackUser, ImageUrlConcated } from "@/utils/ImageUrlConcat";
import { ClockIcon, VerifiedIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import moment from "moment";

export interface ProfileDetailsProps {
  detailsProps: DetailsProps;
  socialName: string;
  userName: string;
  onPressSocialName: () => void;
  favCategories: {};
}

interface DetailsProps {
  id: number;
  name: string;
  profilePic: string;
  postCount: number;
  following: number;
  follower: number;
  email: string;
  phone: number;
  onPressPic: () => {};
  onPressFollowings: () => void;
  onPressFollowers: () => void;
}

const ProfileDetailComponent = ({ data, isLoading }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleCloseModal = () => {
    setModalVisible(false);
  };

  if (isLoading) {
    return (
      <View style={{ padding: 10, marginBottom: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ShimmerPlaceholder
            style={{
              width: 75,
              height: 75,
              borderRadius: 50,
            }}
          />
          <View
            style={{
              marginLeft: "22%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <ShimmerPlaceholder
              style={{
                width: "25%",
                height: 35,
                marginBottom: 16,
                borderRadius: 3,
              }}
            />
            <ShimmerPlaceholder
              style={{
                width: "22%",
                height: 35,
                marginBottom: 16,
                borderRadius: 3,
              }}
            />
            <ShimmerPlaceholder
              style={{
                width: "22%",
                height: 35,
                marginBottom: 16,
                borderRadius: 3,
              }}
            />
          </View>
        </View>
        <ShimmerPlaceholder
          style={{
            width: "40%",
            height: 22,
            borderRadius: 3,
            marginTop: "6%",
            marginLeft: "3%",
          }}
        />
        <ShimmerPlaceholder
          style={{
            width: "50%",
            height: 22,
            borderRadius: 3,
            marginTop: "3%",
            marginLeft: "3%",
          }}
        />
      </View>
    );
  }

  const CustomCountView = ({ count, title, onPress }) => { 
    return (
      <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={onPress}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: fontFamilies.semiBold,
                color: globalColors.warmPinkTint20,
              }}
            >
              {count}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: fontFamilies.semiBold,
                color: globalColors.neutral_white[200],
                marginTop: 2,
              }}
            >
              {title}
            </Text>
          </TouchableOpacity>
    )
  }

  return (
      <View
        style={{
          width: "100%",
          alignItems:'center',
          padding: 8,
        }}
      >

          {/* Profile Picture (Small) */}
          <TouchableOpacity style={{alignItems: "center", justifyContent: "center", width: 100, height: 100, borderRadius: 50, overflow: 'hidden', borderWidth: 2, borderColor: globalColors.neutralWhite}} onPress={toggleModal}>
            <ImageFallBackUser
              imageData={data?.profile_pic}
              fullName={data?.full_name}
              widths={100}
              heights={100}
              borders={50}
            />
          </TouchableOpacity>
          <View
        style={{ flexDirection: "row", marginTop: "5%", width: '100%', justifyContent: 'center' }}
      >
        <Text
          style={{
            fontSize: 20,
            fontFamily: fontFamilies.bold,
            color: globalColors.neutralWhite,
          }}
        >
          {data?.full_name}
        </Text>

        {data?.kyc_status == 1 && (
          <VerifiedIcon style={{ marginLeft: 5, marginTop: 2 }} />
        )}
      </View>
      {data?.username && <Text
        style={{
          fontSize: 14,
          fontFamily: fontFamilies.regular,
          color: globalColors.neutral_white[300],
          marginTop: 4,
        }}
      >
        @{data?.username || '' }
      </Text>}
      {data?.about && <Text
        style={{
          fontSize: 14,
          fontFamily: fontFamilies.regular,
          color: globalColors.neutral_white[300],
          marginTop:4,
          width: '100%',
          textAlign: 'center',
        }}
      >
        {data?.about || '' }
      </Text>}

       {/* {data?.time ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <ClockIcon />
          <Text
            style={{
              fontSize: 11,
              lineHeight: 18,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutral8,
            }}
          >
            {" "}
            {moment(data?.time, "YYYY-MM-DD").format("DD MMM YYYY")}
          </Text>
        </View>
      ) : (
        <Text
          style={{
            fontSize: 11,
            lineHeight: 18,
            fontFamily: fontFamilies.regular,
            color: globalColors.neutral7,
          }}
        >
          --
        </Text>
      )} */}
      
      <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%",
            marginTop: "4%",
            borderRadius: 10,
            padding: 10,
          }}
        >
          <CustomCountView count={data?.post_count} title="Posts" onPress={()=>{}}/>
          <CustomCountView count={data?.follower_count} title="Followers" onPress={() => router.push({
            pathname: "/FollowersList",
            params: { profileId: data?.id },
          })}/>
          <CustomCountView count={data?.following_count} title="Following" onPress={() => router.push({
                pathname: "/FollowingsList",
                params: { profileId: data?.id },
              })}/>

        </View>
          {/* Full-Screen Image Modal */}
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={toggleModal}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.9)",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={toggleCloseModal}
            >
              {/* Expanded Image */}
              <ImageFallBackUser
                imageData={data?.profile_pic}
                fullName={data?.full_name}
                widths={250}
                heights={250}
                borders={5}
              />
            </TouchableOpacity>
          </Modal>
        </View>
  );
};

export default ProfileDetailComponent;
