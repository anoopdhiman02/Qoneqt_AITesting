import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import ProfileButton from './ProfileButton';
import { globalColors } from '@/assets/GlobalColors';
import { fontFamilies } from '@/assets/fonts';
import { ArrowDownIcon, ArrowUpIcon } from '@/assets/DarkIcon';
import { router } from 'expo-router';

interface ProfileButtonViewComponentProps {
    profileDetails: any;
    toggleItem: () => void;
    expandedItem: boolean;
    fname?: string;
    lname?: string;
    ShareProfile?: any;
}

const ProfileButtonViewComponent: React.FC<ProfileButtonViewComponentProps> = ({ profileDetails, toggleItem, expandedItem, fname, lname, ShareProfile }) => {
  return (
    <>
      <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ProfileButton
            label={"Edit profile"}
            onPress={() =>
              router.push({
                pathname: "/UpdateProfileScreen",
                params: {
                  profilePic: profileDetails?.profile_pic,
                  firstName: fname,
                  lastName: lname,
                  headline: profileDetails?.about,
                  position: "job",
                  socialName: profileDetails?.social_name,
                  favCategory: '',
                  walletAddress: "wallet address",
                },
              })
            }
          />
          <ProfileButton
            label={"Share profile"}
            onPress={() => {
                ShareProfile()
            //   ShareProfileRef.current.expand();
            }}
          />

          <ProfileButton
            label={"Contact info"}
            onPress={() =>
              router.push({
                pathname: "/ContactInfoScreen",
                params: {
                  website: profileDetails?.website
                    ? profileDetails?.website
                    : "",
                  country: profileDetails?.country
                    ? profileDetails?.country
                    : "",
                  city: profileDetails?.city ? profileDetails?.city : "",
                },
              })
            }
          />
        </View>

        {profileDetails?.leaderboard === 1 && (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              borderWidth: 1,
              borderRadius: 8,
              borderColor: globalColors.slateBlueShade40,
              padding: "3%",
              marginTop: "5%",
              alignItems: "center",
              backgroundColor: globalColors.neutral2,
            }}
            onPress={toggleItem}
          >
            <Text
              style={{
                color: globalColors.neutral10,
                flex: 1,
                fontSize: 16,
                fontFamily: fontFamilies.medium,
              }}
            >
              Leader Board
            </Text>
            {expandedItem ? (
              <ArrowDownIcon
                style={{ marginLeft: 10, color: globalColors.neutral10 }}
              />
            ) : (
              <ArrowUpIcon
                style={{ marginLeft: 10, color: globalColors.neutral10 }}
              />
            )}
          </TouchableOpacity>
        )}
    </>
  )
}

export default ProfileButtonViewComponent