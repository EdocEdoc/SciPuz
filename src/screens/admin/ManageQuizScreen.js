import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { useOrientation } from "../../utils/orientation";
import QuizCard from "../../components/QuizCard";
import { FAB } from "react-native-paper";

const ManageQuizScreen = ({ navigation }) => {
  const { quizzes } = useAppContext();
  const [quizList, setQuizList] = useState([]);
  const orientation = useOrientation();

  useEffect(() => {
    setQuizList(quizzes);
  }, [quizzes]);

  return (
    <View style={{ flex: 1 }}>
      {orientation === "PORTRAIT" && (
        <FlatList
          key={"_"}
          numColumns={1}
          data={quizList}
          keyExtractor={(item) => "_" + item.id}
          renderItem={(item) => (
            <QuizCard item={item} navigation={navigation} isAdmin={true} />
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
            <QuizCard item={item} navigation={navigation} isAdmin={true} />
          )}
        />
      )}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("AddQuiz")}
      />
    </View>
  );
};

export default ManageQuizScreen;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
