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
import { Ionicons } from "@expo/vector-icons";
import { Blurhash } from "react-native-blurhash";
import { getImageDimensions } from "@/utils/ImageHelper";

const { width, height } = Dimensions.get("window");

// Constants - moved outside component to prevent recreating on each render
const ASPECT_RATIOS = {
  SQUARE: '1:1',
  PORTRAIT: '4:5',
  LANDSCAPE: '16:9'
} as const;

const TOLERANCE = {
  SQUARE: 0.1,
  PORTRAIT: 0.1,
  LANDSCAPE: 0.2
} as const;

// Instagram-like constants for image display
const MAX_IMAGE_HEIGHT = height * 0.75; // Maximum 75% of screen height (Instagram limit)
const MIN_IMAGE_HEIGHT = width * 0.6; // Minimum 60% of screen width (Instagram minimum)
const INSTAGRAM_MAX_ASPECT_RATIO = 1.91; // Instagram's max aspect ratio (landscape)
const INSTAGRAM_MIN_ASPECT_RATIO = 0.8; // Instagram's min aspect ratio (portrait)
const VIDEO_PROGRESS_INTERVAL = 2000;
const CLEANUP_DELAY = 1000;

// Instagram-like image dimension calculation
const getInstagramImageDimensions = (
  imgWidth: number, 
  imgHeight: number, 
  containerWidth: number
): { width: number; height: number } => {
  if (!imgWidth || !imgHeight) {
    return {
      width: containerWidth,
      height: containerWidth // Default to square if no dimensions
    };
  }

  let aspectRatio = imgWidth / imgHeight;
  
  // Constrain aspect ratio to Instagram limits
  if (aspectRatio > INSTAGRAM_MAX_ASPECT_RATIO) {
    aspectRatio = INSTAGRAM_MAX_ASPECT_RATIO;
  } else if (aspectRatio < INSTAGRAM_MIN_ASPECT_RATIO) {
    aspectRatio = INSTAGRAM_MIN_ASPECT_RATIO;
  }
  
  // Calculate height based on constrained aspect ratio
  let calculatedHeight = containerWidth / aspectRatio;
  
  // Apply Instagram's height constraints
  if (calculatedHeight > MAX_IMAGE_HEIGHT) {
    calculatedHeight = MAX_IMAGE_HEIGHT;
  } else if (calculatedHeight < MIN_IMAGE_HEIGHT) {
    calculatedHeight = MIN_IMAGE_HEIGHT;
  }
  
  return {
    width: containerWidth,
    height: Math.round(calculatedHeight)
  };
};

// Memoized helper functions
const getAspectRatio = (imgWidth: number, imgHeight: number): string => {
  const ratio = imgWidth / imgHeight;
  
  if (Math.abs(ratio - 1) <= TOLERANCE.SQUARE) return ASPECT_RATIOS.SQUARE;
  if (Math.abs(ratio - 0.8) <= TOLERANCE.PORTRAIT) return ASPECT_RATIOS.PORTRAIT;
  if (Math.abs(ratio - 1.777) <= TOLERANCE.LANDSCAPE) return ASPECT_RATIOS.LANDSCAPE;
  
  return ASPECT_RATIOS.PORTRAIT;
};

const getContainerWidth = (isHome: boolean, isGroup: boolean): number => {
  // Always return full width for images
  return width;
};

// Optimized image source creator
const createOptimizedImageSource = (src: string, containerWidth: number, imageHeight: number) => {
  if (!src) return null;
  
  const baseUrl = src.startsWith("file") ? src : ImageUrlConcated(src);
  
  // Add size parameters for better performance
  return {
    uri: `${baseUrl}?w=${Math.round(containerWidth)}&h=${Math.round(imageHeight)}&f=webp`,
    cache: 'memory-disk' as const,
  };
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
  display_height?: any;
}

