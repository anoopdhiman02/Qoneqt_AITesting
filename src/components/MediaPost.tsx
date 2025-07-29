import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  FC,
  useMemo,
} from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
  ScrollView,
  AppState,
  TouchableWithoutFeedback,
} from "react-native";
import { ResizeMode, Video } from "expo-av";
import { ImageUrlConcated } from "../utils/ImageUrlConcat";
import { LinearGradient } from "expo-linear-gradient";
import { globalColors } from "@/assets/GlobalColors";
import { Image } from "expo-image";
import ImageView from "react-native-image-viewing";
import { useVideoPlayerStore } from "@/zustand/VideoPlayerStore";
const { width, height } = Dimensions.get("window");
import { Ionicons } from "@expo/vector-icons";
import { Blurhash } from "react-native-blurhash";

// Helper function to determine aspect ratio from image dimensions
const getAspectRatio = (imgWidth: number, imgHeight: number) => {
  const ratio = imgWidth / imgHeight;
  
  // 1:1 ratio (tolerance of 0.1)
  if (Math.abs(ratio - 1) <= 0.1) return '1:1';
  
  // 4:5 ratio (0.8) (tolerance of 0.1)
  if (Math.abs(ratio - 0.8) <= 0.1) return '4:5';
  
  // 16:9 ratio (1.777) (tolerance of 0.2)
  if (Math.abs(ratio - 1.777) <= 0.2) return '16:9';
  
  // Default to 4:5 for other ratios
  return '4:5';
};

// Get height based on aspect ratio and container width
const getHeightForRatio = (containerWidth: number, aspectRatio: string) => {
  switch (aspectRatio) {
    case '1:1':
      return containerWidth; // Square
    case '4:5':
      return containerWidth * 1.25; // Height is 1.25x width
    case '16:9':
      return containerWidth * 0.5625; // Height is 0.5625x width
    default:
      return containerWidth * 1.25; // Default to 4:5
  }
};


interface MediaPostProps {
  source?: any;
  type?: "image" | "video" | "audio";
  isHome?: boolean;
  isGroup?: boolean;
  onPressView?: () => void;
  blurhash?: any;
  img_height?: any;
  isCreatePost?: boolean;
}

