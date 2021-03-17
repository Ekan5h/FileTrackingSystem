import React, { useState, useEffect } from "react";
import {
  Button,
  TouchableRipple,
  Subheading,
  Paragraph,
  Caption,
  FAB,
  IconButton,
} from "react-native-paper";
import {
  View,
  RefreshControl,
  ScrollView,
  ImageBackground,
  Animated,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// dummy data
var new_files = [
  {
    name: "Test name",
    status: "Pending Dean's approval",
    trackingID: String(Math.floor(Math.random() * (1000000 - 100000) + 100000)),
    received: 1,
  },
  {
    name: "Test name",
    status: "Pending Dean's approval",
    trackingID: String(Math.floor(Math.random() * (1000000 - 100000) + 100000)),
    received: -1,
  },
  {
    name: "Test name",
    status: "Pending Dean's approval",
    trackingID: String(Math.floor(Math.random() * (1000000 - 100000) + 100000)),
    received: 0,
  },
];

var more_new_files = [
  {
    name: "Another test name",
    status: "Pending Dean's approval",
    trackingID: String(Math.floor(Math.random() * (1000000 - 100000) + 100000)),
    received: 1,
  },
  {
    name: "Another test name",
    status: "Pending Dean's approval",
    trackingID: String(Math.floor(Math.random() * (1000000 - 100000) + 100000)),
    received: -1,
  },
];

const Landing = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [files, setFiles] = useState(new_files); // pass filter object as props
  const [isOfficeAccount, setIsOfficeAccount] = useState(false);
  const [tab, setTab] = useState(0);
  const [x0, setX0] = useState(0);
  const [x1, setX1] = useState(0);
  const [x2, setX2] = useState(0);
  const [translateX, setTranslateX] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(false);

  const handleSlide = (x) => {
    Animated.spring(translateX, {
      toValue: x,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const changeReceivedStatus = (trackingID, newStatus) => {
    var newFiles = [...files];
    var idx = newFiles.findIndex((file) => file.trackingID === trackingID);
    newFiles[idx].received = newStatus;
    setFiles(newFiles);
    // API CALL TO CHANGE RECEIVED STATUS
    // Received attribute: received=1, not received=-1, unmarked=0
  };

  useEffect(() => {
    // Make API call based on value of tab. (1 = queue, 2=received, 3 = sent)
    // Make sure to setLoading to false
    if (tab === 0) {
      setTimeout(() => {
        setFiles(new_files);
        setLoading(false);
      }, 2000);
    } else if (tab === 1) {
      setTimeout(() => {
        setFiles(new_files);
        setLoading(false);
      }, 1000);
    } else {
      setTimeout(() => {
        setFiles([]);
        setLoading(false);
      }, 1);
    }
  }, [tab]);

  return (
    <>
      <ImageBackground
        style={{ flex: 1, resizeMode: "cover" }}
        source={require("../assets/black_bg.jpg")}
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
            {isOfficeAccount && (
              <Button
                mode="outlined"
                style={{
                  justifyContent: "center",
                  borderColor: "white",
                  borderWidth: 0.5,
                  marginTop: "6%",
                  width: "65%",
                }}
                color="white"
                onPress={() => {}}
              >
                <AntDesign name="scan1" size={14} color="white" />
                {"   "}Scan a file
              </Button>
            )}

            <Button
              mode="outlined"
              style={{
                justifyContent: "center",
                borderColor: "white",
                borderWidth: 0.5,
                marginTop: isOfficeAccount ? "3%" : "6%",
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
                marginTop: isOfficeAccount ? "3%" : "5%",
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
                          received: 0,
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
                    marginBottom: "3%",
                    alignItems: "center",
                    width: "90%",
                    flexDirection: "row",
                    position: "relative",
                  }}
                >
                  <Animated.View
                    style={{
                      position: "absolute",
                      width: "33%",
                      height: "100%",
                      borderBottomColor: "black",
                      borderBottomWidth: 1,
                      transform: [{ translateX }],
                    }}
                  />
                  <Button
                    mode="outlined"
                    style={{
                      borderWidth: 0,
                      width: "33%",
                    }}
                    color={tab === 0 ? "black" : "grey"}
                    onPress={() => {
                      if (tab === 0) return;
                      setLoading(true);
                      handleSlide(x0);
                      setTab(0);
                    }}
                    onLayout={(event) => setX0(event.nativeEvent.layout.x)}
                  >
                    Queue
                  </Button>
                  <Button
                    mode="outlined"
                    style={{
                      borderWidth: 0,
                      width: "33%",
                    }}
                    color={tab === 1 ? "black" : "grey"}
                    onPress={() => {
                      if (tab === 1) return;
                      setLoading(true);
                      handleSlide(x1);
                      setTab(1);
                    }}
                    onLayout={(event) => setX1(event.nativeEvent.layout.x)}
                  >
                    Received
                  </Button>
                  <Button
                    mode="outlined"
                    style={{
                      borderWidth: 0,
                      width: "33%",
                    }}
                    color={tab === 2 ? "black" : "grey"}
                    onPress={() => {
                      if (tab === 2) return;
                      setLoading(true);
                      handleSlide(x2);
                      setTab(2);
                    }}
                    onLayout={(event) => setX2(event.nativeEvent.layout.x)}
                  >
                    Sent
                  </Button>
                </View>

                {loading && (
                  <View
                    style={{ flex: 1, width: "100%", alignItems: "center" }}
                  >
                    <Image
                      source={require("../assets/loading.gif")}
                      style={{ height: 200, width: 200 }}
                    />
                  </View>
                )}

                {!loading && (
                  <>
                    {files.length === 0 && (
                      <Subheading style={{ marginTop: "4%" }}>
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
                                <Caption>
                                  Tracking ID: {file.trackingID}
                                </Caption>
                              </View>
                              <View
                                style={{
                                  flex: 1,
                                  alignItems: "flex-end",
                                  justifyContent: "center",
                                  paddingRight: "5%",
                                }}
                              >
                                {tab !== 0 ? (
                                  <AntDesign
                                    name="right"
                                    size={16}
                                    color="black"
                                  />
                                ) : (
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      marginRight: "-4%",
                                    }}
                                  >
                                    <IconButton
                                      icon="check"
                                      color={
                                        file.received === 1
                                          ? "black"
                                          : "#c2c2c2"
                                      }
                                      size={22}
                                      style={{ margin: 0 }}
                                      onPress={() => {
                                        var newStatus =
                                          file.received === 1 ? 0 : 1;
                                        changeReceivedStatus(
                                          file.trackingID,
                                          newStatus
                                        );
                                      }}
                                    />
                                    <IconButton
                                      icon="close"
                                      color={
                                        file.received === -1
                                          ? "black"
                                          : "#c2c2c2"
                                      }
                                      size={22}
                                      style={{ margin: 0 }}
                                      onPress={() => {
                                        var newStatus =
                                          file.received === -1 ? 0 : -1;
                                        changeReceivedStatus(
                                          file.trackingID,
                                          newStatus
                                        );
                                      }}
                                    />
                                  </View>
                                )}
                              </View>
                            </View>
                          </TouchableRipple>
                        </View>
                      );
                    })}
                  </>
                )}
              </ScrollView>
              <FAB
                icon="filter"
                color="white"
                // medium
                // size={30}
                style={{
                  position: "absolute",
                  bottom: "6%",
                  right: "6%",
                  backgroundColor: "black",
                }}
                onPress={() => {}}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default Landing;
