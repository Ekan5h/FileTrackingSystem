import React, { useState } from "react";
import {
  Button,
  Text,
  Title,
  TextInput,
  Menu,
  IconButton,
  Provider,
} from "react-native-paper";
import {
  View,
  ImageBackground,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  StatusBar,
} from "react-native";

const NewFile = () => {
  const [name, setName] = useState("");
  const [officeMenuVisible, setOfficeMenuVisible] = useState(false);
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);
  const [fileTypes, setFileTypes] = useState(["Form", "Bill", "Letter"]);
  const [offices, setOffices] = useState(["Accounts", "Research", "ICSR"]);
  const [fileType, setFileType] = useState("");
  const [submittedTo, setSubmittedTo] = useState("");
  const [errors, setErrors] = useState([undefined, undefined, undefined]);

  const openOfficeMenu = () => setOfficeMenuVisible(true);
  const closeOfficeMenu = () => setOfficeMenuVisible(false);
  const openTypeMenu = () => setTypeMenuVisible(true);
  const closeTypeMenu = () => setTypeMenuVisible(false);
  const validateForm = () => {
    var newErrors = [undefined, undefined, undefined];
    if (name === "") newErrors[0] = "Please enter a file name";
    if (fileType === "") newErrors[1] = "Please select a file type";
    setErrors(newErrors);
  };

  return (
    <Provider>
      <ImageBackground
        style={{ flex: 1, resizeMode: "cover" }}
        source={{
          uri: "https://wallpaperaccess.com/full/3063516.png",
        }}
        imageStyle={{ opacity: 0.5 }}
        resizeMode={"cover"} // cover or contain its upto you view look
      >
        {/* <View
          style={{
            backgroundColor: "transparent",
            height: StatusBar.currentHeight,
          }}
        ></View> */}
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
                marginTop: "-5%",
              }}
            >
              <Title style={{ fontSize: 30, flexWrap: "wrap" }}>
                Create new file.
              </Title>
              <TextInput
                label="Name"
                value={name}
                maxLength={20}
                onChangeText={(name) => setName(name)}
                mode="outlined"
                selectionColor="rgba(0, 0, 0, 0.2)"
                style={{
                  width: "70%",
                  marginTop: "4%",
                }}
                theme={{
                  colors: {
                    primary: "black",
                    underlineColor: "transparent",
                  },
                }}
              />
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
              <Menu
                visible={typeMenuVisible}
                onDismiss={closeTypeMenu}
                anchor={
                  <Pressable onPress={openTypeMenu} style={{ width: "70%" }}>
                    <TextInput
                      label="File type"
                      value={fileType}
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
                          name="chevron-down"
                          onPress={openTypeMenu}
                        />
                      }
                    />
                  </Pressable>
                }
              >
                {fileTypes.map((type) => (
                  <Menu.Item
                    key={type}
                    onPress={() => {
                      setFileType(type);
                      setTypeMenuVisible(false);
                    }}
                    title={type}
                    style={{ width: Dimensions.get("window").width / 1.5 }}
                  />
                ))}
              </Menu>
              {errors[1] && (
                <Text
                  style={{
                    color: "rgb(176, 1, 1)",
                    marginTop: "1%",
                    marginLeft: "1%",
                  }}
                >
                  {errors[1]}
                </Text>
              )}
              <Menu
                visible={officeMenuVisible}
                onDismiss={closeOfficeMenu}
                anchor={
                  <Pressable onPress={openOfficeMenu} style={{ width: "70%" }}>
                    <TextInput
                      label="Submitted to"
                      value={submittedTo}
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
                          name="chevron-down"
                          onPress={openOfficeMenu}
                        />
                      }
                    />
                  </Pressable>
                }
              >
                {offices.map((office) => (
                  <Menu.Item
                    key={office}
                    onPress={() => {
                      setSubmittedTo(office);
                      setOfficeMenuVisible(false);
                    }}
                    title={office}
                    style={{ width: Dimensions.get("window").width / 1.5 }}
                  />
                ))}
              </Menu>
              <Button
                icon="check"
                style={{
                  width: "35%",
                  height: "6%",
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

export default NewFile;
