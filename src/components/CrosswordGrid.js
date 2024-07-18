//CrosswordGrid.js

import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Text, Alert } from "react-native";
import { useAppContext } from "../contexts/AppContext";
import { Button } from "react-native-paper";

let level = 0;

const calculateGridMax = (crosswordData) => {
  const gridMax = crosswordData.reduce((max, { answer }) => {
    return Math.max(max, answer.length);
  }, 0);
  console.log("🚀 ~ calculateGridMax ~ gridMax:", gridMax);

  return gridMax;
};

const generateInitialGrid = (crosswordData) => {
  const gridMax = calculateGridMax(crosswordData);

  const initialGrid = Array(gridMax)
    .fill(0)
    .map(() => Array(gridMax).fill("X"));
  crosswordData.forEach(({ answer, startx, starty, orientation }) => {
    if (startx < 1 || starty < 1) {
      return;
    }
    let x = startx - 1;
    let y = starty - 1;

    for (let i = 0; i < answer.length; i++) {
      if (orientation === "across") {
        initialGrid[y][x + i] = "";
      } else if (orientation === "down") {
        initialGrid[y + i][x] = "";
      }
    }
  });
  return initialGrid;
};

const generateAnswerGrid = (crosswordData) => {
  const gridMax = calculateGridMax(crosswordData);

  const answerGrid = Array(gridMax)
    .fill(0)
    .map(() => Array(gridMax).fill("X"));
  crosswordData.forEach(({ answer, startx, starty, orientation }) => {
    if (startx < 1 || starty < 1) {
      return;
    }

    let x = startx - 1;
    let y = starty - 1;

    for (let i = 0; i < answer.length; i++) {
      if (orientation === "across") {
        answerGrid[y][x + i] = answer[i];
      } else if (orientation === "down") {
        answerGrid[y + i][x] = answer[i];
      }
    }
  });
  return answerGrid;
};

