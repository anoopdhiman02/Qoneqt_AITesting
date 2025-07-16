import {
  ActivityIndicator,
  AppState,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ResizeMode, Video } from "expo-av";
import { globalColors } from "@/assets/GlobalColors";
import { useVideoPlayerStore } from "@/zustand/VideoPlayerStore";
import { Ionicons } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");
interface PostVideoProps {
  source?: any;
  type?: any;
  isGroup?: boolean;
  isHome?: boolean;
}

const PostVideo = ({ source, type, isGroup, isHome }: PostVideoProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<Video>(null);
  const [hasError, setHasError] = useState(false);
  const [mediaHeight, setMediaHeight] = useState(400);
  const setVideoRef = useVideoPlayerStore((state) => state.setVideoRef);
  const setIsPlay = useVideoPlayerStore((state) => state.setIsPlay);
  const isPlay = useVideoPlayerStore((state) => state.isPlay);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (
          nextAppState !== "active" &&
          videoRef.current?.pauseAsync &&
          isPlay
        ) {
          try {
            await videoRef.current.pauseAsync();
            setIsPlaying(false);
            setIsPlay(false);
          } catch (e) {
            console.warn("Pause error:", e.message);
          }
        }
      }
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (videoRef?.current) {
      setVideoRef(videoRef.current);
      videoRef.current?.setOnPlaybackStatusUpdate((status: any) => {
        if (status.isLoaded) {
          setIsPlay(status.isPlaying);
          setIsPlaying(status.isPlaying);
        } else {
          setIsPlay(false);
          setIsPlaying(false);
        }
        setIsBuffering(status.isBuffering);
      });

      return () => {
        try {
          videoRef?.current?.setOnPlaybackStatusUpdate(null);
          videoRef?.current?.unloadAsync?.(); // Prevent leaked ref
        } catch (err) {
          console.warn("Cleanup error:", err.message);
        }
      };
    }
  }, []);

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current?.pauseAsync();
      setIsPlaying(false);
      setIsPlay(false);
    } else {
      videoRef.current?.playAsync();
      setIsPlaying(true);
      setIsPlay(true);
    }
  };
  const handleVideoReady = (event: any) => {
    try {
      const { naturalSize } = event;
      const displayWidth = width;
      if (naturalSize && naturalSize.height && naturalSize.width) {
        const ratio = naturalSize.height / naturalSize.width;
        const newRatio = displayWidth * ratio;
        const manageHeight = newRatio * (newRatio > 300 ? 3 / 4 : 1);
        setMediaHeight(manageHeight);
      }
    } catch (e) {
      console.log("handleVideoReady", e);
    }
  };

  if (type === "video") {
    return (
      <TouchableWithoutFeedback onPress={togglePlayPause}>
        <View>
          {isLoading && !isBuffering && (
            <View style={styles.playPauseButton}>
              <ActivityIndicator size="large" color="#cccccc" />
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
                width: isHome
                  ? width * 0.92
                  : isGroup
                  ? width * 0.65
                  : width * 0.98,
                marginHorizontal: isHome
                  ? width * 0.01
                  : isGroup
                  ? 1
                  : width * 0.01,
                borderRadius: 11,
                height: isGroup ? 400 : mediaHeight,
              }}
              isLooping
              useNativeControls
              resizeMode={ResizeMode.COVER}
              // shouldPlay={false}
              onLoadStart={() => setIsLoading(true)}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              onPlaybackStatusUpdate={(status) => {
                if (!status?.isLoaded) return;

                if (
                  status.didJustFinish &&
                  videoRef.current?.setPositionAsync &&
                  videoRef.current?.playAsync
                ) {
                  videoRef.current
                    .setPositionAsync(0)
                    .then(() => videoRef.current?.playAsync())
                    .then(() => {
                      setIsPlaying(true);
                      setIsPlay(true);
                    })
                    .catch((e) => console.warn("Replay error:", e.message));
                }

                setIsBuffering(status.isBuffering);
              }}
              onReadyForDisplay={handleVideoReady}
            />
            {!isPlaying && (
                  <TouchableOpacity
                          style={styles.playPauseButton}
                          onPress={togglePlayPause}
                        >
                          <Ionicons name="play" size={32} color="white" />
                        </TouchableOpacity>
                  )}
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

export default PostVideo;

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
