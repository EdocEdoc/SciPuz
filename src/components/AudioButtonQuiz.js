import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { Sound } from "expo-av/build/Audio";
import { TouchableOpacity } from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

var sound = null;

const AudioButtonQuiz = ({ screen }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const isFocused = useIsFocused();

  const playAudio = async () => {
    try {
      await sound.playAsync();
    } catch (error) {
      console.log("🚀 ~ playAudio ~ error:", error);
    }
    setIsPlaying(true);
  };

  const stopAudio = async () => {
    try {
      await sound.stopAsync();
    } catch (error) {
      console.log("🚀 ~ stopAudio ~ error:", error);
    }
    setIsPlaying(false);
  };

  const playStopSound = async () => {
    if (isPlaying) {
      await stopAudio();
    } else {
      await playAudio();
    }
  };

  const unLoadSound = async () => {
    await stopAudio();
    try {
      await sound?.unloadAsync();
    } catch (error) {
      console.log("🚀 ~ unLoadSound ~ error:", error);
    }
  };

  const setupBackgroundMusic = async () => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: true,
    });

    let audioToPlay = require("../../assets/thinking-time-148496.mp3");

    const { sound: newSound } = await Audio.Sound.createAsync(audioToPlay);
    /* newSound.playAsync()
    newSound.stopAsync()
    newSound.unloadAsync() */
    sound = newSound;

    await playAudio();

    //await newSound.playAsync();
    //setIsPlaying(true);
  };

  useEffect(() => {
    setupBackgroundMusic();

    return () => {
      unLoadSound();
    };
  }, []);

  useEffect(() => {
    if (isFocused) {
      playAudio();
    } else {
      stopAudio();
    }
  }, [isFocused]);

  return (
    <TouchableOpacity onPress={playStopSound}>
      <Ionicons
        name={isPlaying ? "volume-high" : "volume-mute"}
        size={30}
        color="white"
      />
    </TouchableOpacity>
  );
};

export default AudioButtonQuiz;

const styles = StyleSheet.create({});
