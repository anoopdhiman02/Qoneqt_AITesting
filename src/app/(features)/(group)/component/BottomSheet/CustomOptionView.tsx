import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC } from 'react'
import { globalColors } from '@/assets/GlobalColors';
import { ClaimGroupIcon, DeleteAccountIcon, InfoIcon, MuteIcon, ReportIcon, UnmuteIcon } from '@/assets/DarkIcon';

interface CustomOptionViewProps {
  handleMuteToggle?: () => void;
  infoIconPress?: () => void;
  exitGroup?: () => void;
  reportGroup?: () => void;
  claimGroup?: () => void;
  mute?: any;
  isClaim?: boolean

}

const CustomOptionView: FC<CustomOptionViewProps> = ({
  handleMuteToggle,
  infoIconPress,
  exitGroup,
  claimGroup,
  reportGroup,
  mute,
  isClaim=true
}) => {
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
              onPress={handleMuteToggle}
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
                {mute === 0 ? "Unmute" : "Mute"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
                infoIconPress();
            }}
            style={styles.ref}
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
{isClaim && <TouchableOpacity
            onPress={() => {
                claimGroup();
            }}
            style={styles.ref}
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
                reportGroup();
            }}
            style={styles.ref}
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
            onPress={() => {
                exitGroup();
            }}
            style={styles.ref}
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

export default CustomOptionView

const styles = StyleSheet.create({
    ref: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingVertical: "3%",
      },
})