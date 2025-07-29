import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { ImageFallBackUser, ImageUrlConcated } from "@/utils/ImageUrlConcat";
import { ClockIcon, VerifiedIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import moment from "moment";

interface DetailsProps {
  userId?: any;
  postCount?: number;
  following?: number;
  follower?: number;
  profilePic?: string;
  firstName?: string;
  lastName?: string;
  socialName?: string;
  userName?: string;
  Headline?: string;
  position?: string;
  isVerified?: number;
  email?: string;
  phone?: number;
  website?: string;
  city?: string;
  country?: string;
  joinDate?: number;
  onPressPic?: () => void;
  onPressFollowings?: ({ profileId }: { profileId: any }) => void;
  onPressFollowers?: ({ profileId }: { profileId: any }) => void;
  loading?: boolean;
  toggleModal?: () => void;
}

const ProfileDetailsComponent = ({
  userId,
  firstName,
  lastName,
  socialName,
  userName,
  profilePic,
  postCount,
  follower,
  following,
  Headline,
  isVerified,
  joinDate,
  onPressPic,
  onPressFollowers,
  onPressFollowings,
  loading,
  toggleModal,
}: DetailsProps) => {


  const StateText = ({ children, isLabel = false }) => (
    <Text
      style={{
        fontSize: 14,
        lineHeight: 18,
        fontFamily: fontFamilies.regular,
        color: isLabel ? globalColors.neutral9 : globalColors.neutralWhite,
        textAlign: "left",
        marginTop: isLabel ? 4 : 0,
      }}
    >
      {children}
    </Text>
  );

  const Lines = () => (
    <View
      style={{
        borderStyle: "solid",
        borderColor: globalColors.neutral9,
        borderRightWidth: 1,
        width: 1,
        height: 25,
        marginLeft: 16,
      }}
    />
  );

  const StatButton = ({ value, label, onPress, marginLeft = 0 }: any) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginLeft,
      }}
    >
      <StateText>{value}</StateText>
      <StateText isLabel>{label}</StateText>
    </TouchableOpacity>
  );
  if (loading) {
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

  return (
    <View style={{paddingHorizontal: 20}}>
      <View
        style={{
          alignSelf: "stretch",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "3%",
        }}
      >
        <View>
          {/* Profile Picture (Small) */}
          <TouchableOpacity onPress={toggleModal}>
            <ImageFallBackUser
              imageData={profilePic}
              fullName={firstName}
              widths={64}
              heights={64}
              borders={48}
            />
          </TouchableOpacity>  
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <StatButton value={postCount} label="Posts" onPress={undefined} />
          {/* <Lines /> */}
          <StatButton
            value={follower}
            label="Followers"
            onPress={() => onPressFollowers({ profileId: userId })}
            marginLeft={22}
          />
          {/* <Lines /> */}
          <StatButton
            value={following}
            label="Following"
            onPress={() => onPressFollowings({ profileId: userId })}
            marginLeft={22}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: "8%",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            letterSpacing: 0.2,
            fontFamily: fontFamilies.bold,
            color: globalColors.neutralWhite,
            marginRight: 5,
          }}
        >
          {firstName + " " + lastName}
        </Text>
        {isVerified == 1 ? <VerifiedIcon /> : null}
      </View>

      {socialName!="" && (
        <Text
          style={{
            fontSize: 14,
            lineHeight: 18,
            fontFamily: fontFamilies.regular,
            color: globalColors.neutralWhite,
            marginTop: 8,
          }}
        >
          {socialName}
        </Text>
      )}

      {Headline !== "" && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              lineHeight: 18,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutralWhite,
              textAlign: "left",
            }}
          >
            {Headline}
          </Text>
        </View>
      )}

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
            fontSize: 12,
            lineHeight: 18,
            fontFamily: fontFamilies.regular,
            color: globalColors.neutral7,
          }}
        >
          {joinDate
            ? moment(joinDate, "YYYY-MM-DD").format("DD MMM YYYY")
            : "--"}
        </Text>
      </View>
    </View>
  );
};

export default ProfileDetailsComponent;
