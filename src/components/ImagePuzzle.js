import React, { useState, useEffect } from "react";
import { Alert, Dimensions, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { PicturePuzzle, PuzzlePieces } from "react-native-picture-puzzle";
import {
  Button,
  Caption,
  Headline,
  Paragraph,
  Subheading,
  TextInput,
} from "react-native-paper";
import { useAppContext } from "../contexts/AppContext";
import Spacer from "./Spacer";
import { set } from "firebase/database";

export default function ImagePuzzle({ puzzleData, navigation }) {
  const quizContent = puzzleData?.quiz;

  const [quiz, setQuiz] = useState(
    Array.isArray(quizContent) && quizContent.length > 0 ? quizContent[0] : []
  );

  //console.log("🚀 ~ ImagePuzzle ~ quiz:", quiz);
  const { user } = useAppContext();
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [currentQuizResult, setCurrentQuizResult] = useState({
    quiz: puzzleData,
    score: 0,
  });

  const [answer, setAnswer] = useState(null);

  const [hidden, setHidden] = React.useState(0); // piece to obscure
  /* const [pieces, setPieces] = React.useState(() => {
    const initialPieces = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const sortedSubArray = initialPieces
      .slice(2)
      .sort(() => Math.random() - 0.5);
    return initialPieces.slice(0, 2).concat(sortedSubArray);
  }); */

  const piecesGenerator = () => {
    const initialPieces = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const sortedSubArray = initialPieces
      .slice(2)
      .sort(() => Math.random() - 0.5);

    if (user?.type === "admin") {
      return initialPieces;
    }

    return initialPieces.slice(0, 2).concat(sortedSubArray);
  };

  const [pieces, setPieces] = React.useState(piecesGenerator);
  const source = React.useMemo(
    () => ({
      uri: quiz.imageUrl,
    }),
    []
  );
  const renderLoading = React.useCallback(() => <ActivityIndicator />, []);
  const onChange = React.useCallback(
    (nextPieces, nextHidden) => {
      setPieces(nextPieces);
      setHidden(nextHidden);
    },
    [setPieces, setHidden]
  );

  /* React.useEffect(() => {
    console.log("pieces", pieces);
    if (pieces.every((value, index) => value === index)) {
      alert("Congratulations!");
    }
  }, [pieces]); */

  useEffect(() => {
    if (currentPuzzle < quizContent.length) {
      setQuiz(quizContent[currentPuzzle]);
    } else {
      console.log("🚀 ~ verifyAnswer ~ currentQuizResult:", currentQuizResult);
      navigation.replace("ResultScreen", {
        quiz: puzzleData,
        result:
          currentQuizResult?.score >= quizContent.length / 2
            ? "passed"
            : "failed",
        scrore: currentQuizResult?.score,
        over: quizContent.length,
      });
    }
  }, [currentPuzzle, quizContent]);

  const verifyAnswer = () => {
    if (currentPuzzle < quizContent.length) {
      if (answer) {
        const piecesIsInOrder = pieces.every((value, index) => value === index);
        const answerIsCorrect =
          quiz.answer?.toLowerCase() === answer?.toLowerCase();
        if (piecesIsInOrder && answerIsCorrect) {
          setCurrentQuizResult((result) => {
            return {
              quiz: puzzleData,
              score: result?.score + 1,
            };
          });
          /* navigation.replace("ResultScreen", {
            quiz: puzzleData,
            result: "passed",
          }); */
        } /* else {
          navigation.replace("ResultScreen", {
            quiz: puzzleData,
            result: "failed",
          });
        } */
        setAnswer("");
        setPieces(piecesGenerator);
        setCurrentPuzzle((currentPuzzle) => currentPuzzle + 1);
      } else {
        alert("Please enter your answer!");
      }
    }
  };

  const onPressSubmit = () => {
    Alert.alert("Submit Answer", "Are you sure you want to submit?", [
      {
        text: "Cancel",
        onPress: () => console.log("OK Pressed"),
        style: "cancel",
      },
      {
        text: "SUMBIT",
        onPress: verifyAnswer,
        style: "ok",
      },
    ]);
  };

  return (
    <View>
      <Caption>QUESTION / HINT</Caption>
      <Subheading>{quiz?.question}</Subheading>
      <Spacer size={20} />
      <View>
        <PicturePuzzle
          size={Math.floor(Dimensions.get("window").width) - 20}
          pieces={pieces}
          hidden={hidden}
          onChange={onChange}
          source={source}
          renderLoading={renderLoading}
        />
      </View>
      <TextInput
        style={{ marginVertical: 20, textAlign: "center" }}
        onChangeText={setAnswer}
        value={answer}
        placeholder="Enter your answer"
        mode="outlined"
      />
      <Subheading
        style={{ color: "white", fontWeight: "bold", textAlign: "center" }}
      >
        {currentPuzzle + 1} / {quizContent.length}
      </Subheading>
      <Spacer size={20} />
      <Button mode="contained" onPress={onPressSubmit}>
        SUMBIT
      </Button>
    </View>
  );
}
