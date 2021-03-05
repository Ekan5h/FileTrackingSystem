import React, { useState } from "react";
import {
  Button,
  Text,
  Title,
  TextInput,
  Menu,
  IconButton,
  Provider,
  Caption,
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

const FileAction = (props) => {
  const [remarks, setRemarks] = useState("");
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [officeMenuVisible, setOfficeMenuVisible] = useState(false);
  const [offices, setOffices] = useState(["Accounts", "Research", "ICSR"]);
  const [actions, setActions] = useState(["Forward", "Close"]);
  const [forwardingTo, setForwardingTo] = useState("");
  const [action, setAction] = useState("");
  const [errors, setErrors] = useState([undefined, undefined, undefined]);
  const [file, setFile] = useState({
    token: props.token,
    name: "Budget approval",
  });

  const openActionMenu = () => setActionMenuVisible(true);
  const closeActionMenu = () => setActionMenuVisible(false);
  const openOfficeMenu = () => setOfficeMenuVisible(true);
  const closeOfficeMenu = () => setOfficeMenuVisible(false);
  const validateForm = () => {
    var newErrors = [undefined, undefined, undefined];
    if (action === "") newErrors[0] = "Please select an action";
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
                {file.name}
              </Title>
              <Caption style={{ fontSize: 14 }}>
                Tracking ID: {file.token}
              </Caption>

              <Menu
                visible={actionMenuVisible}
                onDismiss={closeActionMenu}
                anchor={
                  <Pressable onPress={openActionMenu} style={{ width: "70%" }}>
                    <TextInput
                      label="Action"
                      value={action}
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
                          name="chevron-down"
                          onPress={openActionMenu}
                        />
                      }
                    />
                  </Pressable>
                }
              >
                {actions.map((action) => (
                  <Menu.Item
                    key={action}
                    onPress={() => {
                      setAction(action);
                      setActionMenuVisible(false);
                    }}
                    title={action}
                    style={{ width: Dimensions.get("window").width / 1.5 }}
                  />
                ))}
              </Menu>
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
                visible={officeMenuVisible}
                onDismiss={closeOfficeMenu}
                anchor={
                  <Pressable
                    onPress={action === "Forward" ? openOfficeMenu : null}
                    style={{ width: "70%" }}
                  >
                    <TextInput
                      label="Forwarding to"
                      value={forwardingTo}
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
                      disabled={action === "Forward" ? false : true}
                      right={
                        <TextInput.Icon
                          name="chevron-down"
                          onPress={action === "Forward" ? openOfficeMenu : null}
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
                      setForwardingTo(office);
                      setOfficeMenuVisible(false);
                    }}
                    title={office}
                    style={{ width: Dimensions.get("window").width / 1.5 }}
                  />
                ))}
              </Menu>
              <TextInput
                label="Remarks"
                value={remarks}
                maxLength={40}
                onChangeText={(remarks) => setRemarks(remarks)}
                mode="outlined"
                selectionColor="rgba(0, 0, 0, 0.2)"
                style={{
                  width: "70%",
                  marginTop: "2%",
                }}
                theme={{
                  colors: {
                    primary: "black",
                    underlineColor: "transparent",
                  },
                }}
              />
              <Button
                icon="check"
                style={{
                  width: "40%",
                  height: 42,
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

export default FileAction;
