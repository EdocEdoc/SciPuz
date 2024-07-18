import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import QuizCard from "../components/QuizCard";
import { dummyMediData } from "../utils/constants";
import { Headline } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useOrientation } from "../utils/orientation";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useAppContext } from "../contexts/AppContext";
import AudioButton from "../components/AudioButton";
import { db } from "../utils/config";

const image_puzzle_quiz = [
  {
    question: "What is the capital of France?",
    answer: "Paris",
    imageUrl: dummyMediData.imageUrl,
    videoUrl: dummyMediData.videoUrl,
  },
  {
    question: "What is the capital of Spain?",
    answer: "Madrid",
    imageUrl: dummyMediData.imageUrl,
    videoUrl: dummyMediData.videoUrl,
  },
  {
    question: "What is the capital of Italy?",
    answer: "Rome",
    imageUrl: dummyMediData.imageUrl,
    videoUrl: dummyMediData.videoUrl,
  },
  {
    question: "What is the capital of Germany?",
    answer: "Berlin",
    imageUrl: dummyMediData.imageUrl,
    videoUrl: dummyMediData.videoUrl,
  },
];

const crossword_puzzle_quiz = [
  {
    answer: "TIGER",
    question: "The powerful predator roams the jungle",
    startx: 4,
    starty: 1,
    orientation: "down",
    position: 1,
    imageUrl: dummyMediData.imageUrl,
    videoUrl: dummyMediData.videoUrl,
  },
  {
    answer: "EAGLE",
    question: "A majestic bird known for its keen eyesight",
    startx: 4,
    starty: 4,
    orientation: "across",
    position: 2,
    imageUrl: dummyMediData.imageUrl,
    videoUrl: dummyMediData.videoUrl,
  },
  {
    answer: "ITALIC",
    question: "It's a style of typeface characterized by slanted letters",
    startx: 7,
    starty: 1,
    orientation: "down",
    position: 3,
    imageUrl: dummyMediData.imageUrl,
    videoUrl: dummyMediData.videoUrl,
  },
];

const quizData = [
  {
    quizID: "quiz_1",
    title: "Quiz Title 1",
    dateCreated: new Date().toISOString(),
    description: "This is a description of the first quiz.",
    quizVideo: dummyMediData.videoUrl,
    featuredImage: dummyMediData.imageUrl,
    type: "image_puzzle",
    quiz: image_puzzle_quiz,
  },
  {
    quizID: "quiz_2",
    title: "Quiz Title 2",
    dateCreated: new Date().toISOString(),
    description: "This is a description of the second quiz.",
    quizVideo: dummyMediData.videoUrl,
    featuredImage: dummyMediData.imageUrl,
    type: "crossword_puzzle",
    quiz: crossword_puzzle_quiz,
  },
  {
    quizID: "quiz_3",
    title: "Quiz Title 3",
    dateCreated: new Date().toISOString(),
    description: "This is a description of the third quiz.",
    quizVideo: dummyMediData.videoUrl,
    featuredImage: dummyMediData.imageUrl,
    type: "image_puzzle",
    quiz: image_puzzle_quiz,
  },
  {
    quizID: "quiz_4",
    title: "Quiz Title 4",
    dateCreated: new Date().toISOString(),
    description: "This is a description of the fourth quiz.",
    quizVideo: dummyMediData.videoUrl,
    featuredImage: dummyMediData.imageUrl,
    type: "crossword_puzzle",
    quiz: crossword_puzzle_quiz,
  },
  {
    quizID: "quiz_5",
    title: "Quiz Title 5",
    dateCreated: new Date().toISOString(),
    description: "This is a description of the fifth quiz.",
    quizVideo: dummyMediData.videoUrl,
    featuredImage: dummyMediData.imageUrl,
    type: "image_puzzle",
    quiz: image_puzzle_quiz,
  },
  {
    quizID: "quiz_6",
    title: "Quiz Title 6",
    dateCreated: new Date().toISOString(),
    description: "This is a description of the sixth quiz.",
    quizVideo: dummyMediData.videoUrl,
    featuredImage: dummyMediData.imageUrl,
    type: "crossword_puzzle",
    quiz: crossword_puzzle_quiz,
  },
  {
    quizID: "quiz_7",
    title: "Quiz Title 7",
    dateCreated: new Date().toISOString(),
    description: "This is a description of the seventh quiz.",
    quizVideo: dummyMediData.videoUrl,
    featuredImage: dummyMediData.imageUrl,
    type: "image_puzzle",
    quiz: image_puzzle_quiz,
  },
  {
    quizID: "quiz_8",
    title: "Quiz Title 8",
    dateCreated: new Date().toISOString(),
    description: "This is a description of the eighth quiz.",
    quizVideo: dummyMediData.videoUrl,
    featuredImage: dummyMediData.imageUrl,
    type: "crossword_puzzle",
    quiz: crossword_puzzle_quiz,
  },
  {
    quizID: "quiz_9",
    title: "Quiz Title 9",
    dateCreated: new Date().toISOString(),
    description: "This is a description of the ninth quiz.",
    quizVideo: dummyMediData.videoUrl,
    featuredImage: dummyMediData.imageUrl,
    type: "image_puzzle",
    quiz: image_puzzle_quiz,
  },
  {
    quizID: "quiz_10",
    title: "Quiz Title 10",
    dateCreated: new Date().toISOString(),
    description: "This is a description of the tenth quiz.",
    quizVideo: dummyMediData.videoUrl,
    featuredImage: dummyMediData.imageUrl,
    type: "crossword_puzzle",
    quiz: crossword_puzzle_quiz,
  },
];

const Dashboard = ({ navigation }) => {
  const [quizList, setQuizList] = useState([]);
  const { setUser, quizzes } = useAppContext();
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const orientation = useOrientation();

  useEffect(() => {
    console.log("Orientation: ", orientation);
  }, [orientation]);

  useEffect(() => {
    setQuizList(quizzes);
  }, [quizzes]);

  const renderHeader = () => {
    return (
      <View
        style={{
          padding: 20,
          marginTop: 30,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 38,
            color: "white",

            letterSpacing: 2.5,
            alignSelf: "center",
            marginRight: 50,
          }}
        >
          SciPuz!
        </Text>
        <View style={{ flexDirection: "row", gap: 15 }}>
          <AudioButton />
          <FontAwesome
            name="user"
            size={30}
            color="white"
            onPress={() => navigation.navigate("UserScreen")}
          />
          {/* <Ionicons
            name="arrow-back-circle"
            size={30}
            color="white"s
            onPress={() => {}}
          /> */}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={["#C33764", "#1D2671"]} style={{ flex: 1 }}>
      {renderHeader()}
      {orientation === "PORTRAIT" && (
        <FlatList
          key={"_"}
          numColumns={1}
          data={quizList}
          keyExtractor={(item) => "_" + item.id}
          renderItem={(item) => (
            <QuizCard item={item} navigation={navigation} />
          )}
          ListEmptyComponent={() => (
            <View
              style={{
                width: "100%",
                padding: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "white" }}>No Quiz Available</Text>
            </View>
          )}
        />
      )}
      {orientation === "LANDSCAPE" && (
        <FlatList
          key={"#"}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "center" }}
          data={quizList}
          keyExtractor={(item) => "#" + item.id}
          renderItem={(item) => (
            <QuizCard item={item} navigation={navigation} />
          )}
          ListEmptyComponent={() => (
            <View
              style={{
                width: "100%",
                padding: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "white" }}>No Quiz Available</Text>
            </View>
          )}
        />
      )}
    </LinearGradient>
  );
};

export default Dashboard;

const styles = StyleSheet.create({});
