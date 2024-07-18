import { View, Text } from "react-native";
import React from "react";
import MainStack from "./MainStack";
import AuthStack from "./AuthStack";
import { useAppContext } from "../contexts/AppContext";

const Route = () => {
  const { user } = useAppContext();
  console.log("user", user);

  if (user?.isLogin) {
    return <MainStack />;
  }

  return <AuthStack />;
};

export default Route;
