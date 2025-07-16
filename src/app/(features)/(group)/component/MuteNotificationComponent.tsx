import { View, Text, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import { globalColors } from '@/assets/GlobalColors';
import { CheckCircleIcon } from '@/assets/DarkIcon';
import Button1 from '@/components/buttons/Button1';
import GradientText from '@/components/element/GradientText';
import { fontFamilies } from '@/assets/fonts';

interface MuteNotificationComponentProps {
    setSelect?:any;
    select?: any;
    onMutePress: () => void;
    onCancelPress: () => void;
}

const MuteNotificationComponent:FC<MuteNotificationComponentProps> = ({select,setSelect, onCancelPress,onMutePress}) => {
  return (
    <View style={{ alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <View>
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                Mute notification
              </Text>
              <View
                style={{
                  padding: "1.5%",
                  borderRadius: 10,
                  backgroundColor: globalColors.slateBlueShade60,
                }}
              >
                <Text
                  style={{
                    marginTop: "2.5%",
                    color: "gray",
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  The chat stays muted privately, without alerting others, while
                  you still receive notifications if mentioned.
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setSelect(1)}
            style={{
              flexDirection: "row",
              marginTop: "5%",
              borderWidth: 0.3,
              borderColor: globalColors.neutral8,
              width: "90%",
              borderRadius: 5,
              justifyContent: "space-between",
              padding: "4%",
            }}
          >
            <Text style={{ color: globalColors.neutral9 }}>8 hours</Text>
            {select === 1 ? (
              <CheckCircleIcon />
            ) : (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: globalColors.neutral5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setSelect(2);
            }}
            style={{
              flexDirection: "row",
              marginTop: "5%",
              borderWidth: 0.3,
              borderColor: "gray",
              width: "90%",
              borderRadius: 5,
              justifyContent: "space-between",
              padding: "4%",
            }}
          >
            <Text style={{ color: globalColors.neutral9 }}>1 week</Text>
            {select === 2 ? (
              <CheckCircleIcon />
            ) : (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: globalColors.neutral5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelect(3)}
            style={{
              flexDirection: "row",
              marginTop: "5%",
              borderWidth: 0.3,
              borderColor: "gray",
              width: "90%",
              borderRadius: 5,
              justifyContent: "space-between",
              padding: "4%",
            }}
          >
            <Text style={{ color: globalColors.neutral9 }}>Always</Text>
            {select === 3 ? (
              <CheckCircleIcon />
            ) : (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: globalColors.neutral5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            )}
          </TouchableOpacity>

          <Button1
            title="Mute"
            onPress={() => {
                onMutePress();
            //   SubmitMuteRequest(1, select);
            //   muteNotifiRef.current.close();
            //   OptionRef.current.close();
            //   onGetGroupDetailsHandler(groupId);
            }}
            isLoading={false}
          />

          <TouchableOpacity onPress={() => {
            onCancelPress();
            // muteNotifiRef.current.close();
            }}>
            <GradientText
              style={{
                fontFamily: fontFamilies.bold,
                fontSize: 17,
                color: globalColors.darkOrchid,
                bottom: "28%",
              }}
            >
              <Text style={{ color: globalColors.neutralWhite, fontSize: 17 }}>
                Cancel
              </Text>
            </GradientText>
          </TouchableOpacity>
        </View>
  )
}

export default MuteNotificationComponent