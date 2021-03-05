import React, { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage.js";
import Landing from "./components/Landing.js";
import SetName from "./components/SetName.js";
import ScanToken from "./components/ScanToken";
import NewFile from "./components/NewFile";
import FileTimeline from "./components/FileTimeline";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

export default function App() {
  return <FileTimeline token="123456"></FileTimeline>;
  // return <Landing></Landing>;
  // return <NewFile></NewFile>;
  // return <ScanToken></ScanToken>;
  const [email, setEmail] = useState(null);
  const [profile, setProfile] = useState(null);

  SplashScreen.preventAutoHideAsync();

  useEffect(() => {
    if (email != null && profile != null) {
      SplashScreen.hideAsync();
    }
  });

  AsyncStorage.getItem("@email")
    .then((value) => {
      if (value != null) {
        setEmail(value);
      } else {
        setEmail(false);
      }
    })
    .catch((e) => {
      alert("Could not open app! Try again.");
    });

  AsyncStorage.getItem("@profile")
    .then((value) => {
      if (value != null) {
        setProfile(value);
      } else {
        setProfile(false);
      }
    })
    .catch((e) => {
      alert("Could not open app! Try again.");
    });

  return (
    <NavigationContainer>
      {email != null && profile != null && (
        <Stack.Navigator
          initialRouteName={
            email ? (profile ? "SetName" : "Landing") : "LoginPage"
          }
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Landing" component={Landing} />
          <Stack.Screen name="LoginPage" component={LoginPage} />
          <Stack.Screen name="SetName" component={SetName} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
