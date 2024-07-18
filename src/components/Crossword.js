//Crossword.js

import React from "react";
import { View, StyleSheet } from "react-native";
import CrosswordGrid from "./CrosswordGrid";

const Crossword = ({ crosswordData, navigation }) => {
  // levels can be added here in the crosswordData

  return (
    <View style={styles.container}>
      {Array.isArray(crosswordData?.quiz) && crosswordData?.quiz.length > 0 && (
        <CrosswordGrid
          crosswordData={crosswordData?.quiz}
          quiz={crosswordData}
          isCreation={true}
          navigation={navigation}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Crossword;
