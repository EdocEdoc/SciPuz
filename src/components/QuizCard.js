import { Alert, StyleSheet, View } from "react-native";
import React from "react";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { SoftDeleteQuiz } from "../data/quizzes";
import { ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Spacer from "./Spacer";
import { Surface } from "react-native-paper";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const QuizCard = ({ item, navigation, isAdmin }) => {
  const quiz = item.item;
  return (
    <View style={{ padding: 10, marginHorizontal: 10, flex: 1, elevation: 5 }}>
      <ImageBackground
        source={quiz?.featuredImage}
        placeholder={blurhash}
        transition={2000}
        style={{ borderRadius: 10, overflow: "hidden", elevation: 2 }}
      >
        <LinearGradient
          colors={["rgba(29, 38, 113, .5)", "rgba(195, 55, 100, 0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, padding: 10 }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              letterSpacing: 1.5,
              textShadowColor: "rgba(0, 0, 0, 0.1)",
              textShadowOffset: { width: 3, height: 3 },
              textShadowRadius: 10,
              flex: 1,
            }}
            variant="titleLarge"
          >
            {quiz.type == "image_puzzle" ? "🧩" : "🔠"} {quiz.title}
          </Text>
          <Text variant="bodySmall" style={{ color: "white" }}>
            {new Date(quiz?.dateCreated).toDateString()}
          </Text>
          <Text variant="bodyMedium" style={{ color: "white" }}>
            {quiz.description}
          </Text>
          <Spacer size={10} />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <View style={{ flex: 1, alignSelf: "flex-end" }}>
              <Text variant="bodySmall" style={{ color: "white" }}>
                {quiz?.author}
              </Text>
              {/* <Text variant="bodySmall" style={{ color: "white" }}>
                {quiz?.authorID}
              </Text> */}
            </View>
            {!isAdmin ? (
              <Button
                onPress={() => {
                  navigation.navigate("QuizScreen", { quiz });
                }}
                mode="contained"
                style={{ alignSelf: "flex-end" }}
              >
                Take Quiz
              </Button>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                  alignItems: "baseline",
                  alignSelf: "flex-end",
                }}
              >
                <Button
                  onPress={() => {
                    Alert.alert(
                      "Confirm Delete",
                      `Are you sure you want to delete this Quiz titled ${quiz.title}?`,
                      [
                        {
                          text: "CANCEL",
                          onPress: () => {},
                          style: "cancel",
                        },
                        {
                          text: "CONFIRM",
                          onPress: () => SoftDeleteQuiz(quiz),
                          style: "destructive",
                        },
                      ],
                      { cancelable: true }
                    );
                  }}
                  mode="contained-tonal"
                >
                  Delete
                </Button>
                <Button
                  onPress={() => {
                    navigation.navigate("AddQuiz", { quiz });
                  }}
                  mode="contained"
                >
                  Update
                </Button>
              </View>
            )}
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

export default QuizCard;

const styles = StyleSheet.create({});
