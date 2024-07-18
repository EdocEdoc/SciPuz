import { SafeAreaView, ScrollView, StyleSheet, View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import {
  Button,
  Caption,
  Headline,
  Paragraph,
  Subheading,
  TextInput,
} from "react-native-paper";
import Spacer from "../../components/Spacer";
import { LinearGradient } from "expo-linear-gradient";
import { useAppContext } from "../../contexts/AppContext";
import { db, firebase } from "../../utils/config";
import { logUsedCode } from "../../data/codes";

const LoginScreen = () => {
  const { setUser } = useAppContext();

  const [name, setName] = useState("");
  const [accessCode, setAccessCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkIfCodeIsValid = async () => {
    setIsLoading(true);
    try {
      const logUserData = await logUsedCode(name, accessCode);
      if (logUserData?.id) {
        setUser({
          ...logUserData,
          isLogin: true,
        });
      } else {
        alert("Login Failed!");
        setUser(null);
      }
    } catch (error) {
      console.log("🚀 ~ checkIfCodeIsValid ~ error:", error);
    }
    setAccessCode(null);
    setIsLoading(false);
  };

  const onEnter = () => {
    checkIfCodeIsValid();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={["#C33764", "#1D2671"]} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, padding: 50 }}>
          <Spacer size={50} />
          <Text
            style={{
              fontSize: 50,
              textAlign: "center",
              marginBottom: 10,
              fontWeight: 900,
              letterSpacing: 2.5,
              color: "white",
              textShadowColor: "rgba(0, 0, 0, 0.75)",
              textShadowOffset: { width: 3, height: 5 },
              textShadowRadius: 15,
              fontFamily: "playfair-black",
            }}
          >
            YOUR QUIZ APP!
          </Text>
          <Spacer size={50} />
          <Subheading style={{ textAlign: "center", color: "white" }}>
            LOGIN
          </Subheading>
          <Spacer size={20} />
          <TextInput
            mode="outlined"
            placeholder="Name"
            value={name}
            onChangeText={(text) => setName(text)}
            style={{ textAlign: "center" }}
            autoCapitalize="words"
          />
          <Spacer size={20} />
          <TextInput
            mode="outlined"
            placeholder="Access Code"
            value={accessCode}
            onChangeText={(text) => setAccessCode(text)}
            style={{ textAlign: "center" }}
            autoCapitalize="characters"
            maxLength={6}
          />
          <Spacer size={20} />
          <Button
            icon={"google-controller"}
            mode="contained"
            onPress={onEnter}
            disabled={isLoading}
            loading={isLoading}
          >
            ENTER
          </Button>
          <Spacer size={100} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
