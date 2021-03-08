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
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import "intl";
// import "intl/locale-data/jsonp/en";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  // return <Filter />;
  // return <Search searchFor="offices" />;
  // return (
  //   <NavigationContainer>
  //     <Drawer.Navigator
  //       initialRouteName="Landing"
  //       drawerContent={(props) => <DrawerContent {...props} />}
  //     >
  //       <Drawer.Screen name="Landing" component={Landing} />
  //       <Drawer.Screen name="NewFile" component={NewFile} />
  //     </Drawer.Navigator>
  //   </NavigationContainer>
  // );
  // return <FileAction token="123456"></FileAction>;
  // return <FileTimeline token="123456"></FileTimeline>;
  // return <Landing></Landing>;
  // return <NewFile></NewFile>;
  return <ScanToken></ScanToken>;
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
