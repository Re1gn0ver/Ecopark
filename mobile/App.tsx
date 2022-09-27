import {StatusBar} from "expo-status-bar";
import {StyleSheet, Text, View} from "react-native";
import Loading from "./src/views/Loading/Loading";
import Welcome from "./src/views/Welcome";
import {useFonts} from "expo-font";
import RootStack from "./src/navigators/RootStack";
import Home from "./src/views/Main/Home";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import AuthStack from "./src/navigators/AuthStack";

export default function App() {
  let [fontsLoaded] = useFonts({
    "Lato-Bold": require("./assets/fonts/Lato-Bold.ttf"),
    "Lato-Regular": require("./assets/fonts/Lato-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* <Loading /> */}
        {/* <Welcome /> */}
        <RootStack />
        {/* <Home /> */}
        {/* <AuthStack /> */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
