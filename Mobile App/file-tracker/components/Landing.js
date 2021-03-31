import React, { useState, useEffect } from "react";
import {
  Appbar,
  Button,
  TouchableRipple,
  Menu,
  Subheading,
  Paragraph,
  Caption,
  FAB,
  IconButton,
  Provider,
} from "react-native-paper";
import {
  View,
  RefreshControl,
  ScrollView,
  ImageBackground,
  Animated,
  Image,
  StatusBar,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FileTimeline from "./FileTimeline";
import FileAction from "./FileAction";
import ScanToken from "./ScanToken";
import Search from "./Search";

const Landing = ({ navigation, success }) => {
  const [allFiles, setAllFiles] = useState([]); // initialise with all files in the current tab. This will be passed to the search component
  const [refreshing, setRefreshing] = useState(false);
  const [viewingFile, setViewingFile] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [postScanning, setPostScanning] = useState(null);
  const [fileAction, setFileAction] = useState(false);
  const [token, setToken] = useState(null);
  const [fileName, setFileName] = useState("");
  const [files, setFiles] = useState([]); // pass filter object as props
  const [menuVisible, setMenuVisible] = useState(false);
  const [isOfficeAccount, setIsOfficeAccount] = useState(false);
  const [office, setOffice] = useState("");
  const [offices, setOffices] = useState(null);
  const [tab, setTab] = useState(0);
  const [x0, setX0] = useState(0);
  const [x1, setX1] = useState(0);
  const [x2, setX2] = useState(0);
  const [translateX, setTranslateX] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSuccessInit, setShowSuccessInit] = useState(false);
  const [searchedFilesMenuVisible, setSearchedFilesMenuVisible] = useState(
    false
  );
  const openSearchedFilesMenu = () => setSearchedFilesMenuVisible(true);
  const closeSearchedFilesMenu = () => setSearchedFilesMenuVisible(false);

  if (offices == null)
    AsyncStorage.getItem("@offices").then((ret) => {
      if (ret == null) return 0;
      ret = JSON.parse(ret);
      if (ret.length) {
        setIsOfficeAccount(true);
        setTab(0);
      }
      setOffices(ret);
      AsyncStorage.getItem("@office").then((ret) => {
        if (ret != null) {
          setOffice(ret);
        }
      });
    });

  const handleSlide = (x) => {
    Animated.spring(translateX, {
      toValue: x,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (success && !showSuccessInit) {
      setShowSuccess(true);
      setShowSuccessInit(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }

    // Make API call based on value of tab. (1 = queue, 2=received, 3 = sent)
    // Make sure to setLoading to false
    if (tab === 0 && loading) {
      fetch("http:192.168.1.6:5000/showFiles", { method: "GET" })
        .then(async (ret) => {
          ret = await ret.json();
          setFiles(ret);
          setLoading(false);
        })
        .catch(() => {
          alert("Could not get files!");
          setLoading(false);
        });
    } else if (tab === 1) {
      fetch("http:192.168.1.6:5000/showReceived?office=" + office, {
        method: "GET",
      })
        .then(async (ret) => {
          ret = await ret.json();
          setFiles(ret);
          setLoading(false);
        })
        .catch(() => {
          alert("Could not get files!");
          setLoading(false);
        });
    } else if (tab === 2) {
      fetch("http:192.168.1.6:5000/showQueue?office=" + office, {
        method: "GET",
      })
        .then(async (ret) => {
          ret = await ret.json();
          setFiles(ret);
          setLoading(false);
        })
        .catch(() => {
          alert("Could not get files!");
          setLoading(false);
        });
    }
  }, [tab, office, showSuccess]);

  return (
    <Provider>
      {showSuccess && (
        <ImageBackground
          imageStyle={{ opacity: 0.5 }}
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            resizeMode: "cover",
          }}
          source={require("../assets/white_bg.png")}
          resizeMode={"cover"} // cover or contain its upto you view look
        >
          <Image
            style={{ height: 400, width: 400 }}
            source={require("../assets/success.gif")}
          />
        </ImageBackground>
      )}
      <ImageBackground
        style={{ flex: 1, resizeMode: "cover" }}
        source={require("../assets/black_bg.jpg")}
        resizeMode={"cover"} // cover or contain its upto you view look
      >
        <Appbar.Header
          style={{
            backgroundColor: "rgba(0, 0, 0, 0)",
            elevation: 0,
            paddingTop: 5,
          }}
        >
          <Appbar.Action icon="menu" onPress={navigation.openDrawer} />
          {isOfficeAccount && (
            <>
              <Appbar.Content
                onPress={() => setMenuVisible(true)}
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  padding: 10,
                }}
                title={office}
              />
              {offices != null && (
                <Menu
                  visible={menuVisible}
                  style={{ width: "90%" }}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={
                    <Appbar.Action
                      onPress={() => setMenuVisible(true)}
                      color="white"
                      icon="chevron-down"
                    />
                  }
                >
                  {offices.map((x) => {
                    return (
                      <Menu.Item
                        onPress={() => {
                          if (tab != 0) setLoading(true);
                          setOffice(x.office);
                          setMenuVisible(false);
                          AsyncStorage.setItem("@office", x.office);
                        }}
                        title={x.office}
                        key={x.office}
                      />
                    );
                  })}
                </Menu>
              )}
            </>
          )}
        </Appbar.Header>

        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          <View
            style={{
              height: "25%",
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
                  width: "65%",
                }}
                color="white"
                onPress={() => {
                  setPostScanning("scan");
                  setScanning(true);
                }}
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
                marginTop: isOfficeAccount ? "3%" : "-10%",
                width: "65%",
              }}
              color="white"
              onPress={() => {
                navigation.navigate("NewFile");
              }}
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
                setPostScanning("track");
                setScanning(true);
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
                      setRefreshing(true);
                      let url = "http:192.168.1.6:5000/showFiles";
                      if (tab == 1)
                        url =
                          "http:192.168.1.6:5000/showReceived?office=" + office;
                      else if (tab == 2)
                        url =
                          "http:192.168.1.6:5000/showQueue?office=" + office;

                      fetch(url, { method: "GET" })
                        .then(async (ret) => {
                          ret = await ret.json();
                          setFiles(ret);
                          setRefreshing(false);
                        })
                        .catch(() => {
                          alert("Could not get files!");
                          setRefreshing(false);
                        });
                    }}
                  />
                }
              >
                {isOfficeAccount && (
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
                      Created
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
                      Queue
                    </Button>
                  </View>
                )}

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
                      <Subheading
                        style={{ marginTop: isOfficeAccount ? "4%" : "20%" }}
                      >
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
                            onPress={() => {
                              if (tab == 0) {
                                setToken(file.trackingID);
                                setFileName(file.name);
                                setViewingFile(true);
                              } else if (tab == 1) {
                                setToken(file.trackingID);
                                setFileName(file.name);
                                setFileAction(true);
                              }
                            }}
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
                                {tab !== 2 ? (
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
                                      color="green"
                                      size={22}
                                      style={{ margin: 0 }}
                                      onPress={() => {
                                        let formData = new FormData();
                                        formData.append("tag", file.trackingID);
                                        fetch(
                                          "http://192.168.1.6:5000/confirmFile",
                                          {
                                            method: "POST",
                                            body: formData,
                                            headers: {
                                              "content-type":
                                                "multipart/form-data",
                                            },
                                          }
                                        )
                                          .then(async (ret) => {
                                            ret = await ret.json();
                                            if (ret.error) {
                                              alert("Some error occurred!");
                                              return 0;
                                            } else {
                                              setFiles((files) => {
                                                return files.filter(
                                                  (x) =>
                                                    x.trackingID !=
                                                    file.trackingID
                                                );
                                              });
                                            }
                                          })
                                          .catch(() =>
                                            alert("Could not update status!")
                                          );
                                      }}
                                    />
                                    <IconButton
                                      icon="close"
                                      color="red"
                                      size={22}
                                      style={{ margin: 0 }}
                                      onPress={() => {}}
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
                icon="file-search"
                color="white"
                small
                // size={30}
                style={{
                  position: "absolute",
                  bottom: "17%",
                  right: "6%",
                  backgroundColor: "black",
                }}
                onPress={openSearchedFilesMenu}
              />
              <FAB
                icon="filter"
                color="white"
                small
                // size={30}
                style={{
                  position: "absolute",
                  bottom: "6%",
                  right: "6%",
                  backgroundColor: "black",
                }}
                onPress={() => {}}
              />
              {allFiles && (
                <Search
                  searchFor="files"
                  files={allFiles}
                  showModal={searchedFilesMenuVisible}
                  closeModal={closeSearchedFilesMenu}
                  setOption={setFiles}
                  multiple={true}
                  checked={[]}
                  addNew={false}
                />
              )}
            </View>
          </View>
        </View>
      </ImageBackground>
      {token && (
        <FileTimeline
          showModal={viewingFile}
          token={token}
          name={fileName}
          closeModal={() => {
            setViewingFile(false);
            setToken(null);
          }}
        />
      )}
      {token && (
        <FileAction
          showModal={fileAction}
          token={token}
          name={fileName}
          navigation={navigation}
          office={office}
          closeModal={() => {
            setFileAction(false);
            setToken(null);
          }}
        />
      )}
      <ScanToken
        showModal={scanning}
        closeModal={() => {
          setScanning(false);
        }}
        onSubmit={
          postScanning == "track"
            ? (tag) => {
                setToken(tag);
                setFileName("");
                setViewingFile(true);
              }
            : (tag) => {
                fetch(
                  "http://192.168.1.6:5000/confirmed?tag=" +
                    tag +
                    "&office=" +
                    office,
                  { method: "GET" }
                )
                  .then(async (ret) => {
                    ret = await ret.json();
                    if (ret.error) {
                      alert("Some error occurred!");
                      return 0;
                    }
                    setFileName(ret.name);
                    if (ret.confirmed) {
                      setToken(tag);
                      setFileAction(true);
                      return 0;
                    }
                    let formData = new FormData();
                    formData.append("tag", tag);
                    fetch("http://192.168.1.6:5000/confirmFile", {
                      method: "POST",
                      body: formData,
                      headers: {
                        "content-type": "multipart/form-data",
                      },
                    })
                      .then(async (ret) => {
                        ret = await ret.json();
                        if (ret.error) {
                          alert("Some error occurred!");
                          return 0;
                        } else if (tab == 2) {
                          setFiles((files) => {
                            return files.filter((x) => x.trackingID != tag);
                          });
                        }
                      })
                      .catch(() => alert("Could not update status!"));
                  })
                  .catch(() => alert("Error contacting server!"));
              }
        }
      />
      <StatusBar backgroundColor="#1b1e25" barStyle="light-content" />
    </Provider>
  );
};

export default Landing;
