import React, { useState, useEffect } from "react";
import { TextInput, IconButton, List, Button } from "react-native-paper";
import {
  View,
  KeyboardAvoidingView,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

var db = {
  offices: {
    options: [],
    placeholder: "Search for an office",
  },
  users: {
    options: [],
    placeholder: "Search for a user",
  },
  fileTypes: {
    options: ["Form", "Bill", "Letter"],
    placeholder: "Search for a file type",
  },
  fileActions: {
    options: [
      "Processed & Forwarded",
      "Clarifications/Inputs needed",
      "Approved and Returned Finally",
      "Approved and Kept Finally",
      "Not Approved and Returned Finally",
      "Not Approved and Kept Finally",
    ],
    placeholder: "Search for an action",
  },
  tags: {
    options: ["Important", "Budget", "Research", "Ignore", "Processed"],
    placeholder: "Search for a tag",
  },
}

const Search = (props) => {
  const [allData, setAllData] = useState(db[props.searchFor]["options"]);
  const [currData, setCurrData] = useState(allData);
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState(
    db[props.searchFor]["placeholder"]
  );
  const [checked, setChecked] = useState(props.checked?props.checked:[]);
  const [showAddNew, setShowAddNew] = useState(false);
  const [newTag, setNewTag] = useState("");


  if(props.searchFor == 'offices' && allData.length==0){
    fetch('http://192.168.1.6:5000/getOffices', {method:'GET'}).then(
      async (ret) => {
        ret = await ret.json();
        setAllData(ret.map(x=>x.name));
      }
    )
  }else if(props.searchFor == 'users' && allData.length==0){
    fetch('http://192.168.1.6:5000/getUsers', {method:'GET'}).then(
      async (ret) => {
        ret = await ret.json();
        setAllData(ret.map(x=>x.name+', '+x.email));
      }
    )
  }

  useEffect(() => {
    var reg = new RegExp(query.split("").join("\\w*").replace(/\W/, ""), "i");
    var newData = allData.filter((option) => {
      if (option.match(reg)) {
        return option;
      }
    });
    setCurrData(newData);
  }, [query, allData]);

  return (
    <Modal
      animationType="slide"
      visible={props.showModal}
      useNativeDriver={true}
      animationIn="slideInLeft"
      animationOut="slideOutRight"
      onRequestClose={() => {
        if (props.multiple) props.setOption(checked);
        props.closeModal();
      }}
    >
      <ImageBackground
        style={{ flex: 1, resizeMode: "cover" }}
        source={require("../assets/white_bg.png")}
        imageStyle={{ opacity: 0.5 }}
        resizeMode={"cover"}
      >
        <TouchableWithoutFeedback
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
          }}
          onPress={() => {
            Keyboard.dismiss();
          }}
          accessible={false}
        >
          <View style={{ backgroundColor: "transparent", height: "100%" }}>
            <IconButton
              icon="chevron-down"
              color="black"
              size={30}
              style={{
                position: "absolute",
                top: 1 * StatusBar.currentHeight,
                left: 4,
              }}
              onPress={() => {
                if (props.multiple) props.setOption(checked);
                props.closeModal();
              }}
            />

            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                justifyContent: "flex-start",
                paddingLeft: "10%",
                marginTop: 3.2 * StatusBar.currentHeight,
              }}
            >
              <View style={{ width: "100%", height: "100%" }}>
                <TextInput
                  placeholder={placeholder}
                  value={query}
                  maxLength={20}
                  onChangeText={(input) => setQuery(input)}
                  mode="outlined"
                  selectionColor="rgba(0, 0, 0, 0.2)"
                  style={{
                    width: "80%",
                    marginBottom: "5%",
                  }}
                  theme={{
                    colors: {
                      primary: "black",
                      underlineColor: "transparent",
                    },
                  }}
                  left={
                    <TextInput.Icon
                      name={() => (
                        <AntDesign name="search1" size={19} color="black" />
                      )}
                      onPress={() => {}}
                    />
                  }
                />
                {props.searchFor === "tags" && props.addNew && (
                  <>
                    <View>
                      <List.Item
                        title="Add new tag"
                        onPress={() => {
                          console.log("press");
                          setShowAddNew(true);
                        }}
                        style={{
                          width: "78%",
                          borderBottomWidth: 1,
                          borderBottomColor: "black",
                          paddingVertical: "2%",
                          paddingLeft: "0%",
                        }}
                        left={() => (
                          <Feather
                            name="plus"
                            size={18}
                            color="black"
                            style={{ marginTop: "4%", marginRight: "1%" }}
                          />
                        )}
                      />
                    </View>

                    <Modal
                      animationType="slide"
                      visible={showAddNew}
                      useNativeDriver={true}
                      animationIn="slideInLeft"
                      animationOut="slideOutRight"
                      onRequestClose={() => {
                        setShowAddNew(false);
                      }}
                      transparent={true}
                      opacity={1}
                    >
                      <View
                        style={{
                          backgroundColor: "rgba(0,0,0,0.6)",
                          alignItems: "center",
                          justifyContent: "center",
                          flex: 1,
                        }}
                      >
                        <KeyboardAvoidingView
                          behavior="padding"
                          style={{
                            backgroundColor: "white",
                            width: 0.85 * Dimensions.get("window").width,
                            height: 0.35 * Dimensions.get("window").height,
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            borderRadius: 10,
                          }}
                        >
                          <IconButton
                            icon="close"
                            color="black"
                            style={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                            }}
                            onPress={() => {
                              setShowAddNew(false);
                              setNewTag("");
                            }}
                          />

                          <TextInput
                            placeholder="New tag"
                            caretHidden={true}
                            value={newTag}
                            maxLength={10}
                            onChangeText={(input) => setNewTag(input)}
                            mode="outlined"
                            selectionColor="rgba(0, 0, 0, 0.2)"
                            style={{
                              width: "80%",
                              marginBottom: "3%",
                              marginTop: "4%",
                              textAlign: "center",
                            }}
                            theme={{
                              colors: {
                                primary: "black",
                                underlineColor: "transparent",
                              },
                            }}
                            textAlign={"center"}
                          />

                          <Button
                            style={{
                              width: "80%",
                              height: "20%",
                              justifyContent: "center",
                            }}
                            contentStyle={{
                              width: "100%",
                            }}
                            mode="contained"
                            color="black"
                            onPress={() => {
                              var newAllData = [...allData];
                              newAllData.push(newTag);
                              setAllData(newAllData);
                              setShowAddNew(false);
                              setNewTag("");
                              // API CALL TO ADD TAG FOR THIS USER
                            }}
                          >
                            Add new tag
                          </Button>
                        </KeyboardAvoidingView>
                      </View>
                    </Modal>
                  </>
                )}
                <ScrollView
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  contentContainerStyle={{
                    alignItems: "center",
                    paddingBottom: "15%",
                  }}
                  keyboardShouldPersistTaps={"handled"}
                >
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {currData.map((option) => {
                      return (
                        <List.Item
                          key={option}
                          title={option}
                          onPress={() => {
                            if (!props.multiple) {
                              props.setOption(option);
                              props.closeModal();
                            }
                            var idx = checked.indexOf(option);
                            if (idx == -1) {
                              var newChecked = checked.concat([option]);
                              setChecked(newChecked);
                            } else {
                              var newChecked = checked.filter(
                                (c) => c !== option
                              );
                              setChecked(newChecked);
                            }
                          }}
                          style={{
                            width: "78%",
                            borderBottomWidth: 0.2,
                            borderBottomColor: "black",
                            paddingVertical: "2%",
                            paddingLeft: "0%",
                            // justifyContent: "center",
                          }}
                          right={() =>
                            checked.indexOf(option) !== -1 &&
                            props.multiple && (
                              <Feather
                                name="check"
                                size={18}
                                color="black"
                                style={{ marginTop: "4%", marginRight: "1%" }}
                              />
                            )
                          }
                        />
                      );
                    })}
                  </View>
                </ScrollView>
                <View
                  style={{
                    alignItems: "flex-end",
                    marginRight: "20.5%",
                    marginTop: "4%",
                    marginBottom: "10%",
                  }}
                >
                  <Button
                    color="black"
                    labelStyle={{ fontSize: 14 }}
                    compact={true}
                    onPress={() => setChecked([])}
                  >
                    Clear all
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </Modal>
  );
};

export default Search;
