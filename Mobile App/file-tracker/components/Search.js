import React, { useState, useEffect } from "react";
import { TextInput, IconButton, List, Button } from "react-native-paper";
import {
  View,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  ScrollView,
  Modal,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const db = {
  offices: {
    options: [
      "Accounts",
      "Research",
      "ICSR",
      "Dean SA",
      "Dean Acad",
      "HOD CSE",
      "HOD EE",
      "HOD MME",
      "HOD ME",
      "Dean Research",
      "Director",
      "HOD Chemistry",
    ],
    placeholder: "Search for an office",
  },
  fileTypes: {
    options: ["Form", "Bill", "Letter"],
    placeholder: "Search for a file type",
  },
  fileActions: {
    options: ["Forward", "Accept", "Reject", "Requires input"],
    placeholder: "Search for an action",
  },
};

const Search = (props) => {
  const [allData, setAllData] = useState(db[props.searchFor]["options"]);
  const [currData, setCurrData] = useState(allData);
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState(
    db[props.searchFor]["placeholder"]
  );
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    var reg = new RegExp(query.split("").join("\\w*").replace(/\W/, ""), "i");
    var newData = allData.filter((option) => {
      if (option.match(reg)) {
        return option;
      }
    });
    setCurrData(newData);
  }, [query]);

  return (
    <Modal
      animationType="slide"
      visible={props.showModal}
      useNativeDriver={true}
      animationIn="slideInLeft"
      animationOut="slideOutRight"
      onRequestClose={() => {
        if (props.multiple) props.setOption(checked);
        // console.log("checkd", checked);
        props.closeModal();
      }}
    >
      <ImageBackground
        style={{ flex: 1, resizeMode: "cover" }}
        source={{
          uri: "https://wallpaperaccess.com/full/3063516.png",
        }}
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
                            checked.indexOf(option) !== -1 && (
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
