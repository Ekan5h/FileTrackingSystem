import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, ImageBackground } from "react-native";
import { Camera } from "expo-camera";
import { Button, TextInput, Subheading } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const CaptureScreen = (props) => {
  const [cameraRef, setCameraRef] = useState(null);
  const [image, setImage] = useState(null);
  return (
    <>
      {image && (
        <>
          <ImageBackground
            source={{ uri: image.uri }}
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "flex-end",
              alignContent: "flex-end",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignContent: "center",
                justifyContent: "center",
                backgroundColor: "black",
                height: "10%",
              }}
            >
              <Button
                icon="rotate-left"
                style={{
                  width: "40%",
                  height: "100%",
                  justifyContent: "center",
                }}
                color="white"
                onPress={() => {
                  setImage(null);
                }}
              >
                Retry
              </Button>
              <Button
                icon="check"
                style={{
                  width: "40%",
                  height: "100%",
                  justifyContent: "center",
                }}
                color="white"
                onPress={() => {
                  var name = image.uri.split("/").pop();
                  let formData = new FormData();
                  formData.append("image", {
                    uri: image.uri,
                    name: name,
                    type: "image/jpg",
                  });
                  formData.append("algorithm", "PHASH");
                  fetch("http://ec6d5281343e.ngrok.io/dehashImage", {
                    method: "POST",
                    body: formData,
                    headers: {
                      "content-type": "multipart/form-data",
                    },
                  })
                    .then((ret) => {
                      ret
                        .json()
                        .then((data) => {
                          props.setToken(String(data.id));
                        })
                        .catch((err) => {
                          props.updateAttempt();
                          alert("Try again!");
                        });
                    })
                    .catch((ret) => {
                      alert("Network Error!");
                    });
                }}
              >
                Submit
              </Button>
            </View>
          </ImageBackground>
        </>
      )}
      {!image && (
        <Camera
          style={{ flex: 1 }}
          // ratio="16:9"
          ref={(ref) => {
            setCameraRef(ref);
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              justifyContent: "flex-end",
              alignItems: "center",
              borderRadius: 20,
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                if (cameraRef) {
                  let image = await cameraRef.takePictureAsync({ quality: 0 });
                  setImage(image);
                  // console.log("clicked!");
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
          </View>
        </Camera>
      )}
    </>
  );
};

// export default class ShakingText extends Component{
export default function CameraScreen() {
  const [token, setToken] = useState(null);
  const [attempt, setAttempt] = useState(1);
  const [subheading, setSubheading] = useState(
    "Make sure the 4 corners are visible!"
  );

  useEffect(() => {
    if (attempt > 1)
      setSubheading("Try again! The 4 corners should be visible.");
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Subheading>{subheading}</Subheading>

      <View
        style={{
          height: "60%",
          width: "80%",
          marginTop: "4%",
          backgroundColor: "transparent",
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <CaptureScreen
          setToken={(token) => setToken(token)}
          updateAttempt={() => {
            setAttempt(attempt + 1);
          }}
        ></CaptureScreen>
      </View>
      <View
        style={{
          height: "10%",
          paddingTop: "4%",
          width: "70%",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TextInput
            label="Token number"
            value={token}
            onChangeText={(token) => setToken(token)}
            mode="outlined"
            style={{
              width: "70%",
            }}
            theme={{
              colors: { primary: "black", underlineColor: "transparent" },
            }}
          />
          <Button
            style={{
              width: "0%",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "2.5%",
              marginLeft: 10,
              // paddingLeft: "5%",
            }}
            // icon="check"
            mode="contained"
            color="black"
            onPress={() => {
              console.log("Send to server");
            }}
          >
            <Ionicons name="checkmark" size={24} color="white" />
          </Button>
        </View>
      </View>
    </View>
  );
}