import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Spacer from "../components/Spacer";
import {
  Button,
  Caption,
  Headline,
  Paragraph,
  Subheading,
  TextInput,
  Surface,
} from "react-native-paper";
import { Image } from "expo-image";
import { Video, ResizeMode } from "expo-av";
import ConfettiCannon from "react-native-confetti-cannon";
import { useAppContext } from "../contexts/AppContext";
import { db } from "../utils/config";
import * as Clipboard from "expo-clipboard";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import AudioButtonResult from "../components/AudioButtonResult";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const ResultScreen = ({ navigation, route }) => {
  const quiz = route.params.quiz;
  console.log("🚀 ~ ResultScreen ~ quiz:", quiz);
  const result = route.params.result;
  const { user } = useAppContext();

  const [quizResult, setQuizResult] = useState(result);

  const [resultReference, setResultReference] = useState(null);

  const video = React.useRef(null);

  const gradientColor =
    result === "passed" ? ["#ffd194", "#70e1f5"] : ["#ff7e5f", "#feb47b"];

  const copyToClipboard = async () => {
    if (resultReference) {
      await Clipboard.setStringAsync(resultReference);
      alert("Result Reference Copied to Clipboard!");
    }
  };

  const logResult = async () => {
    try {
      if (quiz.id && user.id) {
        const res = await db.collection("quizResults").add({
          quizId: quiz.id,
          quizTitle: quiz.title,
          userId: user.id,
          userCode: user.code,
          userType: user.type,
          userName: user.name,
          result: quizResult,
          dateCreated: new Date().toISOString(),
        });
        setResultReference(res.id);
        console.log("🚀 ~ logResult ~ res:", res);
      }
    } catch (error) {
      console.log("🚀 ~ logResult ~ error:", error);
    }
  };

  useEffect(() => {
    console.log("🚀 ~ ResultScreen ~ quizResult:", quizResult, user);
    logResult();
  }, [quizResult]);

  return (
    <LinearGradient colors={gradientColor} style={{ flex: 1, paddingTop: 30 }}>
      <ScrollView style={{ flex: 1, padding: 10 }}>
        {result === "passed" && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignSelf: "center",
              paddingHorizontal: 30,
              paddingTop: 50,
            }}
          >
            <Text
              style={{
                fontSize: 30,
                textAlign: "center",
                fontWeight: 900,
                letterSpacing: 2.5,
                color: "white",
                textShadowColor: "rgba(0, 0, 0, 0.75)",
                textShadowOffset: { width: 3, height: 5 },
                textShadowRadius: 10,
                height: 50,
              }}
            >
              Congratulations!
            </Text>
            <Text
              style={{
                fontSize: 42,
                textAlign: "center",
                marginBottom: 10,
                fontWeight: 900,
                letterSpacing: 2.5,
                color: "white",
                textShadowColor: "rgba(0, 0, 0, 0.75)",
                textShadowOffset: { width: 3, height: 5 },
                textShadowRadius: 15,
                marginTop: -15,
              }}
            >
              {" "}
              You Passed!{" "}
            </Text>
          </View>
        )}
        {result === "failed" && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignSelf: "center",
              paddingHorizontal: 30,
              paddingTop: 50,
            }}
          >
            <Text
              style={{
                fontSize: 42,
                textAlign: "center",
                marginBottom: 10,
                fontWeight: 900,
                letterSpacing: 2.5,
                color: "white",
                textShadowColor: "rgba(0, 0, 0, 0.75)",
                textShadowOffset: { width: 3, height: 5 },
                textShadowRadius: 15,
              }}
            >
              Better luck next time!
            </Text>
          </View>
        )}

        {resultReference && (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Spacer size={20} />
            <Caption style={{ textAlign: "center", color: "white" }}>
              RESULT REFERENCE
            </Caption>
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor: "white",
                flexDirection: "row",
              }}
            >
              <Paragraph
                style={{
                  textAlign: "center",
                  color: "black",

                  alignSelf: "center",
                }}
              >
                {resultReference}
              </Paragraph>
              <Ionicons
                name="copy"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
                onPress={copyToClipboard}
              />
            </View>
          </View>
        )}

        <Spacer size={50} />

        <Headline style={{ textAlign: "center", color: "white" }}>
          QUIZ MODULE
        </Headline>
        <Surface style={{ padding: 20, borderRadius: 10, margin: 10 }}>
          {result === "passed" && (
            <ConfettiCannon
              count={200}
              origin={{ x: 50, y: 100 }}
              fadeOut
              autoStartDelay={100}
            />
          )}
          <Image
            style={{
              flex: 1,
              width: "100%",
              backgroundColor: "#0553",
              height: 200,
              borderRadius: 10,
            }}
            source={quiz?.featuredImage}
            placeholder={blurhash}
            contentFit="cover"
            transition={2000}
          />
          <Spacer size={10} />
          <Subheading>
            Quiz Title:{" "}
            <Subheading style={{ fontWeight: "bold" }}>
              {quiz?.title}
            </Subheading>
          </Subheading>
          <Spacer size={10} />
          <Caption>Type: {quiz?.type}</Caption>
          <Caption>Date Created: {quiz?.dateCreated}</Caption>
          <Paragraph>Description:</Paragraph>
          <Subheading style={{ marginHorizontal: 20 }}>
            {quiz?.description}
          </Subheading>
          {quiz?.quizVideo && (
            <View style={{ flex: 1 }}>
              <Spacer size={10} />
              <LinearGradient
                colors={gradientColor}
                style={{ flex: 1, padding: 10, borderRadius: 10 }}
              >
                <Video
                  ref={video}
                  style={{ width: "100%", height: 200 }}
                  source={{
                    uri: quiz?.quizVideo,
                  }}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                />
              </LinearGradient>
              <Spacer size={10} />
            </View>
          )}
        </Surface>

        <Spacer size={20} />

        <Button
          mode="contained"
          style={{ marginHorizontal: 10 }}
          onPress={() => navigation.goBack()}
        >
          DONE
        </Button>
        <Spacer size={20} />
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <AudioButtonResult />
        </View>
        <Spacer size={50} />
      </ScrollView>
    </LinearGradient>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({});
