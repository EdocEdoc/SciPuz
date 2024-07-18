import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import {
  Button,
  Caption,
  Headline,
  Paragraph,
  Subheading,
  TextInput,
} from "react-native-paper";
import Spacer from "../components/Spacer";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { db } from "../utils/config";

const UserScreen = ({ navigation }) => {
  const { user, setUser } = useAppContext();

  const [adminCodes, setAdminCodes] = useState([]);
  const [userCodes, setUserCodes] = useState([]);

  const copyToClipboard = async (toCopy) => {
    if (toCopy) {
      await Clipboard.setStringAsync(toCopy);
      alert("Copied to Clipboard!");
    }
  };

  const codeGenerator = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    console.log("🚀 ~ codeGenerator ~ code:", code);
    return code;
  };

  const generateAdminCode = async () => {
    try {
      const codeResult = codeGenerator();
      const res = await db.collection("codes").add({
        code: codeResult,
        type: "admin",
        dateCreated: new Date().toISOString(),
        availableUsage: 10,
        whoCreatedId: user?.id,
        whoCreatedName: user?.name,
      });
      if (res.id) {
        setAdminCodes([...adminCodes, codeResult]);
      }
    } catch (error) {
      console.log("🚀 ~ generateAdminCode ~ error", error);
    }
  };

  const generateUserCode = async () => {
    try {
      const codeResult = codeGenerator();
      const res = await db.collection("codes").add({
        code: codeResult,
        type: "user",
        dateCreated: new Date().toISOString(),
        availableUsage: 10,
        whoCreatedId: user?.id,
        whoCreatedName: user?.name,
      });
      if (res.id) {
        setUserCodes([...userCodes, codeResult]);
      }
    } catch (error) {
      console.log("🚀 ~ generateUserCode ~ error", error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
      }}
    >
      <Headline style={{ fontWeight: "bold", textAlign: "center" }}>
        {user?.name}
      </Headline>
      <Subheading>{user?.type.toUpperCase()}</Subheading>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Spacer size={10} />
        <Caption style={{ textAlign: "center", color: "black" }}>
          USER ID
        </Caption>
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
            backgroundColor: "white",
            flexDirection: "row",
          }}
        >
          <Paragraph
            style={{
              textAlign: "center",
              color: "black",
              alignSelf: "center",
            }}
          >
            {user?.id}
          </Paragraph>
          <Ionicons
            name="copy"
            size={24}
            color="black"
            style={{ marginLeft: 10 }}
            onPress={() => copyToClipboard(user?.id)}
          />
        </View>
      </View>
      <Spacer size={20} />
      {user?.type == "admin" && (
        <View>
          <Button
            icon={"cog"}
            onPress={() => navigation.navigate("ManageQuizScreen")}
            mode="contained"
          >
            Manage Quiz
          </Button>
          <Spacer size={20} />
          <Button
            icon={"plus-circle"}
            onPress={generateAdminCode}
            mode="contained-tonal"
          >
            Generate Admin Code
          </Button>
          <Spacer size={10} />
          {adminCodes.length > 0 && (
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor: "white",
                flexDirection: "row",
              }}
            >
              <Paragraph
                style={{
                  textAlign: "center",
                  color: "black",
                  alignSelf: "center",
                }}
              >
                {adminCodes.join(", ")}
              </Paragraph>
              <Ionicons
                name="copy"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
                onPress={() => copyToClipboard(adminCodes.join(", "))}
              />
            </View>
          )}
          <Spacer size={10} />
          <Button
            icon={"plus-circle"}
            onPress={generateUserCode}
            mode="contained-tonal"
          >
            Generate User Code
          </Button>
          <Spacer size={10} />
          {userCodes.length > 0 && (
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor: "white",
                flexDirection: "row",
              }}
            >
              <Paragraph
                style={{
                  textAlign: "center",
                  color: "black",
                  alignSelf: "center",
                }}
              >
                {userCodes.join(", ")}
              </Paragraph>
              <Ionicons
                name="copy"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
                onPress={() => copyToClipboard(userCodes.join(", "))}
              />
            </View>
          )}
        </View>
      )}
      <Spacer size={20} />
      <Button icon={"logout"} onPress={() => setUser(null)} mode="contained">
        SIGN OUT
      </Button>
    </View>
  );
};

export default UserScreen;

const styles = StyleSheet.create({});
