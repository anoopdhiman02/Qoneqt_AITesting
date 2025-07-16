import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image } from "expo-image";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  Linking,
  FlatList,
  TouchableWithoutFeedback,
  Modal,
  Animated,
  ActivityIndicator,
  Alert,
} from "react-native";
import Track_Player from "@/components/AudioPlayer/TrackPlayer";
import TextInputComponent from "../../../components/element/TextInputComponent";
import GoBackNavigation from "../../../components/Header/GoBackNavigation";
import BottomSheetWrap from "../../../components/bottomSheet/BottomSheetWrap";
import { ClearChatIcon } from "@/assets/DarkIcon";
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
} from "react-native-audio-recorder-player";
import useCreatePostViewModel from "@/viewModels/CreatePostViewModel";
import { globalColors } from "@/assets/GlobalColors";
import ViewWrapper from "@/components/ViewWrapper";
import { useCameraPermission } from "react-native-vision-camera";
import GroupCardComponent from "./component/GroupCardComponent";
import RNFetchBlob from "rn-fetch-blob";
import {
  useAudioStore,
  userShowIsRecording,
  userShowModal,
  userShowRecordingStopped,
} from "@/zustand/AudioPlayerStore";
import MediaPost from "@/components/MediaPost";
import { ZoomIn } from "react-native-reanimated";
import TrackPlayer, { State } from "react-native-track-player";
import { useAppSelector } from "@/utils/Hooks";
import BottomViewComponent from "./post/component/BottomViewComponent";
import AddModalViewComponent from "./post/component/AddModalViewComponent";
import { requestMicrophonePermission } from "@/utils/PermissionHook";
import { useVideoPlayerStore } from "@/zustand/VideoPlayerStore";
import useKeyboardVisible from "@/app/hooks/useKeyboardVisible";
import { usePostDetailStore } from "@/zustand/PostDetailStore";
import { BASE_URL, R2_PUBLIC_URL } from "@/utils/constants";

const { width } = Dimensions.get("window");

// Memoized components for better performance
const MemoizedGroupCard = React.memo(GroupCardComponent);
const MemoizedMediaPost = React.memo(MediaPost);
import { useScreenTracking } from "@/customHooks/useAnalytics";

