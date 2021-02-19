import React, { useState, useEffect } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from "react-native";
import { Camera } from "expo-camera";
import { Button } from "react-native-paper";

const CaptureScreen = (props) => {
  const [cameraRef, setCameraRef] = useState(null);
  const [torch, setTorch] = useState(false);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.showModal}
      useNativeDriver={true}
      animationIn="slideInLeft"
      animationOut="slideOutRight"
      onRequestClose={() => {
        props.closeModal();
      }}
    >
      <Camera
        style={{ flex: 1 }}
        ratio="16:9"
        flashMode={
          torch
            ? Camera.Constants.FlashMode.torch
            : Camera.Constants.FlashMode.off
        }
        ref={(ref) => {
          setCameraRef(ref);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "black",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button
              icon={torch ? "flashlight-off" : "flashlight"}
              style={{ marginRight: 12 }}
              mode="outlined"
              color="white"
              onPress={() => {
                setTorch(!torch);
              }}
            >
              Torch
            </Button>
            <TouchableOpacity
              onPress={async () => {
                if (cameraRef) {
                  let image = await cameraRef.takePictureAsync();
                  props.setImage(image);
                  //   props.setImage(1);
                  props.closeModal();
                }
              }}
            >
              <View
                style={{
                  borderWidth: 2,
                  borderRadius: 50,
                  borderColor: "white",
                  height: 50,
                  width: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 16,
                  marginTop: 16,
                }}
              >
                <View
                  style={{
                    borderWidth: 2,
                    borderRadius: 50,
                    borderColor: "white",
                    height: 40,
                    width: 40,
                    backgroundColor: "white",
                  }}
                ></View>
              </View>
            </TouchableOpacity>
            <Button
              icon="close"
              style={{ marginLeft: 12 }}
              mode="outlined"
              color="white"
              onPress={() => {
                props.closeModal();
              }}
            >
              Close
            </Button>
          </View>
        </View>
      </Camera>
    </Modal>
  );
};
export default function CameraScreen() {
  const [image, setImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{ width: 240, height: 240, borderRadius: 10 }}
        />
      )}
      <Button
        style={{
          width: "40%",
          alignItems: "center",
          justifyContent: "center",
          height: "7%",
          marginTop: 15,
        }}
        icon={image ? "rotate-left" : "camera"}
        mode="contained"
        dark={true}
        color="black"
        onPress={() => {
          setShowCamera(true);
        }}
      >
        {image ? "Try again" : "Camera"}
      </Button>
      <CaptureScreen
        showModal={showCamera}
        closeModal={() => setShowCamera(false)}
        setImage={(image) => setImage(image)}
      />

      {image && (
        <Button
          style={{
            width: "40%",
            alignItems: "center",
            justifyContent: "center",
            height: "7%",
            marginTop: 10,
          }}
          icon="check"
          mode="contained"
          dark={true}
          color="black"
          onPress={() => {
            console.log("Send to server");
          }}
        >
          Confirm
        </Button>
      )}
    </View>
  );
}
