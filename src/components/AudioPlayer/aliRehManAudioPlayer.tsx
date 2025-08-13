import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
// import WaveForm from "@alirehman7141/react-native-audiowaveform";
import { globalColors } from "@/assets/GlobalColors";

const AudioPlayerAliRehman = ({ Type }) => {
  const [play, setPlay] = useState(false);
  const [playerId, setPlayerId] = useState(0);
  const [audio, setAudio] = useState("");

  const toggleAudio = () => {
    setPlay(!play);
    setPlayerId(play ? 0 : 1);
  };

  useEffect(() => {
    setAudio(`https://cdn.qoneqt.com/${Type}`);
  }, [Type]);

  return (
    <View style={{ padding: 15, borderRadius: 15, backgroundColor: "#1c1c2b" }}>
      {/* Audio Player Container */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          borderRadius: 20,
          backgroundColor: "#2a2a3b",
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 4,
          overflow: "hidden",
        }}
      >
        {/* Play/Pause Button */}
        <TouchableOpacity onPress={toggleAudio} style={{ marginRight: 12 }}>
          <Image
            style={{ width: 35, height: 35, tintColor: "white" }}
            source={
              playerId === 1
                ? require("./../../../src/assets/image/pause.png")
                : require("./../../../src/assets/image/play.png")
            }
          />
        </TouchableOpacity>

        {/* Waveform Visualization */}
        <View style={{ flex: 1, overflow: "hidden", borderRadius: 10 }}>
          {/* <WaveForm
                                onPress = {(sender) => {
                                  console.error("sender",sender)
                                } }

            style={{ height: 60, width: "100%", marginVertical: 5 }}
            source={{ uri: audio }}
            waveFormStyle={{
              waveColor: "#A855F7", // Matching vibrant purple shade
              scrubColor: "#FFFFFF", // White scrub color
              height: 50,
              density: 2.5, 
              gap: 4, // Reducing gaps between bars
            }}
            play={play}
          /> */}
        </View>
      </View>
    </View>
  );
};

export default AudioPlayerAliRehman;
