import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from "react-native";

import {
  Waveform,
  useAudioPermission,
  useAudioPlayer,
  FinishMode,
  IWaveformRef,
} from "@simform_solutions/react-native-audio-waveform";
import { useAudioStore } from "@/zustand/AudioPlayerStore";
import LottieView from "lottie-react-native";

const AudioPlayer = () => {
  const ref = useRef<IWaveformRef>(null);
  const [waveformKey, setWaveformKey] = useState(null); // Store waveform data
  const [play, setPlay] = useState(0);
  const [playerId, setPlayerId] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
const{ recordingPath,setRecordingPath}=useAudioStore()
  const {
    checkHasAudioRecorderPermission,
    getAudioRecorderPermission,
    checkHasAudioReadPermission,
    getAudioReadPermission,
  } = useAudioPermission();

  const {
    preparePlayer,
    playPlayer,
    pausePlayer,
    stopPlayer,
    seekToPlayer,
    onCurrentExtractedWaveformData,
    extractWaveformData,
    getDuration,
    markPlayerAsUnmounted,
    onCurrentDuration,
    onCurrentRecordingWaveformData,
    onDidFinishPlayingAudio,
    setPlaybackSpeed,
    setVolume,
    stopAllPlayers,
    stopAllWaveFormExtractors,
    stopPlayersAndExtractors,
  } = useAudioPlayer();

  const requestPermissions = async () => {
    let hasRecordPermission = await checkHasAudioRecorderPermission();
    let hasReadPermission = await checkHasAudioReadPermission();

    if (hasRecordPermission !== "granted") {
      const recordPermissionStatus = await getAudioRecorderPermission();
      if (recordPermissionStatus !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please enable microphone access in settings.",
          [
            { text: "Open Settings", onPress: () => Linking.openSettings() },
            { text: "Cancel", style: "cancel" },
          ]
        );
        return false;
      }
    }


    if (hasReadPermission !== "granted") {
      const readPermissionStatus = await getAudioReadPermission();
      if (readPermissionStatus !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please enable file access in settings.",
          [
            { text: "Open Settings", onPress: () => Linking.openSettings() },
            { text: "Cancel", style: "cancel" },
          ]
        );
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const startRecording = async () => {
    setPlay(0);
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    setIsRecording(true); 
    setWaveformKey("");
    try {
      const success = await ref.current?.startRecord({
        encoder: 1,
        sampleRate: 44100,
        bitRate: 128000,
        fileNameFormat: "audio_{timestamp}.mp3", 
        useLegacy: false,
        updateFrequency: 1000,
      });

      if (success) console.log("Recording started successfully");
      else console.log("Failed to start recording");
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };
  const stopRecording = async () => {
    setPlay(1);

    try {
      const recordedFilePath = await ref.current?.stopRecord();
      if (recordedFilePath) {
        const formattedPath =
          Platform.OS === "android"
            ? `file://${recordedFilePath}`
            : recordedFilePath;

        setRecordingPath(formattedPath);
        setIsRecording(false); // Set recording state to false after stop

        // Extract the waveform data
        const waveformData = await extractWaveformData({
          path: formattedPath,
          playerKey: "audioPlayer1",
          noOfSamples: 100,
        });

        setWaveformKey(waveformData);
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const playAudio = async () => {
    if (!recordingPath) {
      return;
    }
    setPlayerId(1);

    try {
      await preparePlayer({ playerKey: "audioPlayer1", path: recordingPath });
ref.current.startPlayer({finishMode:FinishMode.stop})
      await playPlayer({
        playerKey: "audioPlayer1",
        finishMode: FinishMode.stop,
        path: recordingPath,
      });
    } catch (error) {
      console.error("Error starting playback:", error);
    }
  };

  const PauseAudio = () => {
    setPlayerId(0);
    ref.current.pausePlayer();
    pausePlayer({
      playerKey: "audioPlayer1",
    });
  };

  // Update waveform data in real-time while playing
  useEffect(() => {
    if (recordingPath) {
      const interval = setInterval(() => {
        onCurrentExtractedWaveformData((waveformData) => {
          // Update the waveform data as audio plays
          setWaveformKey(waveformData);
        });
      }, 100); // Update every 100ms (you can adjust this frequency)

      return () => clearInterval(interval);
    }
  }, [recordingPath]);

  return (
    <View style={{ backgroundColor: "#1E1E1E", padding: 10, borderRadius: 15, alignItems: "center" }}>
           <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 5, borderRadius: 25, backgroundColor: "#2C2C2C" }}>

        <TouchableOpacity onPress={playerId === 1 ? PauseAudio : playAudio}>
        <Image style={{ width: 35, height: 35, tintColor: "#FFF" }} source={playerId === 1 ? require("../../../src/assets/image/pause.png") : require("../../../src/assets/image/play.png")} />

        </TouchableOpacity>

        {/* <Waveform
          ref={ref}
          key={waveformKey}
          path={recordingPath}
          mode={play === 1 ? "static" : "live"}
          waveformData={waveformKey}
       
          maxCandlesToRender={50}
          showsHorizontalScrollIndicator
          waveColor="white"
          containerStyle={{ flex: 1, marginHorizontal: 10 }}
          candleHeightScale={6}
          candleSpace={3}
          candleWidth={4}
          scrubColor="grey"
        /> */}
 <View style={{  }}>
                  <LottieView
                    style={{
                      width: 200,
                      height: 50,
                      alignSelf: "center",
                    }}
                    source={require("../../../src/assets/lottie/Wave.json")}
                    autoPlay
                    loop
                  />
                </View>


        <TouchableOpacity onPress={!isRecording?startRecording:stopRecording}>
          
        <Image style={{ width: 35, height: 35, tintColor: isRecording ? "red" : "#FFF" }} source={isRecording ? require("../../../src/assets/image/video.png") : require("../../../src/assets/image/microphone.png")} />

        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginTop: 10,
        }}
      >
        {/* <TouchableOpacity onPress={stopRecording}>
          <Text style={{ color: "white" }}>Stop Recording</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={playAudio}>
          <Text style={{ color: "white" }}>Start Player</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default AudioPlayer;