// Separate optimized video component
const VideoPlayer = React.memo(({ 
  source, 
  isGroup, 
  onVideoReady, 
  onVideoError,
  onTogglePlay 
}: {
  source: any;
  isGroup: boolean;
  onVideoReady: (event: any) => void;
  onVideoError: (error: any) => void;
  onTogglePlay: () => void;
}) => {
  const videoRef = useRef<Video>(null);
  const isMountedRef = useRef(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasDecoderError, setHasDecoderError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [videoHeight, setVideoHeight] = useState(450);

  const setVideoRef = useVideoPlayerStore((state) => state.setVideoRef);
  const setIsPlay = useVideoPlayerStore((state) => state.setIsPlay);

  // Enhanced video source with fallback options
  const videoSource = useMemo(() => {
    const baseUri = typeof (source?.url || source) === "string"
      ? (source.url || source).startsWith("file")
        ? source.url || source
        : `https://cdn.qoneqt.com/${source.url || source}`
      : source.url || source;

    return {
      uri: baseUri,
      // Add these headers to help with decoder compatibility
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ExpoAV)',
        'Accept': 'video/mp4,video/webm,video/*',
      },
      // Force software decoding if hardware fails
      overrideFileExtensionAndroid: hasDecoderError ? 'mp4' : undefined,
    };
  }, [source, hasDecoderError]);

  const handleVideoError = useCallback((error: any) => {
    console.warn("Video error details:", error);

    // Check if it's a decoder initialization error
    const isDecoderError = error?.message?.includes('DecoderInitializationException') ||
                          error?.message?.includes('MediaCodecRenderer') ||
                          error?.message?.includes('Decoder init failed');

    if (isDecoderError && retryCount < 3) {
      console.log(`Decoder error detected, attempting retry ${retryCount + 1}/3`);
      
      setHasDecoderError(true);
      setRetryCount(prev => prev + 1);
      
      // Reset video state
      setIsVideoLoaded(false);
      setIsPlaying(false);
      setIsBuffering(false);
      
      // Retry loading the video after a short delay
      setTimeout(() => {
        if (videoRef.current && isMountedRef.current) {
          videoRef.current.loadAsync(videoSource, {}, false)
            .catch(retryError => {
              console.warn("Retry failed:", retryError);
              onVideoError(retryError);
            });
        }
      }, 1000);
    } else {
      // If not a decoder error or max retries reached, pass to parent
      onVideoError(error);
    }
  }, [retryCount, videoSource, onVideoError]);

  const handleVideoLoad = useCallback((status: any) => {
    setVideoHeight(status?.naturalSize?.height || 450);
    if (isMountedRef.current && status.isLoaded) {
      setIsVideoLoaded(true);
      setHasDecoderError(false);
      setRetryCount(0);
      onVideoReady?.(status);
    }
  }, [onVideoReady]);

  const cleanupVideo = useCallback(async () => {
    const currentVideoRef = videoRef.current;
    if (!currentVideoRef || !isMountedRef.current) return;

    try {
      const status = await currentVideoRef.getStatusAsync();
      
      if (!status.isLoaded) {
        if (isMountedRef.current) {
          setIsVideoLoaded(false);
          setIsPlaying(false);
          setIsPlay(false);
        }
        return;
      }

      await currentVideoRef.setOnPlaybackStatusUpdate(null);
      
      if (status.isPlaying) {
        await currentVideoRef.pauseAsync();
      }
      
      await currentVideoRef.unloadAsync();

      if (isMountedRef.current) {
        setIsVideoLoaded(false);
        setIsPlaying(false);
        setIsPlay(false);
      }
    } catch (error) {
      console.warn("Video cleanup error:", error);
      if (isMountedRef.current) {
        setIsVideoLoaded(false);
        setIsPlaying(false);
        setIsPlay(false);
      }
    }
  }, [setIsPlay]);

  const togglePlayPause = useCallback(async () => {
    if (!videoRef?.current || !isVideoLoaded || !isMountedRef.current) return;

    try {
      const status = await videoRef.current.getStatusAsync();
      
      if (!status.isLoaded) {
        console.warn("Video not loaded, cannot toggle play/pause");
        return;
      }
      
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
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


  // Show retry indicator when retrying
  if (hasDecoderError && retryCount > 0) {
    return (
      <View style={styles.bgMedia}>
        <View style={[styles.media, { height: 450, justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.text}>
            Retrying video... ({retryCount}/3)
          </Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={togglePlayPause}>
      <View>
        {(!isVideoLoaded) && source?.thumbnail && (
          <View style={styles.thumbnailView}>
            <Image
              source={{ uri: `https://cdn.qoneqt.com/${source.thumbnail}` }}
              style={styles.thumbnailImage}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          </View>
        )}
        <View style={styles.bgMedia}>
          <Video
            ref={videoRef}
            source={videoSource}
            style={[styles.media, { height: videoHeight }]}
            isLooping={false}
            resizeMode={ResizeMode.COVER}
            useNativeControls={false}
            shouldPlay={false}
            // Enhanced video configuration for better compatibility
            videoStyle={{
              // Force software decoding on problematic devices
              // hardwareAcceleration: hasDecoderError ? 'disabled' : 'auto',
            }}
            onLoadStart={() => {
              if (isMountedRef.current) {
                setIsVideoLoaded(false);
                setIsBuffering(true);
              }
            }}
            onLoad={handleVideoLoad}
            onError={handleVideoError}
            onReadyForDisplay={onVideoReady}
            progressUpdateIntervalMillis={VIDEO_PROGRESS_INTERVAL}
          />
          {(!isPlaying || !isVideoLoaded) && (
            <TouchableOpacity
              style={styles.playPauseButton}
              onPress={togglePlayPause}
              disabled={!isVideoLoaded}
            >
              <Ionicons
                name={isVideoLoaded ? "play" : isBuffering ? "hourglass" : "refresh"}
                size={32}
                color="white"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});

// Enhanced image component with better dimension handling
const ImageGallery = React.memo(({ 
  sources, 
  containerWidth, 
  imageHeight, 
  isHome, 
  isGroup, 
  blurhash,
  onImagePress,
  imageDimensions,
  display_height
}: {
  sources: string[];
  containerWidth: number;
  imageHeight: number;
  isHome: boolean;
  isGroup: boolean;
  blurhash: any[];
  onImagePress: (index: number) => void;
  imageDimensions: Array<{ width: number; height: number }>;
  display_height?: any;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);


  const handleScroll = useCallback((e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / containerWidth);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  }, [containerWidth, activeIndex]);

  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const renderImage = useCallback((src: string, index: number) => {
    const optimizedSource = createOptimizedImageSource(src, containerWidth, imageHeight);
    const height = sources?.length == 1 ? Array.isArray(display_height) ? display_height?.[index]?.height || 400 : 400: 400;
    return (
      <TouchableOpacity
        key={`${src}_${index}`}
        activeOpacity={1}
        style={[
          styles.imageContainer,
          {
            width: containerWidth,
            height: height,
            marginHorizontal: isHome ? 0 : isGroup ? 0 : width * 0.01,
          }
        ]}
        onPress={() => onImagePress(index)}
      >
        {isLoading && (
          <View style={[styles.skeleton, { height: height }]}>
            {blurhash?.[index] ? (
              <Blurhash
                blurhash={blurhash[index]}
                style={[styles.media, { height: height }]}
              />
            ) : (
              <LinearGradient
                colors={["#583da1", "#9a67ea"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.skeleton, { height: height }]}
              >
                <ActivityIndicator size="large" color="#cccccc" />
              </LinearGradient>
            )}
          </View>
        )}
        <Image
          style={[styles.media, { height: height }]}
          contentFit="cover" // Instagram always uses cover for consistent cropping
          source={
            hasError || !src
              ? require("./../assets/image/emptyPost.jpg")
              : optimizedSource
          }
          placeholder={blurhash?.[index] || ""}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={handleImageLoad}
          onError={handleImageError}
          recyclingKey={`image_${index}_${src}`}
          cachePolicy="memory-disk"
          priority={index < 2 ? "high" : "normal"}
          transition={200}
        />
      </TouchableOpacity>
    );
  }, [containerWidth, imageHeight, isHome, isGroup, blurhash, isLoading, hasError, onImagePress, handleImageLoad, handleImageError, sources.length, display_height]);

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={sources.length > 1}
        onScroll={handleScroll}
        pagingEnabled
        scrollEventThrottle={16}
        removeClippedSubviews={true}
      >
        {sources.map(renderImage)}
      </ScrollView>
      
      {sources.length > 1 && (
        <View style={styles.indicatorContainer}>
          {sources.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor: index === activeIndex
                    ? globalColors.neutralWhite
                    : globalColors.neutral2,
                }
              ]}
            />
          ))}
        </View>
      )}
    </>
  );
});

const MediaPost: FC<MediaPostProps> = ({
  source,
  type,
  isHome = false,
  isGroup = false,
  onPressView,
  blurhash = [],
  img_height = [],
  isCreatePost = false,
  display_height = [],
}) => {
  // Memoize sources array to prevent unnecessary re-renders
  const sources = useMemo(() => 
    Array.isArray(source) ? source : [source], 
    [source]
  );

  const [viewerState, setViewerState] = useState({
    visible: false,
    imageIndex: 0,
  });

  const [imageDimensions, setImageDimensions] = useState<
    Array<{ width: number; height: number }>
  >([]);

  // Memoized calculations
  const containerWidth = useMemo(() => 
    getContainerWidth(isHome, isGroup), 
    [isHome, isGroup]
  );

  // Instagram-like image height calculation
  const imageHeight = useMemo(() => {
    if (type !== "image") return 400;
    
    // For multiple images, calculate height based on the first image's dimensions
    // but apply to all (Instagram behavior for carousels)
    // if (imageDimensions.length > 0 && imageDimensions[0]) {
    //   const firstImageDimensions = imageDimensions[0];
    //   const instagramDimensions = getInstagramImageDimensions(
    //     firstImageDimensions.width,
    //     firstImageDimensions.height,
    //     containerWidth
    //   );
    //   return instagramDimensions.height;
    // }
    
    // If we have img_height prop, use it with Instagram constraints
    // if (img_height && img_height[0]) {
    //   const instagramDimensions = getInstagramImageDimensions(
    //     containerWidth,
    //     img_height[0],
    //     containerWidth
    //   );
    //   return instagramDimensions.height;
    // }
    
    // Default to square (Instagram's default)
    return containerWidth;
  }, [containerWidth, imageDimensions, type, img_height]);

  // Optimized image data memoization
  const imageData = useMemo(() => {
    if (type !== "image") return [];
    
    return sources.map((item) => ({
      uri: item?.startsWith("file") ? item : ImageUrlConcated(item),
    }));
  }, [sources, type]);

  // Effect to get image dimensions
  // useEffect(() => {
  //   if (type === "image" && sources.length > 0) {
  //     const loadImageDimensions = async () => {
  //       const dimensionPromises = sources.map(async (src, index) => {
  //         try {
  //           const dimensions = await getImageDimensions(`https://cdn.qoneqt.com/${src}`);
  //           return {
  //             width: dimensions.width,
  //             height: dimensions.height,
  //             aspectRatio: dimensions.width / dimensions.height
  //           };
  //         } catch (error) {
  //           return {
  //             width: containerWidth,
  //             height: MIN_IMAGE_HEIGHT,
  //             aspectRatio: 1
  //           };
  //         }
  //       });

  //       try {
  //         const dimensions = await Promise.all(dimensionPromises);
  //         setImageDimensions(dimensions);
  //       } catch (error) {
  //         console.warn("Error loading image dimensions:", error);
  //         // Set default dimensions (Instagram default behavior)
  //         setImageDimensions(sources.map(() => ({
  //           width: containerWidth,
  //           height: containerWidth // Square by default
  //         })));
  //       }
  //     };

  //     loadImageDimensions();
  //   }
  // }, [sources, type, img_height, containerWidth]);

  // Optimized handlers with useCallback
  const handleVideoReady = useCallback((event: any) => {
    try {
      const { naturalSize } = event;
      if (naturalSize?.height && naturalSize?.width) {
        const ratio = naturalSize.height / naturalSize.width;
        const newRatio = width * ratio;
        const calculatedHeight = newRatio * (newRatio > 300 ? 3 / 4 : 1);
        // Handle video ready
      }
    } catch (e) {
      console.warn("handleVideoReady error:", e);
    }
  }, []);

  const handleVideoError = useCallback((error: any) => {
    console.warn("Video error:", error);
  }, []);

  const handleImagePress = useCallback((index: number) => {
    setViewerState({ imageIndex: index, visible: true });
  }, []);

  const handleViewerClose = useCallback(() => {
    setViewerState(prev => ({ ...prev, visible: false }));
  }, []);

  // Render methods
  if (type === "image") {
    return (
      <View style={styles.container}>
        <ImageGallery
          sources={sources}
          containerWidth={containerWidth}
          imageHeight={imageHeight}
          isHome={isHome}
          isGroup={isGroup}
          blurhash={blurhash}
          onImagePress={handleImagePress}
          imageDimensions={imageDimensions}
          display_height={display_height}
        />
        
        <ImageView
          images={imageData}
          imageIndex={viewerState.imageIndex}
          visible={viewerState.visible}
          onRequestClose={handleViewerClose}
        />
      </View>
    );
  }

  if (type === "video") {
    return (
      <VideoPlayer
        source={source}
        isGroup={isGroup}
        onVideoReady={handleVideoReady}
        onVideoError={handleVideoError}
        onTogglePlay={() => {}}
      />
    );
  }

  // Fallback for unsupported types
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
};

const styles = StyleSheet.create({
  container: {
    marginTop: "1%",
    width: "100%", // Ensure container takes full width
  },
  imageContainer: {
    overflow: "hidden",
    width: "100%", // Ensure image container takes full width
  },
  indicatorContainer: {
    flexDirection: "row",
    marginVertical: 20,
    alignSelf: "center",
  },
  indicator: {
    height: 10,
    borderRadius: 10,
    width: 10,
    marginHorizontal: 5,
  },
  bgMedia: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
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
  thumbnailView: {
    position: "absolute",
    borderRadius: 24,
    padding: 8,
    width: width,
    height: 450,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
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