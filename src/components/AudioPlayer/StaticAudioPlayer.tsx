import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";

import {
  Waveform,
  useAudioPlayer,
  FinishMode,
  IWaveformRef,
} from "@simform_solutions/react-native-audio-waveform";
import RNFS from "react-native-fs"; // Import react-native-fs

const StaticAudioPlayer = ({ Type }) => {
  const ref = useRef<IWaveformRef>(null);
  const [recordingPath, setRecordingPath] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false); // Track play state
  const [playerId, setPlayerId] = useState(0);
  const [waveformKey, setWaveformKey] = useState(null); // Store waveform data
  const {
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
  const { preparePlayer, playPlayer, stopPlayer } = useAudioPlayer();

  const downloadAudio = async (url: string) => {
    try {
      const localPath = `${RNFS.DocumentDirectoryPath}/downloadedAudio.mp3`;
      const result = await RNFS.downloadFile({
        fromUrl: url,
        toFile: localPath,
      }).promise;

      if (result.statusCode === 200) {
        setRecordingPath(localPath);

        const waveformData = await extractWaveformData({
          path: recordingPath,
          playerKey: "audioPlayer1",
          noOfSamples: 100,
        });

        setWaveformKey(waveformData);
      } else {
        console.error("Failed to download the file");
        Alert.alert("Error", "Failed to download audio file");
      }
    } catch (error) {
      console.error("Download failed", error);
      Alert.alert("Error", "Failed to download audio file");
    }
  };

  useEffect(() => {
    const audioUrl = `https://cdn.qoneqt.com/${Type}`;
    downloadAudio(audioUrl);
  }, []);

  const playAudio = async () => {
    if (recordingPath) {
      try {
        await preparePlayer({
          playerKey: "audioPlayer1",
          path: recordingPath,
        });
        ref.current.startPlayer({ finishMode: FinishMode.pause });
        playPlayer({
          finishMode: FinishMode.loop,
          playerKey: "audioPlayer1",
          path: recordingPath,
        });
        setIsPlaying(true);
      } catch (error) {
        console.error("Error while preparing player or playing audio:", error);
        Alert.alert("Error", "Failed to load or play the audio file.");
      }
    }
  };

  const pauseAudio = async () => {
    setIsPlaying(false);
    stopPlayer({ playerKey: "audioPlayer1" });
  };

  const stopAudio = async () => {
    setIsPlaying(false);
    stopPlayer({ playerKey: "audioPlayer1" });
  };

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
    <View style={{ padding: 10, borderRadius: 15 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 10,
          borderWidth: 0.5,
          borderColor: "grey",
          borderRadius: 25,
        }}
      >
        <TouchableOpacity onPress={isPlaying ? pauseAudio : playAudio}>
          <Image
            style={{ width: 30, height: 30 }}
            source={
              isPlaying
                ? require("./../../../src/assets/image/pause.png")
                : require("./../../../src/assets/image/play.png")
            }
          />
        </TouchableOpacity>
        <View>
          <Waveform
            ref={ref}
            key={waveformKey}
            path={recordingPath}
            mode="static"
         
            waveColor="white"
            containerStyle={{ flex: 1, marginHorizontal: 10 }}
            candleHeightScale={6}
            candleSpace={3}
            candleWidth={4}
            scrubColor="grey"
          />
        </View>

        <TouchableOpacity onPress={playAudio}>
          <Image
            style={{ width: 30, height: 30 }}
            source={require("./../../../src/assets/image/microphone.png")}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginTop: 10,
        }}
      >
        <TouchableOpacity onPress={stopAudio}>
          <Text style={{ color: "white" }}>Stop Player</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={playAudio}>
          <Text style={{ color: "white" }}>Start Player</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StaticAudioPlayer;
