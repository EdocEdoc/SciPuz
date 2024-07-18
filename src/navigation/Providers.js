import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Route from "./Route";
import { AppProvider } from "../contexts/AppContext";
import { StatusBar } from "react-native";

const Providers = () => {
  return (
    <AppProvider>
      <StatusBar translucent backgroundColor={"rgba(255,255,255,0.1)"} />
      <PaperProvider theme={DefaultTheme}>
        <Route />
      </PaperProvider>
    </AppProvider>
  );
};

export default Providers;
