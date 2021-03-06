import React, { useState, useEffect } from "react";
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import {
  View,
  RefreshControl,
  ScrollView,
  ImageBackground,
} from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

const DrawerContent = (props) => {
  const [user, setUser] = useState({
    image:
      "https://media-exp1.licdn.com/dms/image/C5603AQGCBSy7FjyYTQ/profile-displayphoto-shrink_400_400/0/1549821488426?e=1620259200&v=beta&t=w8fEAp24_aWlU66M6p1ROAOoPO_FBSfA5Hs8befmfxw",
    name: "Hansin Ahuja",
    email: "2018csb1094",
  });

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: "4%" }}>
            <View style={{ flexDirection: "row", marginTop: "8%" }} />
            <TouchableRipple
              onPress={() => {
                console.log("Profile");
              }}
              rippleColor="rgba(0, 0, 0, .15)"
              style={{ width: "100%" }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: "4%",
                  marginLeft: "2%",
                }}
              >
                <Avatar.Image source={{ uri: user.image }} size={60} />
                <View style={{ marginLeft: "5%", flexDirection: "column" }}>
                  <Title
                    style={{
                      fontSize: 16,
                      marginTop: "2%",
                      fontWeight: "bold",
                    }}
                  >
                    {user.name}
                  </Title>
                  <Caption
                    style={{
                      fontSize: 14,
                      lineHeight: 14,
                    }}
                  >
                    @{user.email}
                  </Caption>
                </View>
              </View>
            </TouchableRipple>
          </View>

          <Drawer.Section style={{ marginTop: "4%" }}>
            <DrawerItem
              icon={() => <Entypo name="home" size={24} color="black" />}
              label="Home"
              onPress={() => {
                props.navigation.navigate("Landing");
              }}
            />
            <DrawerItem
              icon={() => (
                <MaterialIcons name="feedback" size={24} color="black" />
              )}
              label="Feedback"
              onPress={() => {
                props.navigation.navigate("NewFile");
              }}
            />
            <DrawerItem
              icon={() => (
                <FontAwesome5 name="info-circle" size={24} color="black" />
              )}
              label="Info"
              onPress={() => {
                // props.navigation.navigate("NewFile");
              }}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>

      <Drawer.Section
        style={{
          marginBottom: "8%",
          borderTopColor: "#f4f4f4",
          borderTopWidth: 1,
        }}
      >
        <DrawerItem
          icon={() => <MaterialIcons name="logout" size={24} color="black" />}
          label="Sign Out"
          onPress={() => {
            console.log("Logout");
          }}
        />
      </Drawer.Section>
    </View>
  );
};

export default DrawerContent;
