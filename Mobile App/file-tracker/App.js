import React, { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage.js";
import Landing from "./components/Landing.js";
import SetName from "./components/SetName.js";
import ScanToken from "./components/ScanToken";
import NewFile from "./components/NewFile";
import FileTimeline from "./components/FileTimeline";
import FileAction from "./components/FileAction";
import DrawerContent from "./components/DrawerContent";
import Search from "./components/Search";
import Filter from "./components/Filter";
import Feedback from "./components/Feedback";
import FileHistory from "./components/FileHistory";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MainApp(props) {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={Landing} />
      <Drawer.Screen name="FileHistory" component={FileHistory} />
      <Drawer.Screen name="NewFile" component={NewFile} />
      <Drawer.Screen name="Feedback" component={Feedback} />
    </Drawer.Navigator>
  );
}

async function readLocal(setEmail, setProfile) {
  try {
    let email = await AsyncStorage.getItem("@email");
    let profile = await AsyncStorage.getItem("@profile");

    if (email == null) setEmail(false);
    else setEmail(email);
    if (profile == null) setProfile(false);
    else setProfile(profile);
  } catch {
    alert("Could not open app ;(");
  }
}

export default function App() {
  const [email, setEmail] = useState(null);
  const [profile, setProfile] = useState(null);

  SplashScreen.preventAutoHideAsync();

  useEffect(() => {
    if (email != null && profile != null) SplashScreen.hideAsync();
  });

  readLocal(setEmail, setProfile);

  return (
    <NavigationContainer>
      {email != null && profile != null && (
        <Stack.Navigator
          initialRouteName={
            email ? (profile ? "SetName" : "MainApp") : "LoginPage"
          }
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="MainApp" component={MainApp} />
          <Stack.Screen name="LoginPage" component={LoginPage} />
          <Stack.Screen name="SetName" component={SetName} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
