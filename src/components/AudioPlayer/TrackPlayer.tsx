import React, { useEffect, useRef, useState, FC, useCallback } from "react";
import { View, Image, TouchableOpacity, Text, Animated, AppState } from "react-native";
import TrackPlayer, {
  State,
  useProgress,
  Event,
  useTrackPlayerEvents,
  usePlaybackState,
} from "react-native-track-player";

import { useAudioStore } from "@/zustand/AudioPlayerStore";
import { ZoomIn } from "react-native-reanimated";

interface TrackPlayerProps {
  Type?: string;
  id?: string;
  isPlaying?: boolean;
  setCurrentPlaying?: (id: string) => void;
  isCreatePost?: boolean;
}

const AudioPlayer2: FC<TrackPlayerProps> = ({
  Type,
  id,
  isPlaying,
  setCurrentPlaying,
  isCreatePost,
}) => {
  const { position, duration } = useProgress();
  const { state } = usePlaybackState();
  const [isTrackReady, setIsTrackReady] = useState(false);
  const [waveData, setWaveData] = useState<number[]>(Array(30).fill(10));
  const animatedValues = useRef(
    waveData.map(() => new Animated.Value(10))
  ).current;
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);
  const [isThisPlaying, setIsThisPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    setupTrackPlayer();
  }, [Type, id]);


  useEffect(() => {
    if (!isPlaying) {
      setIsPaused(true);
      stopAudio();
    } else if (isPaused) {
      setIsPaused(false);
      trackPlay();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (state === State.Playing && duration > 0 && currentlyPlayingId === id) {
      const updateWave = () => {
        const newWaveData = waveData.map(() => {
          const randomFactor = Math.random() * 1.5 + 0.5;
          const progress = position / duration;
          return Math.max(10, Math.min(50, 40 * progress * randomFactor + 10));
        });

        newWaveData.forEach((height, index) => {
          Animated.timing(animatedValues[index], {
            toValue: height,
            duration: 50,
            useNativeDriver: false,
          }).start();
        });

        setWaveData(newWaveData);
      };

      const intervalId = setInterval(updateWave, 100);
      return () => clearInterval(intervalId);
    } else if (state !== State.Playing) {
      // Reset wave when not playing
      animatedValues.forEach((value) => value.setValue(10));
      setWaveData(Array(30).fill(10));
    }
  }, [position, state, duration, currentlyPlayingId]);

  // Refs for cleanup and memory management
  const isMountedRef = useRef(true);
  const waveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef(AppState.currentState);

  // Cleanup function for animations and intervals
  const cleanupAnimations = useCallback(() => {
    if (waveIntervalRef.current) {
      clearInterval(waveIntervalRef.current);
      waveIntervalRef.current = null;
    }
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    // Reset wave animations
    animatedValues.forEach((value) => {
      value.stopAnimation();
      value.setValue(10);
    });
  }, []);
  // Cleanup function for TrackPlayer
  const cleanupTrackPlayer = useCallback(async () => {
    try {
      cleanupAnimations();
      const currentState = (await TrackPlayer.getPlaybackState()).state;
      if (currentState !== State.None && currentState !== State.Stopped) {
        await TrackPlayer.stop();
      }
      // Only reset if this is the current track
      if (currentlyPlayingId === id) {
        await TrackPlayer.reset();
      }
      if (isMountedRef.current) {
        setIsTrackReady(false);
        setIsThisPlaying(false);
        setIsPaused(false);
        setCurrentlyPlayingId(null);
      }
    } catch (error) {
      console.warn("Cleanup error:", error);
    }
  }, [id, currentlyPlayingId, cleanupAnimations]);

   // AppState listener for background handling
   useEffect(() => {
    const subscription = AppState.addEventListener("change", async (nextAppState) => {
      appStateRef.current = nextAppState;
      
      if (nextAppState === "background" || nextAppState === "inactive") {
        // Stop audio and cleanup when app goes to background
        if (isThisPlaying && currentlyPlayingId === id) {
          try {
            await TrackPlayer.pause();
            cleanupAnimations();
            if (isMountedRef.current) {
              setIsPaused(true);
              setIsThisPlaying(false);
            }
          } catch (error) {
            console.warn("Background pause error:", error);
          }
        }
      }
    });

    return () => subscription.remove();
  }, [isThisPlaying, currentlyPlayingId, id, cleanupAnimations]);

  const trackPlay = async () => {
    if (!isTrackReady) return;
    setIsThisPlaying(true);
    setCurrentlyPlayingId(id);
    await TrackPlayer.play();
  };

  const stopAudio = async () => {
    setIsThisPlaying(false);
    setCurrentlyPlayingId(null);
    await TrackPlayer.stop();
  };

  const setupTrackPlayer = async () => {
    if (Type && id) {
      await TrackPlayer.reset();

      let url = Type;

      if (Type.startsWith("content://")) {
        url = Type;
      } else if (Type.startsWith("file://") || Type.startsWith("/")) {
        url = Type;
      } else {
        url = `https://cdn.qoneqt.com/${Type}`;
      }


      try {
        await TrackPlayer.add({
          id,
          url,
          title: "Audio Track",
          artist: "User Upload",
        });
        setIsTrackReady(true);
      } catch (error) {
        console.error("Error setting up track player:", error);
      }
    }
  };

  const playAudio = async () => {
    try{
    const currentState = (await TrackPlayer.getPlaybackState()).state;

    if (currentState === State.Stopped) {
      const url =
        Type.startsWith("file://") || Type.startsWith("/")
          ? Type
          : `https://cdn.qoneqt.com/${Type}`;
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id,
        url,
        title: "Track Title",
        artist: "Track Artist",
      });
    }

    await TrackPlayer.play();
    setIsPaused(false);
    setCurrentPlaying(id);
    setCurrentlyPlayingId(id);
    setIsThisPlaying(true);
    }catch(error){
      console.log("Error playing audio:", error);
    }
  };

  const pauseAudio = async () => {
    setIsPaused(true);
    setIsThisPlaying(!isThisPlaying);
    setCurrentPlaying(null);
    await TrackPlayer.pause();
  };

  const onSeek = async (value) => {
    await TrackPlayer.seekTo(value);
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  useTrackPlayerEvents([Event.PlaybackQueueEnded], async () => {
    await TrackPlayer.stop();
    if (currentlyPlayingId === id) {
      setCurrentlyPlayingId(null);
      setIsThisPlaying(false);
      animatedValues.forEach((value) => value.setValue(10));
      setWaveData(Array(30).fill(10));
    }
  });

  const onPlaybackStateChange = async () => {
    console.log("isThisPlaying", isThisPlaying);
    if(isThisPlaying ) {
      pauseAudio()
    }
    else{
      playAudio()
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",

        alignSelf: "center",

        padding: 10,
        borderWidth: isCreatePost
          ? 0
          : Type?.startsWith("file://") || Type?.startsWith("/")
          ? 0
          : 0.5,
        borderColor: "grey",
        borderRadius: 25,
        margin: Type?.startsWith("file://") || Type?.startsWith("/") ? 0 : 10,
      }}
    >
      <View style={{ flex: 0.2, justifyContent: "center" }}>
        <TouchableOpacity
          onPress={()=>onPlaybackStateChange()}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Image
            style={{ width: 25, height: 25 }}
            source={
              isThisPlaying && !isPaused
                ? require("./../../../src/assets/image/pause.png")
                : require("./../../../src/assets/image/play.png")
            }
          />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, justifyContent: "center" }}>
        <View style={{ padding: 6 }} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: 50,
            gap: 2,
          }}
        >
          {animatedValues.map((value, index) => (
            <Animated.View
              key={index}
              style={{
                width: "2%",
                height: value,
                backgroundColor: "white",
                borderRadius: 2,
                opacity: isThisPlaying && !isPaused ? 1 : 0.5,
              }}
            />
          ))}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "white", fontSize: 12 }}>
            {formatTime(position)}
          </Text>
          <Text style={{ color: "white", fontSize: 12 }}>
            {formatTime(duration)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AudioPlayer2;
