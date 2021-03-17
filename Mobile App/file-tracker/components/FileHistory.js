import React, { useState, useEffect } from "react";
import Search from "./Search";
import {
  Title,
  Subheading,
  Paragraph,
  Caption,
  IconButton,
  TouchableRipple,
} from "react-native-paper";
import {
  View,
  ImageBackground,
  RefreshControl,
  StatusBar,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

const FileHistory = () => {
  const [files, setFiles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  return (
    <ImageBackground
      style={{ flex: 1, resizeMode: "cover" }}
      source={require("../assets/white_bg.png")}
      imageStyle={{ opacity: 0.5 }}
      resizeMode={"cover"}
    >
      <View style={{ backgroundColor: "transparent", height: "100%" }}>
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
            flex: 1,
            backgroundColor: "transparent",
            justifyContent: "center",
            paddingLeft: "8%",
            marginTop: 3.5 * StatusBar.currentHeight,
          }}
        >
          <Title style={{ marginLeft: "1%", fontSize: 30, flexWrap: "wrap" }}>
            File history
          </Title>
          <ScrollView
            style={{
              width: "100%",
              marginTop: "3%",
            }}
            contentContainerStyle={{
              alignItems: "center",
              paddingBottom: "10%",
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  // dummy logic
                  var new_files = [
                    {
                      name: "Budget Approval",
                      status: "Pending Dean's approval",
                      trackingID: String(
                        Math.floor(Math.random() * (1000000 - 100000) + 100000)
                      ),
                      received: 0,
                    },
                  ].concat(files);
                  setFiles(new_files);
                }}
              />
            }
          >
            <View style={{ width: "100%" }}>
              {files.length === 0 && (
                <Subheading style={{ marginTop: "4%", paddingLeft: "2%" }}>
                  No files to show!
                </Subheading>
              )}

              {files.map((file, idx) => {
                return (
                  <View
                    style={{
                      width: "85%",
                      height: 100,
                      borderColor: "black",
                      borderWidth: 1,
                      borderRadius: 10,
                      marginTop: idx === 0 ? "1.25%" : "4%",
                      overflow: "hidden",
                    }}
                    key={file.trackingID}
                  >
                    <TouchableRipple
                      onPress={() => {}}
                      rippleColor="rgba(0, 0, 0, .15)"
                      style={{
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <View
                          style={{
                            paddingVertical: "2%",
                            paddingLeft: "5%",
                          }}
                        >
                          <Subheading style={{ fontWeight: "bold" }}>
                            {file.name}
                          </Subheading>
                          <Paragraph style={{ fontStyle: "italic" }}>
                            {file.status}
                          </Paragraph>
                          <Caption>Tracking ID: {file.trackingID}</Caption>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            alignItems: "flex-end",
                            justifyContent: "center",
                            paddingRight: "5%",
                          }}
                        >
                          <AntDesign name="right" size={16} color="black" />
                        </View>
                      </View>
                    </TouchableRipple>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
};

export default FileHistory;