const CreatePostScreen = () => {
  // Hooks - FIXED: Stable references
  useScreenTracking("CreatePostScreen");
  const createPostViewModel = useCreatePostViewModel();
  const {
    MyGroupRef,
    onChangeCaptionHandler,
    onPressCamera,
    onPressGallary,
    onPressGroup,
    Document_Picker,
    onSubmitPostHandler,
    setSelectedVideo,
    setAudio,
    onSelectGroupHandler,
    onSubmitHomePostHandler,
    onSearchGroup,
    selectedGroup,
    loaded,
    desc,
    setDownloadedAudio,
    onClearImageHandler,
    downloadedAudio,
    selectedvideo,
    multiSelectImages,
    setMultiSelectImages,
    videoUri,
    setVideoUri,
    audio,
    setSelectedGroup
  } = createPostViewModel;
const {
    setPostValue,
    postValue,
  } = usePostDetailStore();
  const { hasPermission, requestPermission } = useCameraPermission();
  const { recordingPath, setRecordingPath } = useAudioStore();
  const { recordingStopped, setRecordingStopped } = userShowRecordingStopped();
  const { isRecording, setIsRecording } = userShowIsRecording();
  const { isAddModalVisible, setIsAddModalVisible } = userShowModal();

  // Redux selectors - FIXED: Specific selectors
  const searchGroupResponse = useAppSelector((state) => state.searchGroupListData);
  const submitPostResponse = useAppSelector((state) => state?.createPostData);
  
  // Video store - FIXED: Use selector pattern
  const videoRef = useVideoPlayerStore((state) => state.videoRef);
  const isVideoPlaying = useVideoPlayerStore((state) => state.isPlay);

  // Local state
  const [waveData, setWaveData] = useState<number[]>([0]);
  const [displayWaveData, setDisplayWaveData] = useState<number[]>([0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerId, setPlayerId] = useState(0);
  const [trackPlayerReady, setTrackPlayerReady] = useState(false);
  const [audioData, setAudioData] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  // Refs
  const inputRef = useRef<TextInput>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false);
  const waveRef = useRef({ data: [0], isRecording: false });
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  const keyboardVisible = useKeyboardVisible();
  const [lineCount, setLineCount] = useState(1);
  

  const onStartRecord = useCallback(async () => {
    try {
      const dirs = RNFetchBlob.fs.dirs;
      const newpath = Platform.select({
        ios: undefined,
        android: `${dirs.CacheDir}/hello.mp3`,
      });
  
      audioRecorderPlayer.setSubscriptionDuration(0.1);
  
      const path = await audioRecorderPlayer.startRecorder(
        newpath,
        {
          AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
          AudioSourceAndroid: AudioSourceAndroidType.MIC,
          AVModeIOS: AVModeIOSOption.measurement, // Changed from measurement to spokenAudio
          AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
          AVNumberOfChannelsKeyIOS: 2,
          AVFormatIDKeyIOS: AVEncodingOption.aac,
          AVSampleRateKeyIOS: 22050, // Add sample rate
        },
        true
      );
      // const path = await audioRecorderPlayer.startRecorder(audioPath);
  
      setRecordingPath(path);
      setRecordingStopped(false);
      waveRef.current.isRecording = true;
      setWaveData([0]);
      setDisplayWaveData([0]);
      setIsRecording(true);
  
      audioRecorderPlayer.addRecordBackListener((e) => {
        if (waveRef.current.isRecording && e.currentMetering) {
          const newValue = (e.currentMetering + 70) * 1.2;
          const newData = [
            ...waveRef.current.data,
            Math.max(10, Math.min(50, newValue)),
          ];
          if (newData.length > 50) newData.shift();
          waveRef.current.data = newData;
          setWaveData(newData);
        }
      });
    } catch (error) {
      console.log("Error starting recorder:", error);
      Alert.alert("Recording Error", "Failed to start recording. Please try again.");
      // Reset state on error
      setIsRecording(false);
      setRecordingStopped(true);
    }
  }, [setRecordingPath, setRecordingStopped, setIsRecording]);

  const onStopRecord = useCallback(async () => {
    try {
      if (!isRecording) return;
      
      console.log("Stopping recording...");
      setPlayerId(0);
      waveRef.current.isRecording = false;
      
      // Remove listener first
      try {
        await audioRecorderPlayer.removeRecordBackListener();
      } catch (listenerError) {
        console.log("Error removing listener:", listenerError);
      }
      
      // Stop recording with timeout
      const result: any = await Promise.race([
        audioRecorderPlayer.stopRecorder(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Stop recording timeout')), 1000)
        )
      ]);
      setIsRecording(false);
      setRecordingStopped(true);
      setWaveData([0]);
      setDisplayWaveData([0]);
      waveRef.current.data = [0];
      setRecordingPath(result);
      
    } catch (error) {
      console.log("Error stopping recorder:", error);
      // Force reset state even on error
      setIsRecording(false);
      setRecordingStopped(true);
      setWaveData([0]);
      setDisplayWaveData([0]);
      waveRef.current.data = [0];
    }
  }, [isRecording, setIsRecording, setRecordingStopped, setRecordingPath]);

  const onStartPlay = useCallback(async () => {
    if (!recordingPath) {
      console.log("No recorded file available to play.");
      return;
    }
  
    try {
      // Stop any existing playback first
      try {
        await audioRecorderPlayer.stopPlayer();
        await audioRecorderPlayer.removePlayBackListener();
      } catch (stopError) {
        console.log("Error stopping existing player:", stopError);
      }
  
      // Small delay to ensure previous operations complete
      await new Promise(resolve => setTimeout(resolve, 200));
  
      // Validate file path
      let playbackPath = recordingPath;
      if (Platform.OS === 'ios' && !recordingPath.startsWith('file://')) {
        playbackPath = `file://${recordingPath}`;
      }
  
      console.log("Formatted playback path:", playbackPath);
  
      setPlayerId(1);
      const msg = await audioRecorderPlayer.startPlayer(playbackPath);
      console.log("Playback started:", msg);
      setIsPlaying(true);
  
      audioRecorderPlayer.addPlayBackListener((e) => {
        console.log("Playback progress:", e.currentPosition, "/", e.duration);
        if (e.currentPosition === e.duration && e.duration > 0) {
          console.log("Playback completed");
          onStopPlay();
        }
      });
      
    } catch (error) {
      console.log("Playback error details:", {
        message: error.message,
        code: error.code,
        domain: error.domain,
        recordingPath: recordingPath,
        platform: Platform.OS
      });
      
      // Try alternative approach for iOS
      if (Platform.OS === 'ios') {
        try {
          console.log("Trying alternative playback approach...");
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const alternativePath = recordingPath.replace('file://', '');
          const msg = await audioRecorderPlayer.startPlayer(alternativePath);
          console.log("Alternative playback started:", msg);
          setIsPlaying(true);
          
          audioRecorderPlayer.addPlayBackListener((e) => {
            if (e.currentPosition === e.duration && e.duration > 0) {
              onStopPlay();
            }
          });
          
          return; // Success with alternative approach
        } catch (alternativeError) {
          console.log("Alternative playback also failed:", alternativeError);
        }
      }
      
      Alert.alert("Playback Error", "Failed to play audio. Please try recording again.");
      setIsPlaying(false);
      setPlayerId(0);
      
      // Clean up on error
      try {
        await audioRecorderPlayer.stopPlayer();
        await audioRecorderPlayer.removePlayBackListener();
      } catch (cleanupError) {
        console.log("Cleanup error:", cleanupError);
      }
    }
  }, [recordingPath]);


  const onStopPlay = useCallback(async () => {
    try {
      console.log("Stopping playback...");
      await audioRecorderPlayer.stopPlayer();
      setIsPlaying(false);
      setPlayerId(0);
      await audioRecorderPlayer.removePlayBackListener();
      console.log("Playback stopped successfully");
    } catch (error) {
      console.log("Error stopping playback:", error);
      // Force reset state
      setIsPlaying(false);
      setPlayerId(0);
    }
  }, []);

  useEffect(() => {
    if(postValue?.id){
      setSelectedGroup({id: postValue?.loop_group?.id || 15213, name: postValue?.loop_group?.loop_name || "Global Feeds"})
      onChangeCaptionHandler(postValue?.post_content);
      if(postValue?.file_type === "image"){
        var imageData = postValue?.post_image.split(",");
        setMultiSelectImages(imageData)
        
      }else if(postValue?.file_type === "video"){
        console.log("videoData", postValue)
        setVideoUri(postValue?.post_video)
        setSelectedVideo([{url: postValue?.post_video}])
        
      }else if(postValue?.file_type === "audio"){
        setAudio([{uri: postValue?.post_audio}])
        setRecordingPath(`${R2_PUBLIC_URL}${postValue?.post_audio}`)
        setAudioData(`${postValue?.post_audio}`)
      }
    }
    
  }, [postValue]);

  useEffect(() => {  
    const initializeApp = async () => {
      try {
        await requestMicrophonePermission();
        
        // Clean up any existing listeners
        audioRecorderPlayer.removeRecordBackListener();
        audioRecorderPlayer.removePlayBackListener();
      } catch (error) {
        console.log('Initialization error:', error);
      }
    };

  
    initializeApp();
  
    // Enhanced cleanup function
    return () => {
      const cleanup = async () => {
        try {
          console.log("Cleaning up audio components...");
          
          // Clear timeouts
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          // Stop audio recording/playing
          if (isPlaying) {
            try {
              await audioRecorderPlayer.stopPlayer();
            } catch (error) {
              console.log("Error stopping player during cleanup:", error);
            }
          }
          
          if (isRecording) {
            try {
              await audioRecorderPlayer.stopRecorder();
            } catch (error) {
              console.log("Error stopping recorder during cleanup:", error);
            }
          }
          
          // Remove listeners
          try {
            audioRecorderPlayer.removeRecordBackListener();
            audioRecorderPlayer.removePlayBackListener();
          } catch (error) {
            console.log("Error removing listeners during cleanup:", error);
          }
          
          // Pause video if playing
          if (videoRef && isVideoPlaying) {
            try {
              await videoRef.pauseAsync();
            } catch (error) {
              console.log("Error pausing video during cleanup:", error);
            }
          }
  
          // Handle TrackPlayer cleanup
          if (trackPlayerReady) {
            try {
              const playbackState = await TrackPlayer.getPlaybackState();
              if (playbackState.state === State.Playing || playbackState.state === State.Paused) {
                await TrackPlayer.pause();
              }
            } catch (trackError) {
              console.log('TrackPlayer cleanup error:', trackError);
            }
          }
          
          console.log("Cleanup completed");
        } catch (error) {
          console.log('Cleanup error:', error);
        }
      };
      cleanup();
      setPostValue({})
    };
  }, []);

  // FIXED: Stable effect for audio setup
  useEffect(() => {
    setAudio([]);
    setRecordingPath(null);
    setDisplayWaveData(waveData);
  }, [waveData, setAudio, setRecordingPath]);

  // FIXED: Stable effect for downloaded audio
  useEffect(() => {
    if (downloadedAudio.length > 0 && downloadedAudio[0]?.uri) {
      setRecordingPath(downloadedAudio[0].uri);
    }
  }, [downloadedAudio, setRecordingPath]);


  const handlePressIn = useCallback(() => {
    setDownloadedAudio([]);
    setAudio([]);
    hasStartedRef.current = false;
    
    timeoutRef.current = setTimeout(() => {
      hasStartedRef.current = true;
      onStartRecord();
    }, 100);
  }, [onStartRecord, setDownloadedAudio, setAudio]);

  const handlePressOut = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (hasStartedRef.current) {
      onStopRecord();
    }
  }, [onStopRecord]);
  // FIXED: Permission handling
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const handleCameraPress = useCallback(async () => {
    if (!hasPermission) {
      const permission = await requestPermission();
      if (!permission) {
        Linking.openSettings();
        return;
      }
    }
    onPressCamera();
  }, [hasPermission, requestPermission, onPressCamera]);

  const handleGalleryPress = useCallback(async (type: string) => {
    if (!hasPermission) {
      const permission = await requestPermission();
      if (!permission) {
        Linking.openSettings();
        return;
      }
    }
    onPressGallary(type);
  }, [hasPermission, requestPermission, onPressGallary]);

  // FIXED: Enhanced TrackPlayer cleanup with proper error handling
  const handleClearAudio = useCallback(async () => {
    try {
      setAudio([]);
      setIsRecording(false);
      setRecordingPath(null);
      setRecordingStopped(true);
      setDownloadedAudio([]);
      
      // Stop TrackPlayer if initialized and ready
      if (trackPlayerReady) {
        try {
          const state: any = await TrackPlayer.getPlaybackState();;
          if (state === State.Playing || state === State.Paused) {
            await TrackPlayer.pause();
          }
        } catch (trackError) {
          console.log('TrackPlayer pause error:', trackError);
          // Continue with other cleanup even if TrackPlayer fails
        }
      }
      
      if (isRecording) {
        await onStopRecord();
      }
    } catch (error) {
      console.log('Error clearing audio:', error);
    }
  }, [
    setAudio,
    setIsRecording,
    setRecordingPath,
    setRecordingStopped,
    setDownloadedAudio,
    trackPlayerReady,
    isRecording,
    onStopRecord
  ]);

  // FIXED: Memoized components
  const VideoShimmer = useCallback(() => (
    <View
      style={{
        width: "90%",
        height: 250,
        borderRadius: 10,
        backgroundColor: globalColors.darkOrchidShade80,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        position: "absolute",
      }}
    >
      <ActivityIndicator size="large" color={globalColors.darkOrchid} />
    </View>
  ), []);

  // FIXED: Memoized image list rendering
  const renderImageItem = useCallback(({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={{
        // position: "relative",
        marginHorizontal: 15,
        alignSelf: "center",
        zIndex: 1,
        width: width - 30,
        height: 400,
      }}
      activeOpacity={1}
    >
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          borderRadius: 20,
          padding: 5,
        }}
        onPress={() => onClearImageHandler(index)}
      >
        <ClearChatIcon />
      </TouchableOpacity>

      <Image
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 15,
          alignSelf: "center",
        }}
        source={{ uri: item?.uri || `https://cdn.qoneqt.com/${item}` }}
        contentFit="cover"
      />
    </TouchableOpacity>
  ), [onClearImageHandler]);

  // FIXED: Memoized submit handler
  const handleSubmitPost = useCallback(() => {
    onSubmitPostHandler({ isCreatePost: true });
  }, [onSubmitPostHandler]);

  const handleContentSizeChange = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const lines = Math.round(contentHeight / 20);
    setLineCount(lines);
  };

  return (
    <ViewWrapper>
      {/* Navigation */}
      <GoBackNavigation header="Create Post" isDeepLink={true} />
      
      <TouchableWithoutFeedback
        onPress={() => {
          if(keyboardVisible){
            Keyboard.dismiss();
          }
          else{
            inputRef.current?.focus();
          }
        }}
        accessible={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "height" : "height"}
          style={{ flex: 1, width: "100%" }}
        >
          <ScrollView
            automaticallyAdjustKeyboardInsets
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ width: "100%", paddingHorizontal: 20, marginTop: 20,  }}>
              <TextInput
                ref={inputRef}
                onChangeText={onChangeCaptionHandler}
                multiline
                placeholder="Write your caption here..."
                placeholderTextColor="#BBBBBB"
                style={{
                  maxWidth: "100%",
                  fontSize: 18,
                  color: globalColors.neutralWhite,
                  paddingVertical: 15,
                  textAlignVertical: "top",
                  borderColor: globalColors.neutral5,
                  width: "100%",
                  paddingBottom: keyboardVisible ? lineCount > 30 ? 250 : 15 : lineCount > 30 ? 250 : 15,
                  borderBottomWidth: 1, borderBottomColor: globalColors.neutral5,
                }}
                value={desc}
                onContentSizeChange={handleContentSizeChange}
              />
            </View>

            {loaded ? (
              <VideoShimmer />
            ) : (
              <View style={{ marginTop: 15 }}>
                {/* Video Section */}
                {selectedvideo && selectedvideo.length > 0 && !loaded && (
                  <TouchableOpacity activeOpacity={1} style={{ position: "relative", marginHorizontal: 15 }}>
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 10,
                        zIndex: 1,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        borderRadius: 20,
                        alignSelf: "center",
                        padding: 5,
                      }}
                      onPress={() => setSelectedVideo([])}
                    >
                      <ClearChatIcon />
                    </TouchableOpacity>
                    <MemoizedMediaPost
                      source={{ url: videoUri }}
                      type="video"
                      isHome={true}
                      isGroup={false}
                      isCreatePost={true}
                    />
                  </TouchableOpacity>
                )}

                {/* Image Gallery Section */}
                {multiSelectImages && multiSelectImages.length > 0 && (
                  <View style={{ marginTop: 20, width: '100%' }}>
                    <FlatList
                      data={multiSelectImages}
                      horizontal
                      scrollEnabled
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item, index) => item.uri || index.toString()}
                      renderItem={renderImageItem}
                      // getItemLayout={(data, index) => ({
                      //   length: width - 30,
                      //   offset: (width - 30) * index,
                      //   index,
                      // })}
                      removeClippedSubviews={true}
                      maxToRenderPerBatch={3}
                      windowSize={5}
                      style={{ flexGrow: 0 }}
                      contentContainerStyle={{ flexGrow: 1 }}
                    />
                  </View>
                )}
                {/* Audio Recording Section */}
                {isRecording ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 5,
                      borderRadius: 25,
                      backgroundColor: "#2C2C2C",
                      marginHorizontal: "3%",
                    }}
                  >
                    <TouchableOpacity
                      onPress={playerId === 1 ? onStopPlay : onStartPlay}
                    >
                      <Image
                        style={{ width: 35, height: 35, tintColor: "#FFF" }}
                        source={
                          playerId === 1
                            ? require("./../../../../src/assets/image/pause.png")
                            : require("./../../../../src/assets/image/play.png")
                        }
                      />
                    </TouchableOpacity>

                    <View
                      style={{
                        height: 70,
                        width: 250,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        overflow: "hidden",
                        paddingLeft: 20,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 2,
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        {displayWaveData.map((height, index) => (
                          <Animated.View
                            key={`wave-${index}`}
                            //@ts-ignore
                            entering={ZoomIn}
                            style={{
                              height: height,
                              width: 2,
                              borderRadius: 4,
                              backgroundColor: globalColors.neutralWhite,
                              opacity: 0.8,
                            }}
                          />
                        ))}
                      </View>
                    </View>

                    {recordingStopped ? (
                      <TouchableOpacity onPress={handleClearAudio}>
                        <Image
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 1,
                          }}
                          source={require("./../../../../src/assets/image/delete.png")}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={onStopRecord}>
                        <Image
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 1,
                            tintColor: isRecording ? "red" : "#FFF",
                          }}
                          source={require("./../../../../src/assets/image/video.png")}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (!isRecording && recordingPath) ? (
                  <View
                    style={{
                      backgroundColor: "#2C2C2C",
                      borderRadius: 25,
                      flexDirection: "row",
                      alignItems: "center",
                      marginHorizontal: 20,
                      position: "relative",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Track_Player
                        Type={recordingPath}
                        id="1"
                        isPlaying={isPlaying}
                        isCreatePost={true}
                        setCurrentPlaying={()=>{}}
                      />
                    </View>
                    <View
                      style={{
                        right: "10%",
                        justifyContent: "center",
                        flex: 0.1,
                      }}
                    >
                      <TouchableOpacity onPress={handleClearAudio}>
                        <Image
                          style={{
                            width: 30,
                            height: 30,
                            tintColor: globalColors.neutralWhite,
                          }}
                          source={require("./../../../../src/assets/image/delete.png")}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (downloadedAudio.length > 0 && downloadedAudio[0]?.uri) ? (
                  <View style={{ marginHorizontal: 20 }}>
                    {trackPlayerReady ? (
                      <Track_Player
                        Type={recordingPath}
                        id="1"
                        isPlaying={isPlaying}
                        isCreatePost={true}
                        setCurrentPlaying={()=>{}}
                      />
                    ) : (
                      <View style={{ 
                        backgroundColor: "#2C2C2C",
                        borderRadius: 25,
                        padding: 15,
                        alignItems: 'center'
                      }}>
                        <Text style={{ color: globalColors.neutralWhite }}>
                          Audio player not available
                        </Text>
                      </View>
                    )}
                    <TouchableOpacity 
                      onPress={handleClearAudio}
                      style={{ 
                        alignSelf: 'center', 
                        marginTop: 10,
                        padding: 10 
                      }}
                    >
                      <Image
                        style={{ width: 30, height: 30, borderRadius: 1 }}
                        source={require("./../../../../src/assets/image/delete.png")}
                      />
                    </TouchableOpacity>
                  </View>
                ) : audioData ? (
                  <View
                    style={{
                      backgroundColor: "#2C2C2C",
                      borderRadius: 25,
                      flexDirection: "row",
                      alignItems: "center",
                      marginHorizontal: 20,
                      position: "relative",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Track_Player
                        Type={audioData}
                        id="1"
                        isPlaying={isPlaying}
                        isCreatePost={true}
                        setCurrentPlaying={()=>{}}
                      />
                    </View>
                    <View
                      style={{
                        right: "10%",
                        justifyContent: "center",
                        flex: 0.1,
                      }}
                    >
                      <TouchableOpacity onPress={() => {handleClearAudio(); setAudioData(null)}}>
                        <Image
                          style={{
                            width: 30,
                            height: 30,
                            tintColor: globalColors.neutralWhite,
                          }}
                          source={require("./../../../../src/assets/image/delete.png")}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
              </View>
            )}
          </ScrollView>

          <BottomViewComponent
            onPressGroup={onPressGroup}
            selectedGroup={selectedGroup}
            onPressCamera={onPressCamera}
            onSubmitPostHandler={handleSubmitPost}
            onSubmitHomePostHandler={onSubmitHomePostHandler}
            handlePressIn={handlePressIn}
            handlePressOut={handlePressOut}
            hasPermission={hasPermission}
            handleCameraPress={handleCameraPress}
            submitPostResponse={submitPostResponse}
            setIsAddModalVisible={setIsAddModalVisible}
          />

          <BottomSheetWrap bottomSheetRef={MyGroupRef}>
            <TextInputComponent
              noTop
              placeHolder="Search Group"
              onChangeText={onSearchGroup}
            />
            {/* FIXED: Replace nested FlatList with map to avoid VirtualizedList nesting */}
            <View style={{ flexGrow: 1, paddingTop: 5 }}>
              {(searchGroupResponse?.data || []).length > 0 ? (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {(searchGroupResponse?.data || []).map((item, index) => (
                    <MemoizedGroupCard
                      key={`group-${item.id || index}`}
                      data={item}
                      onSelectGroup={onSelectGroupHandler}
                    />
                  ))}
                </ScrollView>
              ) : (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ color: globalColors.neutralWhite }}>
                    No groups found
                  </Text>
                </View>
              )}
            </View>
          </BottomSheetWrap>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isAddModalVisible}
            onRequestClose={() => setIsAddModalVisible(false)}
          >
            <AddModalViewComponent
              onPressGallary={onPressGallary}
              hasPermission={hasPermission}
              setIsAddModalVisible={setIsAddModalVisible}
              handleGalleryPress={handleGalleryPress}
              Document_Picker={Document_Picker}
            />
          </Modal>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ViewWrapper>
  );
};

export default React.memo(CreatePostScreen);