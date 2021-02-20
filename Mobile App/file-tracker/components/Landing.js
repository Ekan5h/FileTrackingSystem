import React, { useState } from "react";
import {
  Button,
  TouchableRipple,
  Subheading,
  Paragraph,
  Caption,
} from "react-native-paper";
import { View, RefreshControl } from "react-native";
import ScrollView from "expo-faded-scrollview";
import { AntDesign } from "@expo/vector-icons";

const Landing = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [files, setFiles] = useState([]);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <View
        style={{
          height: "30%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          mode="outlined"
          style={{
            justifyContent: "center",
            borderColor: "white",
            borderWidth: 0.5,
            marginTop: "10%",
            width: "65%",
          }}
          color="white"
          onPress={() => {}}
        >
          <AntDesign name="addfile" size={14} color="white" />
          {"   "}Create new file
        </Button>
        <Button
          mode="outlined"
          style={{
            justifyContent: "center",
            borderColor: "white",
            borderWidth: 0.5,
            marginTop: "5%",
            width: "65%",
          }}
          color="white"
          onPress={() => {}}
        >
          <AntDesign name="search1" size={14} color="white" />
          {"   "}Track existing file
        </Button>
      </View>
      <View
        style={{
          backgroundColor: "white",
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          overflow: "hidden",
          flex: 1,
          alignItems: "center",
          paddingTop: "4%",
        }}
      >
        <View
          style={{
            paddingBottom: "3%",
            width: "100%",
            height: "8%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Subheading style={{ fontSize: 18 }}>
            Your tracking history
          </Subheading>
        </View>
        <View style={{ flex: 1, width: "100%" }}>
          <ScrollView
            style={{
              width: "100%",
            }}
            contentContainerStyle={{
              alignItems: "center",
              paddingBottom: "15%",
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
                    },
                  ].concat(files);
                  setFiles(new_files);
                }}
              />
            }
            allowStartFade={true}
            allowEndFade={false}
          >
            {files.map((file, idx) => {
              return (
                <View
                  style={{
                    width: "85%",
                    height: 100,
                    borderColor: "black",
                    borderWidth: 1,
                    borderRadius: 10,
                    marginTop: idx === 0 ? "2%" : "4%",
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
                        style={{ paddingVertical: "2%", paddingLeft: "5%" }}
                      >
                        <Subheading style={{ fontWeight: "bold" }}>
                          {file.name}
                        </Subheading>
                        <Paragraph style={{ fontStyle: "italic" }}>
                          {file.status}
                        </Paragraph>
                        <Caption>Tracking ID: {file.trackingID}</Caption>
                        {/* <Caption>
                    <Entypo name="calendar" size={14} color="rgba(0,0,0,0.54)" />
                    {"  "}21st February, 2021
                  </Caption> */}
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
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default Landing;
