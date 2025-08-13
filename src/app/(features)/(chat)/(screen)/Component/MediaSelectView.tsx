import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { globalColors } from '@/assets/GlobalColors';
import { CameraIcon, PhotoIcon } from '@/assets/DarkIcon';
import GradientText from '@/components/element/GradientText';
import { fontFamilies } from '@/assets/fonts';

const MediaSelectView = ({onCancelHandler, onPressCamera, onPressGallary}) => {
  return (
    <View style={{ alignItems: "center", padding: 20 }}>
        <Text
          style={{
            color: globalColors.neutralWhite,
            fontSize: 20,
            marginBottom: 20,
          }}
        >
          Select to upload image
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "5%",
          }}
        >
          <TouchableOpacity
            onPress={onPressCamera}
            style={{
              borderRadius: 16,
              backgroundColor: globalColors.neutral3,
              overflow: "hidden",
              width: "40%",
              height: 100,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CameraIcon />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onPressGallary}
            style={{
              borderRadius: 16,
              backgroundColor: globalColors.neutral3,
              overflow: "hidden",
              width: "40%",
              height: 100,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PhotoIcon />
            <Text style={{ color: globalColors.neutralWhite }}>
              {"Gallery"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={onCancelHandler}
          style={{ marginTop: "10%" }}
        >
          <GradientText
            style={{
              fontFamily: fontFamilies.bold,
              fontSize: 17,
            }}
          >
            Cancel
          </GradientText>
        </TouchableOpacity>
      </View>
  )
}

export default MediaSelectView

const styles = StyleSheet.create({})