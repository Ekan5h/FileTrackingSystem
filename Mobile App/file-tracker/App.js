import React from "react";
import { StyleSheet, View } from "react-native";
// import Camera2 from "./components/Camera2";
import Landing from "./components/Landing";
import OTPPage from "./components/OTPPage";
export default class App extends React.Component {
  render() {
    return <Landing />;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
