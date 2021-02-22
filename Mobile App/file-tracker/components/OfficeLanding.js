import React, { useState } from "react";
import {
  Button,
  TouchableRipple,
  Subheading,
  Paragraph,
  Caption,
} from "react-native-paper";
import {
  View,
  RefreshControl,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OfficeLanding = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [files, setFiles] = useState([]);

  return (
    <>
      <ImageBackground
        style={{ flex: 1, resizeMode: "cover" }}
        source={{
          uri: "https://wallpapercave.com/wp/Dp3Xq6o.jpg",
        }}
        resizeMode={"cover"} // cover or contain its upto you view look
      >
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
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
                marginTop: "11%",
                width: "65%",
              }}
              color="white"
              onPress={() => {}}
            >
              <AntDesign name="scan1" size={14} color="white" />
              {"   "}Scan a file
            </Button>
            <Button
              mode="outlined"
              style={{
                justifyContent: "center",
                borderColor: "white",
                borderWidth: 0.5,
                marginTop: "3%",
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
                marginTop: "3%",
                width: "65%",
              }}
              color="white"
              onPress={() => {
                fetch("http://192.168.1.2:5000/logout")
                  .then(async () => {
                    try {
                      await AsyncStorage.removeItem("@email");
                    } catch {
                      alert("Could not logout. Clear data.");
                    }
                    navigation.navigate("LoginPage");
                  })
                  .catch(() => {
                    alert("Network Issues");
                  });
              }}
            >
              <AntDesign name="search1" size={14} color="white" />
              {"   "}Track existing file
            </Button>
          </View>
          <View
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              overflow: "hidden",
              flex: 1,
              alignItems: "center",
              paddingTop: "0%",
            }}
          >
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
                            Math.floor(
                              Math.random() * (1000000 - 100000) + 100000
                            )
                          ),
                        },
                      ].concat(files);
                      setFiles(new_files);
                    }}
                  />
                }
              >
                <View
                  style={{
                    marginTop: "3%",
                    alignItems: "center",
                  }}
                >
                  <Button
                    mode="outlined"
                    style={{
                      borderWidth: 0,
                    }}
                    // color="white"
                    color="black"
                    onPress={() => {}}
                  >
                    <Ionicons
                      name="ios-filter-outline"
                      size={18}
                      color="black"
                    />
                    {"  "}Filter
                  </Button>
                </View>

                {files.length === 0 ? (
                  <Subheading>No files to show!</Subheading>
                ) : (
                  <></>
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
                            style={{ paddingVertical: "2%", paddingLeft: "5%" }}
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
              </ScrollView>
            </View>
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default OfficeLanding;
