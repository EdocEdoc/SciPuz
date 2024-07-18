import "react-native-gesture-handler";

import Providers from "./src/navigation/Providers";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import { useCallback } from "react";

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    playfair: require("./assets/Playfair_Display/PlayfairDisplay-VariableFont_wght.ttf"),
    "playfair-black": require("./assets/Playfair_Display/static/PlayfairDisplay-Black.ttf"),
    "playfair-italic": require("./assets/Playfair_Display/PlayfairDisplay-Italic-VariableFont_wght.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <Providers />
    </View>
  );
}
