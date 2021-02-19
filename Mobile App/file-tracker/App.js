import React from "react";
import { StyleSheet, View } from "react-native";
import CameraScreen from "./components/Camera";
import Camera2 from "./components/Camera2";
export default class App extends React.Component {
  render() {
    return <Camera2 />;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