const CrosswordGrid = ({ crosswordData, isCreation, quiz, navigation }) => {
  const [grid, setGrid] = useState(generateInitialGrid(crosswordData));
  const { user } = useAppContext();

  useEffect(() => {
    setGrid(generateInitialGrid(crosswordData));
  }, [crosswordData]);

  const handleInputChange = (row, col, text) => {
    const newGrid = [...grid];
    newGrid[row][col] = text.toUpperCase();
    setGrid(newGrid);
  };

  const handleGenerate = () => {
    level = (level + 1) % 2;
    setGrid(generateInitialGrid(crosswordData));
  };

  const checkAnswer = () => {
    const answerGrid = generateAnswerGrid(crosswordData);
    const asnwerGridString = JSON.stringify(answerGrid); //the correct answer
    console.log("🚀 ~ handleVerify ~ asnwerGridString:", asnwerGridString);
    const gridString = JSON.stringify(grid); //the user's answer
    console.log("🚀 ~ handleVerify ~ gridString:", gridString);
    const isCorrect = asnwerGridString === gridString;
    /* let numberOfTheSameCharacters = 0;

    const asnwerGridStringCharacterOnly = asnwerGridString.replace(
      /[^a-zA-Z]/g,
      ""
    );
    console.log(
      "🚀 ~ handleVerify ~ asnwerGridStringCharacterOnly:",
      asnwerGridStringCharacterOnly
    );

    const gridStringCharacterOnly = gridString.replace(/[^a-zA-Z]/g, "");
    console.log(
      "🚀 ~ handleVerify ~ gridStringCharacterOnly:",
      gridStringCharacterOnly
    );

    for (let i = 0; i < asnwerGridStringCharacterOnly.length; i++) {
      if (
        asnwerGridStringCharacterOnly[i] === gridStringCharacterOnly[i] &&
        gridStringCharacterOnly[i] !== "X"
      ) {
        console.log(
          "🚀 ~ handleVerify ~ gridStringCharacterOnly[i]:",
          gridStringCharacterOnly[i]
        );
        numberOfTheSameCharacters++;
      }
    }
    console.log(
      "🚀 ~ handleVerify ~ numberOfTheSameCharacters:",
      numberOfTheSameCharacters
    );

    const scorePercentage =
      Math.round(
        (numberOfTheSameCharacters /
          asnwerGridStringCharacterOnly.replace("X", "").length) *
          100 *
          100
      ) / 100;
    console.log("🚀 ~ handleVerify ~ scorPercentage:", scorePercentage); */

    if (isCorrect) {
      navigation.replace("ResultScreen", { quiz: quiz, result: "passed" });
    } else {
      navigation.replace("ResultScreen", { quiz: quiz, result: "failed" });
    }
  };

  const handleVerify = () => {
    Alert.alert("Submit Answer", "Are you sure you want to submit?", [
      {
        text: "Cancel",
        onPress: () => console.log("OK Pressed"),
        style: "cancel",
      },
      {
        text: "SUMBIT",
        onPress: checkAnswer,
        style: "ok",
      },
    ]);
  };

  const handleReset = () => {
    setGrid(generateInitialGrid(crosswordData));
  };

  const handleSolve = () => {
    const answerGrid = generateAnswerGrid(crosswordData);
    setGrid(answerGrid);
  };

  const renderGrid = () => (
    <View style={{ marginHorizontal: 20 }}>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <View key={colIndex} style={styles.cellContainer}>
              {crosswordData.map((entry) => {
                const { startx, starty, position } = entry;
                if (rowIndex + 1 === starty && colIndex + 1 === startx) {
                  return (
                    <Text key={`digit-${position}`} style={styles.smallDigit}>
                      {position}
                    </Text>
                  );
                }
                return null;
              })}
              <TextInput
                style={[
                  styles.cell,
                  grid[rowIndex][colIndex] === "X" ? styles.staticCell : null,
                ]}
                value={
                  grid[rowIndex][colIndex] === "X"
                    ? isCreation
                      ? `${rowIndex}${colIndex}`
                      : "."
                    : cell
                }
                editable={grid[rowIndex][colIndex] !== "X"}
                onChangeText={(text) =>
                  handleInputChange(rowIndex, colIndex, text)
                }
                maxLength={grid[rowIndex][colIndex] !== "X" ? 1 : 2}
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  const renderQuestions = () => {
    const questions = { across: [], down: [] };

    crosswordData.forEach(({ question, orientation, position }) => {
      const questionText = `${position}. ${question}`;
      questions[orientation].push(
        <Text key={`question-${position}`} style={styles.questionText}>
          {questionText}
        </Text>
      );
    });

    return (
      <View>
        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>Across</Text>
        </View>
        <View style={styles.questionsContainer}>
          {questions.across.map((question, index) => (
            <View key={`across-question-container-${index}`}>{question}</View>
          ))}
        </View>
        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>Down</Text>
        </View>
        <View style={styles.questionsContainer}>
          {questions.down.map((question, index) => (
            <View key={`down-question-container-${index}`}>{question}</View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderQuestions()}
      {renderGrid()}
      {user?.type == "admin" && (
        <View style={styles.buttonContainer}>
          {/* <Button
          color={"#228B22"}
          title="Generate"
          onPress={handleGenerate}
          style={styles.button}
        /> */}
          <View style={styles.gap} />
          <Button onPress={handleReset} mode="outlined">
            Reset
          </Button>
          <View style={styles.gap} />
          <Button onPress={handleSolve} mode="outlined">
            Solve
          </Button>
        </View>
      )}
      <View style={{ marginTop: 20, width: "100%", paddingHorizontal: 20 }}>
        <Button onPress={handleVerify} mode="contained">
          SUMBIT
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
    paddingBottom: 10,
  },
  row: {
    flexDirection: "row",
  },
  cellContainer: {
    position: "relative",
  },
  cell: {
    borderWidth: 1,
    margin: 1,
    borderColor: "purple",
    width: 30,
    height: 30,
    textAlign: "center",
  },
  staticCell: {
    borderColor: "transparent",
    color: "white",
  },
  smallDigit: {
    position: "absolute",
    top: 2,
    left: 2,
    fontSize: 10,
    fontWeight: "bold",
  },
  questionsContainer: {
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
  },
  questionText: {
    fontSize: 16,
    fontStyle: "italic",
  },
  headingContainer: {
    marginTop: 10,
    marginBottom: 5,
  },
  headingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#228B22",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  gap: {
    width: 10, // Adjust the width as needed for the desired gap
  },
});

export default CrosswordGrid;
