import { View, Text } from "react-native";
import React from "react";
import {
  createStackNavigator,
  TransitionSpecs,
  HeaderStyleInterpolators,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Dashboard from "../screens/Dashboard";
import ResultScreen from "../screens/ResultScreen";
import QuizScreen from "../screens/QuizScreen";
import UserScreen from "../screens/UserScreen";
import ManageQuizScreen from "../screens/admin/ManageQuizScreen";
import AddQuiz from "../screens/admin/AddQuiz";

const Stack = createStackNavigator();

const customTransition = {
  gestureEnabled: true,
  gestureDirection: "horizontal",
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  cardStyleInterpolator: ({ current, next, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
          {
            rotate: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: ["180deg", "0deg"],
            }),
          },
          {
            scale: next
              ? next.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.7],
                })
              : 1,
          },
        ],
      },
      opacity: current.opacity,
    };
  },
};

const MainStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      >
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="QuizScreen"
          component={QuizScreen}
          options={{
            headerShown: false,
            ...customTransition,
          }}
        />
        <Stack.Screen
          name="UserScreen"
          component={UserScreen}
          options={{
            title: "Current User",
          }}
        />
        <Stack.Screen
          name="ManageQuizScreen"
          component={ManageQuizScreen}
          options={{
            title: "Manage Quizzes",
          }}
        />
        <Stack.Screen
          name="AddQuiz"
          component={AddQuiz}
          options={{
            title: "Quiz",
          }}
        />
        <Stack.Screen
          name="ResultScreen"
          component={ResultScreen}
          options={{
            headerShown: false,
            ...customTransition,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStack;
