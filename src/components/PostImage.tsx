import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { ImageUrlConcated } from "@/utils/ImageUrlConcat";
import { globalColors } from "@/assets/GlobalColors";
import ImageView from "react-native-image-viewing";
import { Blurhash } from "react-native-blurhash";

const { width, height } = Dimensions.get("window");
interface PostImageProps {
  source?: any;
  type?: any;
  isHome?: boolean;
  isGroup?: boolean;
  blurhash?: any
  img_height?: any
}

const PostImage = ({ source, type, isHome, isGroup, blurhash = [], img_height = [] }: PostImageProps) => {
  const sources = Array.isArray(source) ? source : [source];
  const [mediaHeight, setMediaHeight] = useState(400);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const handleImageLoadView = (event) => {
    try {
      setIsLoading(false);
      const { width: imgW, height: imgH } = event.source;
      const displayWidth = isHome ? width * 0.94 : isGroup ? width * 0.65 : width * 0.8;
      const ratio = imgH / imgW;
      const manageHeight = displayWidth * ratio * ((displayWidth * ratio) > 300 ? 3 / 4 : 1);
      setMediaHeight(Math.min(manageHeight, 600)+20); // Cap height
    } catch (e) {
      console.log("handleImageLoadView", e);
    }
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };
  const imageData = useMemo(
    () =>
      type === "image"
        ? sources.map((item) => ({
            uri: item?.startsWith("file") ? item : ImageUrlConcated(item),
          }))
        : [],
    [sources, type]
  );

  if (type === "image") {
    return (
      <View style={{ marginTop: "2%" }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={sources.length > 1}
          onScroll={(e) => {
            const contentOffsetX = e.nativeEvent.contentOffset.x;
            const index = Math.floor(contentOffsetX / width);
            if (index !== activeIndex) setActiveIndex(index);
          }}
          scrollEventThrottle={16}
        >
          {sources.map((src, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={1}
              style={{
                width: isHome
                  ? width * 0.96
                  : isGroup
                  ? width * 0.65
                  : width * 0.94,
                marginHorizontal: isHome
                  ? width * 0.01
                  : isGroup
                  ? 5
                  : width * 0.01,
                borderRadius: 10,
                overflow: "hidden",
                height: sources.length > 1 ? 400 : mediaHeight,

              }}
              onPress={() => {
                setImageIndex(index);
                setIsVisible(true);
              }}
            >
              {isLoading && (
                <View style={styles.skeleton}>
                  {blurhash[index] ? (<Blurhash
      blurhash={blurhash[index]}
      style={{
        ...styles.media,
        height:
          sources.length > 1 ? 400 : mediaHeight,
      }}
    />):(
                  <LinearGradient
                    colors={["#583da1", "#9a67ea"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.skeleton}
                  >
                    <ActivityIndicator size="large" color="#cccccc" />
                  </LinearGradient>)}
                </View>
              )}
              <Image
                style={{
                  ...styles.media,
                  height:
                    sources.length > 1 ? 400: mediaHeight,
                }}
                contentFit="cover"
                source={
                  hasError || !src
                    ? require("./../assets/image/emptyPost.jpg")
                    : {
                        uri: src.startsWith("file")
                          ? src
                          : ImageUrlConcated(src),
                      }
                }
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => setIsLoading(false)}
                onError={handleImageError}
                onLoad={handleImageLoadView}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
        {sources.length > 1 && (
          <View
            style={{
              flexDirection: "row",
              marginVertical: 20,
              alignSelf: "center",
            }}
          >
            {sources.map((_, index) => (
              <View
                key={index}
                style={{
                  backgroundColor:
                    index === activeIndex
                      ? globalColors.neutralWhite
                      : globalColors.neutral2,
                  height: 10,
                  borderRadius: 10,
                  width: 10,
                  marginHorizontal: 5,
                }}
              />
            ))}
          </View>
        )}
        <ImageView
          images={imageData}
          imageIndex={imageIndex}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.media}>
        <View style={styles.skeleton}>
          <LinearGradient
            colors={["#583da1", "#9a67ea"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.skeleton}
          >
            <Text style={styles.text}>[ Attachment Missing ]</Text>
          </LinearGradient>
        </View>
      </View>
    );
  }
};

export default PostImage;

const styles = StyleSheet.create({
  bgMedia: {
    width: "98%",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "1%",
  },
  media: {
    width: "100%",
    borderRadius: 11,
  },
  playPauseButton: {
    position: "absolute",
    backgroundColor: globalColors.darkOrchidShade60,
    borderRadius: 24,
    padding: 8,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  skeleton: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#583da1",
    borderRadius: 11,
  },
  text: {
    color: globalColors.neutralWhite,
    fontSize: 12,
    fontWeight: "bold",
  },
});
