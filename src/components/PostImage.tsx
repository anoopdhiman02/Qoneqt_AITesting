import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useState, useRef } from "react";
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
  blurhash?: any;
  img_height?: any;
}

// Helper function to determine aspect ratio from image dimensions
const getAspectRatio = (imgWidth: number, imgHeight: number) => {
  const ratio = imgWidth / imgHeight;

  // 1:1 ratio (tolerance of 0.1)
  if (Math.abs(ratio - 1) <= 0.1) return "1:1";

  // 4:5 ratio (0.8) (tolerance of 0.1)
  if (Math.abs(ratio - 0.8) <= 0.1) return "4:5";

  // 16:9 ratio (1.777) (tolerance of 0.2)
  if (Math.abs(ratio - 1.777) <= 0.2) return "16:9";

  // Default to 4:5 for other ratios
  return "4:5";
};

// Get height based on aspect ratio and container width
const getHeightForRatio = (containerWidth: number, aspectRatio: string) => {
  switch (aspectRatio) {
    case "1:1":
      return containerWidth; // Square
    case "4:5":
      return containerWidth * 1.25; // Height is 1.25x width
    case "16:9":
      return containerWidth * 0.5625; // Height is 0.5625x width
    default:
      return containerWidth * 1.25; // Default to 4:5
  }
};

const PostImage = ({
  source,
  type,
  isHome,
  isGroup,
  blurhash = [],
  img_height = [],
}: PostImageProps) => {
  const sources = Array.isArray(source) ? source : [source];
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageDimensions, setImageDimensions] = useState<
    Array<{ width: number; height: number }>
  >([]);

  // Use ref to track which images have already loaded to prevent re-calculation
  const loadedImages = useRef<Set<number>>(new Set());
  const finalImageHeight = useRef<number | null>(null);

  // Calculate container width based on context
  const containerWidth = useMemo(() => {
    if (isHome) return width;
    if (isGroup) return width * 0.65;
    return width * 0.94;
  }, [isHome, isGroup]);

  // Determine the display aspect ratio
  const displayAspectRatio = useMemo(() => {
    if (imageDimensions.length === 0) {
      return "4:5"; // Default while loading
    }

    if (sources.length === 1 && imageDimensions[0]) {
      // Single image: use its actual aspect ratio
      const { width: imgWidth, height: imgHeight } = imageDimensions[0];
      return getAspectRatio(imgWidth, imgHeight);
    }

    if (sources.length > 1) {
      // For multiple images, check if we have at least one loaded image to determine ratio
      const loadedDimensions = imageDimensions.filter(
        (dim) => dim && dim.width && dim.height
      );

      if (loadedDimensions.length > 0) {
        // Get ratios from loaded images
        const ratios = loadedDimensions.map((dim) =>
          getAspectRatio(dim.width, dim.height)
        );
        const uniqueRatios = Array.from(new Set(ratios));

        if (uniqueRatios.length === 1) {
          // All loaded images have same aspect ratio, use it
          return uniqueRatios[0];
        } else if (imageDimensions.length === sources.length) {
          // All images are loaded but have different ratios: default to 4:5
          return "4:5";
        } else {
          // Not all images loaded yet, use the ratio from first loaded image
          return uniqueRatios[0];
        }
      }
    }

    return "4:5"; // Default
  }, [sources, imageDimensions]);

  // Calculate consistent height - only recalculate when dimensions change, not on scroll
  const imageHeight = useMemo(() => {
    // If we've already calculated the final height, use it
    if (finalImageHeight.current !== null) {
      return finalImageHeight.current;
    }

    const calculatedHeight = getHeightForRatio(
      containerWidth,
      displayAspectRatio
    );
    // Cap height at 600px and add some padding
    const height = Math.min(calculatedHeight, 600);

    // Only set final height once we have at least one image dimension
    // For multiple images, set it after first image loads to avoid waiting for all
    if (
      imageDimensions.length > 0 &&
      imageDimensions.some((dim) => dim && dim.width && dim.height)
    ) {
      finalImageHeight.current = height;
    }

    return height;
  }, [containerWidth, displayAspectRatio, imageDimensions]);

  const handleImageLoadView = (event: any, index: number) => {
    try {
      // Only process if this image hasn't been loaded before
      if (loadedImages.current.has(index)) {
        return;
      }

      setIsLoading(false);
      const { width: imgW, height: imgH } = event.source;

      // Mark this image as loaded
      loadedImages.current.add(index);

      // Store dimensions for this image
      setImageDimensions((prev) => {
        const newDimensions = [...prev];
        newDimensions[index] = { width: imgW, height: imgH };
        return newDimensions;
      });
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
        ? sources.map((item: any) => ({
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
            const index = Math.floor(contentOffsetX / containerWidth);
            if (index !== activeIndex) setActiveIndex(index);
          }}
          pagingEnabled
          scrollEventThrottle={16}
        >
          {sources.map((src: any, index: number) => (
            <TouchableOpacity
              key={index}
              activeOpacity={1}
              style={{
                width: containerWidth,
                marginHorizontal: isHome ? 0 : isGroup ? 5 : width * 0.01,
                borderRadius: isHome ? 0 : 10,
                overflow: "hidden",
                height: imageHeight, // Consistent height
                marginVertical: isHome ? (sources.length > 1 ? 0 : 20) : 0,
                marginRight: isHome && sources.length > 1 ? 20 : 0,
              }}
              onPress={() => {
                setImageIndex(index);
                setIsVisible(true);
              }}
            >
              {isLoading && (
                <View style={[styles.skeleton, { height: imageHeight }]}>
                  {blurhash && blurhash[index] ? (
                    <Blurhash
                      blurhash={blurhash[index]}
                      style={{
                        ...styles.media,
                        height: imageHeight,
                      }}
                    />
                  ) : (
                    <LinearGradient
                      colors={["#583da1", "#9a67ea"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[styles.skeleton, { height: imageHeight }]}
                    >
                      <ActivityIndicator size="large" color="#cccccc" />
                    </LinearGradient>
                  )}
                </View>
              )}
              <Image
                style={{
                  ...styles.media,
                  height: imageHeight, // Consistent height
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
                onLoad={(event) => handleImageLoadView(event, index)}
                recyclingKey={`image_${index}_${src}`} // Help with memory management
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
        {sources.length > 1 && (
          <View
            style={{
              flexDirection: "row",
              marginVertical: 10,
              alignSelf: "center",
            }}
          >
            {sources.map((_: any, index: number) => (
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
