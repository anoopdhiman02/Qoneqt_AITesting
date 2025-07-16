import { View, Text, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import { globalColors } from '@/assets/GlobalColors';
import { ClaimGroupIcon, DeleteAccountIcon, InfoIcon, MuteIcon, ReportIcon, UnmuteIcon } from '@/assets/DarkIcon';

interface OptionComponentProps {
    handleMuteToggle?: () => void;
    mute?: number|string;
    onGroupInfoPress?: () => void;
    onClaimPress?: () => void;
    onReportPress?: () => void;
    onExitPress?: () => void;
    isClaim?: boolean;
}

const OptionComponent:FC<OptionComponentProps> = ({handleMuteToggle, mute, onGroupInfoPress, onClaimPress, onReportPress, onExitPress, isClaim= true}) => {
  return (
    <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 23,
              textAlign: "center",
            }}
          >
            More
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              marginTop: "5%",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                handleMuteToggle();
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                paddingVertical: "3%",
              }}
            >
              {mute === 0 ? <MuteIcon /> : <UnmuteIcon />}
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 18,
                  left: "20%",
                }}
              >
                {mute === 1 ? "Unmute" : "Mute"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
                onGroupInfoPress();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              paddingVertical: "3%",
            }}
          >
            <InfoIcon />
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 18,
                left: "20%",
              }}
            >
              Group Info
            </Text>
          </TouchableOpacity>
{isClaim&&
          <TouchableOpacity
            onPress={() => {
                onClaimPress();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              paddingVertical: "3%",
            }}
          >
            <ClaimGroupIcon />
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 18,
                left: "20%",
              }}
            >
              Claim group
            </Text>
          </TouchableOpacity>}

          <TouchableOpacity
            onPress={() => {
                onReportPress();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              paddingVertical: "3%",
            }}
          >
            <ReportIcon />
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 18,
                left: "20%",
              }}
            >
              Report group
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            // Here
            onPress={() => {
                onExitPress();

            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              paddingVertical: "3%",
            }}
          >
            <DeleteAccountIcon />
            <Text
              style={{
                color: globalColors.warning,
                fontSize: 18,
                left: "20%",
              }}
            >
              Exit group
            </Text>
          </TouchableOpacity>
        </View>
  )
}

export default OptionComponent