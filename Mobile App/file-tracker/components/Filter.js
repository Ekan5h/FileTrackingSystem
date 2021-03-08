import React, { useState, useEffect } from "react";
import {
  Button,
  Text,
  Title,
  TextInput,
  IconButton,
  Provider,
  Caption,
  DefaultTheme,
  DarkTheme,
} from "react-native-paper";
import {
  View,
  ImageBackground,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Platform,
} from "react-native";
import Search from "./Search";
import DateTimePicker from "@react-native-community/datetimepicker";

Date.prototype.convert = function () {
  var date = this.toDateString().slice(4);
  return [date.slice(0, 6), ",", date.slice(6)].join("");
};

const Filter = (props) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currStartDate, setCurrStartDate] = useState(new Date());
  const [currEndDate, setCurrEndDate] = useState(new Date());
  const [fileTypes, setFileTypes] = useState([]);
  const [handledBy, setHandledBy] = useState([]);
  const [fileTypesText, setFileTypesText] = useState("");
  const [handledByText, setHandledByText] = useState("");
  const [fileMenuVisible, setFileMenuVisible] = useState(false);
  const [officeMenuVisible, setOfficeMenuVisible] = useState(false);
  const [errors, setErrors] = useState([undefined]);

  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowStart(Platform.OS === "ios");
    setStartDate(currentDate);
    setCurrStartDate(currentDate);
  };
  const onEndDateChange = (event, selectedDate) => {
    setShowEnd(Platform.OS === "ios");
    setEndDate(selectedDate);
    setCurrEndDate(selectedDate);
  };

  const openFileMenu = () => setFileMenuVisible(true);
  const closeFileMenu = () => setFileMenuVisible(false);
  const openOfficeMenu = () => setOfficeMenuVisible(true);
  const closeOfficeMenu = () => setOfficeMenuVisible(false);
  const validateForm = () => {
    var newErrors = [undefined];
    if (startDate && endDate && startDate > endDate)
      newErrors[0] = "Please check the order of the dates";
    setErrors(newErrors);
  };

  useEffect(() => {
    setFileTypesText(fileTypes.join(", "));
    setHandledByText(handledBy.join(", "));
  }, [fileTypes, handledBy]);

  return (
    <Provider>
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
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                justifyContent: "center",
                paddingLeft: "8%",
                // marginTop: "0%",
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
              <Title style={{ fontSize: 30, flexWrap: "wrap" }}>Filter</Title>
              <Pressable onPress={openFileMenu} style={{ width: "70%" }}>
                <TextInput
                  label="File types"
                  value={fileTypesText}
                  mode="outlined"
                  style={{
                    marginTop: "6%",
                  }}
                  theme={{
                    colors: {
                      primary: "black",
                      underlineColor: "transparent",
                    },
                  }}
                  editable={false}
                  right={
                    <TextInput.Icon
                      name="chevron-right"
                      onPress={openFileMenu}
                    />
                  }
                />
              </Pressable>
              <Search
                searchFor="fileTypes"
                showModal={fileMenuVisible}
                closeModal={closeFileMenu}
                setOption={setFileTypes}
                multiple={true}
                checked={fileTypes}
              />
              <Pressable onPress={openOfficeMenu} style={{ width: "70%" }}>
                <TextInput
                  label="Handled by"
                  value={handledByText}
                  mode="outlined"
                  style={{
                    marginTop: "3%",
                  }}
                  theme={{
                    colors: {
                      primary: "black",
                      underlineColor: "transparent",
                    },
                  }}
                  editable={false}
                  right={
                    <TextInput.Icon
                      name="chevron-right"
                      onPress={openOfficeMenu}
                    />
                  }
                />
              </Pressable>
              <Search
                searchFor="offices"
                showModal={officeMenuVisible}
                closeModal={closeOfficeMenu}
                setOption={setHandledBy}
                multiple={true}
                checked={handledBy}
              />
              <Pressable
                onPress={() => setShowStart(true)}
                style={{ width: "70%" }}
              >
                <TextInput
                  label="After"
                  value={startDate ? startDate.convert() : ""}
                  mode="outlined"
                  style={{
                    marginTop: "3%",
                  }}
                  theme={{
                    colors: {
                      primary: "black",
                      underlineColor: "transparent",
                    },
                  }}
                  editable={false}
                  right={
                    <TextInput.Icon
                      name="chevron-right"
                      onPress={() => setShowStart(true)}
                    />
                  }
                />
              </Pressable>
              {showStart && (
                <DateTimePicker
                  testID="startDate"
                  value={currStartDate}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onStartDateChange}
                />
              )}
              <Pressable
                onPress={() => setShowEnd(true)}
                style={{ width: "70%" }}
              >
                <TextInput
                  label="Before"
                  value={endDate ? endDate.convert() : ""}
                  mode="outlined"
                  style={{
                    marginTop: "3%",
                  }}
                  theme={{
                    colors: {
                      primary: "black",
                      underlineColor: "transparent",
                    },
                  }}
                  editable={false}
                  right={
                    <TextInput.Icon
                      name="chevron-right"
                      onPress={() => setShowEnd(true)}
                    />
                  }
                />
              </Pressable>
              {showEnd && (
                <DateTimePicker
                  testID="endDate"
                  value={currEndDate}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onEndDateChange}
                />
              )}
              {errors[0] && (
                <Text
                  style={{
                    color: "rgb(176, 1, 1)",
                    marginTop: "1%",
                    marginLeft: "1%",
                  }}
                >
                  {errors[0]}
                </Text>
              )}
              <Button
                icon="check"
                style={{
                  width: "40%",
                  height: 48,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "5%",
                  paddingVertical: "1%",
                }}
                mode="contained"
                color="black"
                onPress={() => {
                  validateForm();
                }}
              >
                Confirm
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </Provider>
  );
};

export default Filter;
