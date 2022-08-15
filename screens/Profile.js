import React, { useEffect } from "react";
import { SafeAreaView, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../components/Loading";

const Profile = ({ navigation }) => {
  useEffect(() => {
    let unsubscribe = navigation.addListener("focus", () => {
      (async () => {
        try {
          let userId = await AsyncStorage.getItem("userId");
          if (userId) {
            navigation.navigate("Authenticated");
          } else {
            navigation.navigate("Authenticate");
          }
        } catch (e) {
          console.log(e);
        }
      })();
    });
    return unsubscribe;
  }, [navigation]);
  return <Loading color="darkorchid" />;
};

export default Profile;
