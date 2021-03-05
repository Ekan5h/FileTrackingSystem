import React, { useState } from "react";
import {
  View,
  ImageBackground,
  StatusBar,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Button, Text, Title, IconButton, Caption } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const FileTimeline = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [file, setFile] = useState({
    token: props.token,
    name: "Budget approval",
    history: [
      {
        date: "4:20 pm, February 5, 2019",
        action: "Created by Dr. Doctor",
        remarks: "This is my budget",
      },
    ],
  });

  return (
    <ImageBackground
      style={{ flex: 1, resizeMode: "cover" }}
      source={{
        uri: "https://wallpaperaccess.com/full/3063516.png",
      }}
      imageStyle={{ opacity: 1 }}
      resizeMode={"cover"}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "transparent",
          paddingLeft: "8%",
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
        <View
          style={{
            marginTop: 3.5 * StatusBar.currentHeight,
            flex: 1,
            width: "100%",
          }}
        >
          <View style={{ height: "22%" }}>
            <Title style={{ fontSize: 30, flexWrap: "wrap" }}>
              {file.name}
            </Title>
            <Caption style={{ fontSize: 15 }}>
              Tracking ID: {file.token}
            </Caption>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                height: "auto",
              }}
            >
              <Button
                style={{
                  width: "40%",
                  height: "52%",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "5%",
                }}
                mode="contained"
                color="black"
                onPress={() => {}}
              >
                <AntDesign name="scan1" size={14} color="white" />
                {"  "}Scan
              </Button>

              <Button
                style={{
                  width: "40%",
                  height: "52%",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "5%",
                  paddingVertical: "1%",
                  marginLeft: "2%",
                }}
                mode="contained"
                color="black"
                onPress={() => {}}
              >
                <AntDesign name="closecircleo" size={14} color="white" />
                {"  "} Close
              </Button>
            </View>
          </View>

          <View style={{ width: "100%", marginLeft: "-2%", height: "78%" }}>
            <ScrollView
              style={{
                width: "100%",
              }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    // dummy logic
                    var oldfile = { ...file };
                    var new_history = [
                      {
                        date:
                          "4:20 pm, February 5, " +
                          String(
                            Math.floor(Math.random() * (9999 - 1001) + 1001)
                          ),
                        action: "Scanned by Dr. Doctor",
                        remarks: "Nice budget",
                      },
                    ].concat(file.history);
                    oldfile.history = new_history;
                    setFile(oldfile);
                  }}
                />
              }
            >
              <View
                style={{
                  borderLeftWidth: 2,
                  backgroundColor: "transparent",
                  paddingTop: "8%",
                  width: "100%",
                  paddingRight: "5%",
                  marginLeft: "2%",
                  marginTop: "2%",
                }}
              >
                {file.history.map((event) => {
                  return (
                    <View
                      style={{
                        paddingLeft: "10%",
                        position: "relative",
                        marginBottom: "10%",
                      }}
                      key={event.date}
                    >
                      <Caption>{event.date}</Caption>
                      <FontAwesome
                        name="circle"
                        size={14}
                        color="black"
                        style={{
                          position: "absolute",
                          top: "42%",
                          left: "-2.4%",
                        }}
                      />
                      <Text
                        style={{ fontWeight: "bold", paddingBottom: "0.8%" }}
                      >
                        {event.action}
                      </Text>
                      <Text>
                        {event.remarks
                          ? "Remarks: " + event.remarks
                          : "No remark added"}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default FileTimeline;
