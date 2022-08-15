import React, { useState, useContext, useEffect } from "react";
import { IconButton, TextInput } from "@react-native-material/core";
import { StyleSheet, Text, View, ScrollView, StatusBar } from "react-native";
import manipulations from "../utils/manipulate";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import { Button, Divider, HelperText } from "react-native-paper";
import CustomDivider from "../components/CustomDivider";
import * as firebase from "firebase";
import { EducateContext } from "../context/context";

const Signup = ({ navigation }) => {
  const { putUser } = useContext(EducateContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pass, setPass] = useState("");
  const [passError, setPassError] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");
  const [hidePass, setHidePass] = useState(true);
  const [signupLoading, setSignupLoading] = useState(false);

  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      navigation.navigate("Login");
    });
  }, []);

  const handleFirstName = (value) => {
    setFirstName(value);
  };

  const handleLastName = (value) => {
    setLastName(value);
  };
  const emailOnBlur = () => {
    if (!email) {
      setEmailError("*Email is required!");
    } else if (!email.includes("@")) {
      setEmailError("*Invalid email!");
    }
  };

  const passOnBlur = () => {
    if (!pass || !confirmPass) return;
    const minChars = 6;
    const numbers = Array(10)
      .fill(null)
      .map((_, i) => i.toString());
    if (pass.length < minChars) {
      setPassError("Password should be " + minChars + " or more characters");
    } else if (!pass.split("").some((char) => numbers.includes(char))) {
      setPassError("Password should have at least one digit");
    } else if (confirmPass !== pass) {
      setConfirmPassError("*Passwords do not match!");
    }
  };

  const confirmPassOnBlur = () => {
    if (!confirmPass || !pass) return;
    if (confirmPass !== pass) {
      setConfirmPassError("*Passwords do not match!");
    }
  };

  const handleEmail = (value) => {
    setEmailError("");
    setEmail(value);
  };

  const handlePass = (value) => {
    setConfirmPassError("");
    setPassError("");
    setPass(value);
  };
  const handleConfirmPass = (value) => {
    setConfirmPassError("");
    setConfirmPass(value);
  };

  const isClear = () => {
    return !(
      !firstName ||
      !lastName ||
      !email ||
      !pass ||
      !confirmPass ||
      emailError ||
      passError ||
      confirmPassError
    );
  };

  const handleSignUp = async () => {
    setSignupLoading(true);

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, pass)
      .then(async (userCredential) => {
        // console.log(userCredential.user.uid);
        let userItem = {
          userName: firstName + " " + lastName,
          school: "Strathmore",
          userId: userCredential.user.uid,
          email: email,
          numPosts: 0,
          sharedPosts: [],
          likedPosts: [],
          dislikedPosts: [],
          downloadedPosts: [],

          photoUrl: manipulations.getUserAvatar(),
        };
        await putUser(userItem, true, true, true);
        setSignupLoading(false);
        navigation.navigate("Authenticated");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.namesContainer}>
        <TextInput
          variant="standard"
          label="First Name"
          leading={(props) => (
            <FontAwesome5 name="user-alt" size={18} color="darkorchid" />
          )}
          value={firstName}
          color="darkorchid"
          onChangeText={handleFirstName}
          style={styles.nameInputs}
          inputStyle={styles.textStyle}
        />
        <TextInput
          variant="standard"
          label="Last Name"
          value={lastName}
          color="darkorchid"
          onChangeText={handleLastName}
          style={styles.nameInputs}
          inputStyle={styles.textStyle}
          leading={(props) => (
            <FontAwesome5 name="user-alt" size={18} color="darkorchid" />
          )}
        />
      </View>
      <View style={styles.emailContainer}>
        <TextInput
          variant="standard"
          label="Email"
          value={email}
          color="darkorchid"
          onChangeText={handleEmail}
          onBlur={emailOnBlur}
          style={styles.emailInput}
          inputStyle={styles.textStyle}
          keyboardType="email-address"
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
          inputStyle={styles.textStyle}
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
        <HelperText type="error" visible={!!passError}>
          {passError}
        </HelperText>
      </View>
      <View style={styles.confirmPassContainer}>
        <TextInput
          variant="standard"
          label="Confirm Password"
          value={confirmPass}
          color="darkorchid"
          onChangeText={handleConfirmPass}
          onBlur={confirmPassOnBlur}
          style={styles.passInput}
          inputStyle={styles.textStyle}
          secureTextEntry={hidePass}
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
        <HelperText type="error" visible={!!confirmPassError}>
          {confirmPassError}
        </HelperText>
      </View>
      <View
        style={{ alignItems: "center", height: 70, justifyContent: "center" }}
      >
        <Button
          disabled={!isClear() || signupLoading}
          loading={signupLoading}
          mode="contained"
          dark
          color="darkorchid"
          style={{
            borderRadius: 35,
            width: "90%",
            height: 45,
            justifyContent: "center",
          }}
          onPress={() => {
            handleSignUp();
          }}
        >
          {!signupLoading ? "Sign up" : "Signing up"}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  namesContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 80,
  },
  nameInputs: {
    width: "45%",
  },
  textStyle: {
    fontFamily: "Nunito-Regular",
  },
  emailContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
    height: 80,
    // ...manipulations.border(),
  },
  passContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
    height: 80,
  },
  confirmPassContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
    height: 80,
  },
});

export default Signup;
