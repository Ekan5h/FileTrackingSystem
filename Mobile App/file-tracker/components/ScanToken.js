import React, { useState, useEffect } from "react";
import { View, ImageBackground, StatusBar } from "react-native";
import Capture from "./Capture";
import FileAction from "./FileAction";
import {
  Button,
  TextInput,
  Subheading,
  IconButton,
  Text,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

export default function ScanToken() {
  const [token, setToken] = useState(null);
  const [attempt, setAttempt] = useState(1);
  const [subheading, setSubheading] = useState(
    "Click a clear picture of the token."
  );
  const [showFileAction, setShowFileAction] = useState(false);
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
    if (attempt > 1) setSubheading("Try again or type the token instead!");
  });

  return (
    <ImageBackground
      style={{ flex: 1, resizeMode: "cover" }}
      source={require("../assets/white_bg.png")}
      imageStyle={{ opacity: 1 }}
      resizeMode={"cover"} // cover or contain its upto you view look
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
          paddingTop: "5%",
        }}
      >
        <IconButton
          icon="arrow-left"
          color="black"
          size={30}
          style={{
            position: "absolute",
            top: 1 * StatusBar.currentHeight,
            left: 4,
          }}
          onPress={() => {}}
        />
        <Subheading style={{ color: attempt > 1 ? "rgb(176, 1, 1)" : "black" }}>
          {subheading}
        </Subheading>

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
          <Capture
            onSubmit={(image) => {
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
                      setToken(String(data.id));
                    })
                    .catch((err) => {
                      setAttempt(attempt + 1);
                      alert("Try again!");
                    });
                })
                .catch((ret) => {
                  alert("Network Error!");
                });
            }}
          ></Capture>
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
            <FileAction
              token="123456"
              showModal={showFileAction}
              closeModal={() => setShowFileAction(false)}
            />
            <TextInput
              label="Token number"
              value={token}
              onChangeText={(token) => setToken(token)}
              mode="outlined"
              selectionColor="rgba(0, 0, 0, 0.2)"
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
                var error = ""; // set to error message if API call fails
                if (!error) setShowFileAction(true);
                else setTokenError(error);
              }}
            >
              <Ionicons name="checkmark" size={24} color="white" />
            </Button>
          </View>

          {tokenError !== "" && (
            <Text
              style={{
                color: "rgb(176, 1, 1)",
                marginTop: "5%",
                marginLeft: "1%",
              }}
            >
              {tokenError}
            </Text>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}
