import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Video, ResizeMode } from "expo-av";
import {
  Button,
  Caption,
  Headline,
  Paragraph,
  Subheading,
  TextInput,
} from "react-native-paper";
import { ScrollView } from "react-native";
import Crossword from "../components/Crossword";
import ImagePuzzle from "../components/ImagePuzzle";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useOrientation } from "../utils/orientation";
import AudioButtonQuiz from "../components/AudioButtonQuiz";

const QuizScreen = ({ route, navigation }) => {
  const quiz = route.params.quiz;
  const video = React.useRef(null);

  const [answer, setAnswer] = React.useState("");
  const [gradientColor, setGradientColor] = React.useState([
    "#56B4D3",
    "#348F50",
  ]);

  React.useEffect(() => {
    if (quiz.type == "crossword_puzzle") {
      setGradientColor(["#E1F5C4", "#EDE574"]);
    } else {
      setGradientColor(["#56B4D3", "#348F50"]);
    }
  }, [quiz]);

  return (
    <LinearGradient colors={gradientColor} style={{ flex: 1 }}>
      <ScrollView style={{ width: "100%", padding: 20, paddingTop: 30 }}>
        <View
          style={{
            paddingTop: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="arrow-back-circle"
            size={42}
            color="white"
            onPress={() => navigation.goBack()}
          />
          <AudioButtonQuiz />
        </View>
        <Headline
          style={{
            textAlign: "center",
            marginBottom: 10,
            fontWeight: "bold",
            letterSpacing: 1.5,
          }}
        >
          {quiz.title}
        </Headline>
        {/* <Video
        ref={video}
        style={{
          alignSelf: "center",
          width: Dimensions.get("window").width - 20,
          height: Dimensions.get("window").height / 3,
        }}
        source={{
          uri: quiz.quizVideo,
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        usePoster
        posterSource={quiz.featuredImage}
        posterStyle={{ width: "100%", height: "100%", resizeMode: "cover" }}
      /> */}
        <Caption>
          {new Date(quiz.dateCreated).toDateString()} | TYPE:{" "}
          {quiz.type == "image_puzzle" ? "🧩" : "🔠"}
        </Caption>
        <Paragraph>{quiz.description}</Paragraph>
        <Subheading
          style={{
            alignSelf: "center",
            fontWeight: "bold",
            letterSpacing: 1.5,
            marginVertical: 20,
          }}
        >
          QUIZ
        </Subheading>
        {quiz?.quiz && quiz.type == "crossword_puzzle" && (
          <Crossword crosswordData={quiz} navigation={navigation} />
        )}
        {quiz?.quiz && quiz.type == "image_puzzle" && (
          <View>
            <ImagePuzzle puzzleData={quiz} navigation={navigation} />
          </View>
        )}
        {false && quiz?.quiz && <Button mode="contained">SUMBIT</Button>}
        <View style={{ margin: 50 }}></View>
      </ScrollView>
    </LinearGradient>
  );
};

export default QuizScreen;

const styles = StyleSheet.create({});
