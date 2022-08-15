import { IconButton, TextInput } from "@react-native-material/core";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, HelperText } from "react-native-paper";
import { EducateContext } from "../context/context";
import manipulations from "../utils/manipulate";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import * as firebase from "firebase";
import CustomDivider from "../components/CustomDivider";
import GoogleLogin from "../components/GoogleLogin";

const Login = ({ navigation }) => {
  const { currentUser, setCurrentUser, getUser, addUserToStorage } =
    useContext(EducateContext);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pass, setPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [hidePass, setHidePass] = useState(true);
  const [emailLoginLoading, setEmailLoginLoading] = useState(false);
  useEffect(() => {
    // if (currentUser.userId) {
    //   navigation.navigate("Authenticated");
    // }
  }, []);
  const handleEmailLogin = () => {
    setEmailLoginLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then((userCredentials) => {
        // console.log(userCredentials);
        return getUser(userCredentials.user.uid);
      })
      .then((user) => {
        addUserToStorage(user.userId);
        setCurrentUser(user);
        setEmailLoginLoading(false);
        navigation.navigate("Authenticated");
      })
      .catch((e) => {
        // console.log(e.code);
        if (e.code === "auth/wrong-password") {
          setLoginError("Wrong password!");
        } else if (e.code === "auth/user-not-found") {
          setEmailError("User does not exist!");
        }
        setEmailLoginLoading(false);
      });
  };

  const handleEmail = (value) => {
    setLoginError("");
    setEmailError("");
    setEmail(value);
  };

  const emailOnBlur = () => {
    if (!email.includes("@")) {
      setEmailError("Invalid email");
    }
  };

  const handlePass = (value) => {
    setPass(value);
    setLoginError("");
  };

  const passOnBlur = () => {};

  const isClear = () => {
    return email && pass && !emailError && !loginError;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.emailContainer}>
        <TextInput
          value={email}
          onChangeText={handleEmail}
          keyboardType="email-address"
          onBlur={emailOnBlur}
          color="darkorchid"
          inputStyle={styles.inputStyle}
          variant="standard"
          label="Email"
          leading={(props) => (
            <MaterialCommunityIcons name="email" size={22} color="darkorchid" />
          )}
        />
        <HelperText type="error" visible={!!emailError}>
          {emailError}
        </HelperText>
      </View>
      <View style={styles.passContainer}>
        <TextInput
          variant="standard"
          label="Password"
          value={pass}
          color="darkorchid"
          onChangeText={handlePass}
          style={styles.passInput}
          inputStyle={styles.inputStyle}
          secureTextEntry={hidePass}
          onBlur={passOnBlur}
          leading={(props) => (
            <MaterialIcons name="vpn-key" size={24} color="darkorchid" />
          )}
          trailing={(props) => (
            <IconButton
              onPress={() => {
                setHidePass((prev) => !prev);
              }}
              icon={(props) => (
                <Ionicons
                  name={hidePass ? "eye-off" : "eye"}
                  size={24}
                  color="grey"
                />
              )}
            />
          )}
        />
        <HelperText type="error" visible={!!loginError}>
          {loginError}
        </HelperText>
      </View>
      <View style={styles.emailLoginButton}>
        <Button
          mode="contained"
          onPress={handleEmailLogin}
          style={{
            borderRadius: 35,
            width: "85%",
            height: 45,
            justifyContent: "center",
          }}
          disabled={!isClear() || emailLoginLoading}
          color="darkorchid"
          loading={emailLoginLoading}
        >
          Login
        </Button>
      </View>
      {/* <CustomDivider text="OR" /> */}
      <View style={styles.emailLoginButton}>
        {/* <GoogleLogin navigation={navigation} /> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  emailContainer: {
    // ...manipulations.border(),
    height: 125,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  inputStyle: {
    fontFamily: "Nunito-Regular",
  },
  passContainer: {
    paddingHorizontal: 15,
    height: 80,
    justifyContent: "center",
    paddingHorizontal: 15,
    // ...manipulations.border(),
  },
  emailLoginButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 70,
    // ...manipulations.border(),
  },
});

export default Login;
