import { StyleSheet, Text, View, StatusBar } from "react-native";
import { EducateProvider } from "./context/context";
import Navigation from "./navigation/Navigation";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";

export default function App() {
  let [fontsLoaded] = useFonts({
    "Nunito-Regular": require("./assets/fonts/Nunito-Regular.ttf"),
    "Nunito-Bold": require("./assets/fonts/Nunito-Bold.ttf"),
    "Nunito-Light": require("./assets/fonts/Nunito-Light.ttf"),
    "NunitoSans-Regular": require("./assets/fonts/NunitoSans-Regular.ttf"),
    "NunitoSans-Bold": require("./assets/fonts/NunitoSans-Bold.ttf"),
    "NunitoSans-Light": require("./assets/fonts/NunitoSans-Light.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <EducateProvider>
      <StatusBar backgroundColor="darkorchid" />
      <Navigation />
    </EducateProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