const MediaPost: FC<MediaPostProps> = ({
  source,
  type,
  isHome,
  isGroup,
  onPressView,
  blurhash = [],
  img_height = [],
  isCreatePost = false,
}) => {
  const sources = Array.isArray(source) ? source : [source];
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [visible, setIsVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mediaHeight, setMediaHeight] = useState(400);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const videoRef = useRef(null);
  const isMountedRef = useRef(true);
  const cleanupTimeoutRef = useRef(null);

  const setVideoRef = useVideoPlayerStore((state) => state.setVideoRef);
  const setIsPlay = useVideoPlayerStore((state) => state.setIsPlay);
  const isPlay = useVideoPlayerStore((state) => state.isPlay);

  const [imageDimensions, setImageDimensions] = useState<
    Array<{ width: number; height: number }>
  >([]);

  // Calculate container width based on context
  const containerWidth = useMemo(() => {
    if (isHome) return width;
    if (isGroup) return width * 0.65;
    return width * 0.94;
  }, [isHome, isGroup]);

  // Determine the display aspect ratio for images
  const displayAspectRatio = useMemo(() => {
    if (type !== "image" || imageDimensions.length === 0) {
      return "4:5"; // Default while loading
    }

    if (sources.length === 1 && imageDimensions[0]) {
      // Single image: use its actual aspect ratio
      const { width: imgWidth, height: imgHeight } = imageDimensions[0];
      return getAspectRatio(imgWidth, imgHeight);
    }

    if (sources.length > 1 && imageDimensions.length === sources.length) {
      // Multiple images: check if all have same aspect ratio
      const ratios = imageDimensions.map((dim) =>
        getAspectRatio(dim.width, dim.height)
      );
      const uniqueRatios = Array.from(new Set(ratios));

      if (uniqueRatios.length === 1) {
        // All images have same aspect ratio
        return uniqueRatios[0];
      } else {
        // Different aspect ratios: default to 4:5
        return "4:5";
      }
    }

    return "4:5"; // Default
  }, [sources, imageDimensions, type]);

  // Calculate consistent height for images
  const imageHeight = useMemo(() => {
    if (type !== "image") return 400; // Not used for non-images
    const calculatedHeight = getHeightForRatio(
      containerWidth,
      displayAspectRatio
    );
    // Cap height at 600px
    return Math.min(calculatedHeight, 600);
  }, [containerWidth, displayAspectRatio, type]);

  // Cleanup function to properly unload video
  const cleanupVideo = useCallback(async () => {
    if (videoRef.current) {
      try {
        // Remove status update listener first
        videoRef.current.setOnPlaybackStatusUpdate(null);

        // Stop and unload the video
        await videoRef.current.stopAsync();
        await videoRef.current.unloadAsync();

        // Clear the ref
        if (isMountedRef.current) {
          setIsVideoLoaded(false);
          setIsPlaying(false);
          setIsPlay(false);
        }
      } catch (error) {
        console.warn("Video cleanup error:", error);
      }
    }
  }, [setIsPlay]);

  // Enhanced AppState listener with proper cleanup
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (nextAppState !== "active" && videoRef.current && isPlay) {
          try {
            await videoRef.current.pauseAsync();
            if (isMountedRef.current) {
              setIsPlaying(false);
              setIsPlay(false);
            }
          } catch (e) {
            console.warn("Pause error:", e.message);
          }
        }

        // Unload video when app goes to background to free memory
        if (nextAppState === "background" && type === "video") {
          cleanupTimeoutRef.current = setTimeout(() => {
            cleanupVideo();
          }, 1000); // Delay to avoid immediate cleanup if user returns quickly
        }

        // Cancel cleanup if user returns quickly
        if (nextAppState === "active" && cleanupTimeoutRef.current) {
          clearTimeout(cleanupTimeoutRef.current);
          cleanupTimeoutRef.current = null;
        }
      }
    );

    return () => {
      subscription.remove();
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
    };
  }, [isPlay, type, cleanupVideo]);

  // Enhanced video ref management with proper cleanup
  useEffect(() => {
    if (type === "video" && videoRef?.current) {
      setVideoRef(videoRef.current);

      const statusUpdateCallback = (status) => {
        if (!isMountedRef.current) return;

        if (status.isLoaded) {
          setIsVideoLoaded(true);
          setIsPlay(status.isPlaying);
          setIsPlaying(status.isPlaying);
          setIsBuffering(status.isBuffering || false);
        } else {
          setIsVideoLoaded(false);
          setIsPlay(false);
          setIsPlaying(false);
        }
      };

      videoRef.current.setOnPlaybackStatusUpdate(statusUpdateCallback);

      return () => {
        cleanupVideo();
      };
    }
  }, [type, setVideoRef, setIsPlay, cleanupVideo]);

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
      if (type === "video") {
        cleanupVideo();
      }
    };
  }, [type, cleanupVideo]);

  const togglePlayPause = useCallback(async () => {
    if (!videoRef?.current || !isVideoLoaded) return;
  
    try {
      // Get current status to check position
      const status = await videoRef.current.getStatusAsync();
      
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        // If video is at the end, seek to beginning before playing
        if (status.positionMillis && status.durationMillis && 
            status.positionMillis >= status.durationMillis) {
          await videoRef.current.setPositionAsync(0);
        }
        await videoRef.current.playAsync();
      }
  
      if (isMountedRef.current) {
        const newPlayingState = !isPlaying;
        setIsPlay(newPlayingState);
        setIsPlaying(newPlayingState);
      }
    } catch (e) {
      console.warn("Toggle play/pause error:", e);
    }
  }, [isPlaying, isVideoLoaded, setIsPlay]);

  const handleLayout = useCallback(
    (event) => {
      const { y } = event.nativeEvent.layout;
      const centerY = height / 2;

      if (y < centerY - 100 || y > centerY + 100) {
        if (isPlaying && videoRef.current && isPlay) {
          videoRef.current.pauseAsync().catch(console.warn);
          if (isMountedRef.current) {
            setIsPlaying(false);
            setIsPlay(false);
          }
        }
      }
    },
    [isPlaying, isPlay, setIsPlay]
  );

  const handleVideoReady = useCallback((event: any) => {
    if (!isMountedRef.current) return;

    try {
      const { naturalSize } = event;
      const displayWidth = width;
      if (naturalSize && naturalSize.height && naturalSize.width) {
        const ratio = naturalSize.height / naturalSize.width;
        const newRatio = displayWidth * ratio;
        const manageHeight = newRatio * (newRatio > 300 ? 3 / 4 : 1);
        setMediaHeight(Math.min(manageHeight, 600) + 20); // Cap height to prevent excessive memory usage
      }
    } catch (e) {
      console.warn("handleVideoReady error:", e);
    }
  }, []);

  // const handleImageLoadView = useCallback((event) => {
  //   if (!isMountedRef.current) return;

  //   try {
  //     setIsLoading(false);
  //     const { width: imgW, height: imgH } = event.source;
  //     const displayWidth = isHome ? width * 0.98 : isGroup ? width * 0.65 : width * 0.98;
  //     const ratio = imgH / imgW;
  //     const manageHeight = displayWidth * ratio * ((displayWidth * ratio) > 300 ? 3 / 4 : 1);
  //     setMediaHeight(Math.min(manageHeight, 600)); // Cap height
  //   } catch (e) {
  //     console.warn("handleImageLoadView error:", e);
  //   }
  // }, [isHome, isGroup]);

  // Update your handleImageLoadView function:
  const handleImageLoadView = useCallback(
    (event, index?: number) => {
      if (!isMountedRef.current) return;

      try {
        setIsLoading(false);
        const { width: imgW, height: imgH } = event.source;

        if (type === "image" && typeof index === "number") {
          // Store dimensions for this image
          setImageDimensions((prev) => {
            const newDimensions = [...prev];
            newDimensions[index] = { width: imgW, height: imgH };
            return newDimensions;
          });
        } else {
          // For non-image types, keep the old logic
          const displayWidth = isHome
            ? width * 0.98
            : isGroup
            ? width * 0.65
            : width * 0.98;
          const ratio = imgH / imgW;
          const manageHeight =
            displayWidth * ratio * (displayWidth * ratio > 300 ? 3 / 4 : 1);
          setMediaHeight(Math.min(manageHeight, 600));
        }
      } catch (e) {
        console.warn("handleImageLoadView error:", e);
      }
    },
    [isHome, isGroup, type]
  );

  const handleImageError = useCallback(() => {
    if (isMountedRef.current) {
      setIsLoading(false);
      setHasError(true);
    }
  }, []);

  const handleVideoError = useCallback(
    (error) => {
      console.warn("Video error:", error);
      if (isMountedRef.current) {
        setIsLoading(false);
        setHasError(true);
        setIsVideoLoaded(false);
      }
      // Attempt cleanup on error
      cleanupVideo();
    },
    [cleanupVideo]
  );

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
      <View style={{ marginTop: "1%" }}>
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
          {sources.map((src, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={1}
              style={{
                width: containerWidth,
                marginHorizontal: isHome ? 0 : isGroup ? 0 : width * 0.01,
                height: imageHeight, // Consistent height
                overflow: "hidden",
                // marginRight: isHome ? (sources.length > 1 ? 20 : 0) : 0,
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
                placeholder={blurhash?.[index] || ""}
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => setIsLoading(false)}
                onError={handleImageError}
                onLoad={(event) => handleImageLoadView(event, index)}
                recyclingKey={`image_${index}_${src}`}
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
  } else if (type === "video") {
    const screenHeight = Dimensions.get("window").height;
    const videoHeight = isGroup ? 400 : screenHeight - 200;
    return (
      <TouchableWithoutFeedback onPress={togglePlayPause}>
        <View
          onLayout={handleLayout}
          // style={{ borderWidth: 1, borderColor: "white" }}
        >
          {(isLoading || !isVideoLoaded) && (
            <View style={styles.thumbnailView}>
              {source?.thumbnail ? (
                <Image
                  source={{ uri: `https://cdn.qoneqt.com/${source.thumbnail}` }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              ) : (
                <ActivityIndicator size="large" color="#cccccc" />
              )}
            </View>
          )}
          <View style={styles.bgMedia}>
            <Video
              ref={videoRef}
              source={{
                uri:
                  typeof (source?.url || source) === "string"
                    ? (source.url || source).startsWith("file")
                      ? source.url || source
                      : `https://cdn.qoneqt.com/${source.url || source}`
                    : source.url || source,
              }}
              style={{
                ...styles.media,
                height: isGroup ? 400 : Math.min(mediaHeight, 500),
              }}
              isLooping={false} // Disable looping to reduce memory pressure
              resizeMode={ResizeMode.COVER}
              useNativeControls={false} // Use custom controls for better memory management
              shouldPlay={false}
              onLoadStart={() => {
                if (isMountedRef.current) {
                  setIsLoading(true);
                  setHasError(false);
                }
              }}
              onLoad={() => {
                if (isMountedRef.current) {
                  setIsLoading(false);
                  setIsVideoLoaded(true);
                }
              }}
              onError={handleVideoError}
              onPlaybackStatusUpdate={(status) => {
                if (!isMountedRef.current || !status?.isLoaded) return;

                // Handle end of video
                if (status.didJustFinish && videoRef.current) {
                  // Seek back to beginning and pause
                  videoRef.current.setPositionAsync(0).then(() => {
                    return videoRef.current.pauseAsync();
                  }).catch(console.warn);
                  
                  if (isMountedRef.current) {
                    setIsPlaying(false);
                    setIsPlay(false);
                  }
                }
              
                if (isMountedRef.current) {
                  setIsBuffering(status.isBuffering || false);
                }
              }}
              onReadyForDisplay={handleVideoReady}
              progressUpdateIntervalMillis={1000} // Reduce update frequency
            />
            {(!isPlaying || !isVideoLoaded) && (
              <TouchableOpacity
                style={styles.playPauseButton}
                onPress={togglePlayPause}
                disabled={!isVideoLoaded}
              >
                <Ionicons
                  name={isVideoLoaded ? "play" : "hourglass"}
                  size={32}
                  color="white"
                />
              </TouchableOpacity>
            )}
            {/* {isBuffering && isVideoLoaded && (
              <View style={styles.bufferingIndicator}>
                <ActivityIndicator size="small" color="white" />
              </View>
            )} */}
          </View>
        </View>
      </TouchableWithoutFeedback>
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

const styles = StyleSheet.create({
  bgMedia: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // marginHorizontal: "2%",
  },
  media: {
    width: "100%",
    // borderRadius: 11,
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
  bufferingIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    padding: 5,
  },
  thumbnailView: {
    position: "absolute",
    borderRadius: 24,
    padding: 8,
    width: width,
    height: 400,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
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

export default React.memo(MediaPost);