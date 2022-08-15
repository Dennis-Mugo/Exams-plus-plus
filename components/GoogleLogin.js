import { Button } from "@react-native-material/core";
import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import manipulations from "../utils/manipulate";
import * as firebase from "firebase";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { EducateContext } from "../context/context";

WebBrowser.maybeCompleteAuthSession();

const GoogleLogin = ({ navigation }) => {
  const { getUser, setCurrentUser, putUser, addUserToStorage } =
    useContext(EducateContext);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "442648859460-540j07f02ff41n052ecdnr55rgrtfov4.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      setButtonLoading(true);
      const { access_token } = response.params;
      let provider = new firebase.auth.GoogleAuthProvider();
      const credential = provider.credential(null, access_token);
      firebase
        .auth()
        .signInWithCredential(credential)
        .then(async (res) => {
          // console.log(res.additionalUserInfo.isNewUser);
          // console.log(res.user);
          // console.log(res.user.uid);
          let { isNewUser } = res.additionalUserInfo;
          let { user } = res;
          let userId = user.uid;
          if (isNewUser) {
            let userItem = {
              userName: user.displayName,
              school: "Strathmore",
              userId: userId,
              email: user.email,
              numPosts: 0,
              sharedPosts: [],
              likedPosts: [],
              dislikedPosts: [],
              downloadedPosts: [],
              googlePhotoUrl: user.photoURL,
              photoUrl: manipulations.getUserAvatar(),
            };
            putUser(userItem, true, true, true);
            setButtonLoading(false);
            navigation.navigate("Authenticated");
          } else {
            let loggedInUser = await getUser(userId);
            await addUserToStorage(userId);
            setCurrentUser(loggedInUser);
            setButtonLoading(false);
            navigation.navigate("Authenticated");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [response]);
  const handleGoogleLogin = async () => {
    if (buttonLoading) return;
    promptAsync();
    // firebase
    //   .auth()
    //   .signInWithPopup(provider)
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
  };

  return (
    <View
      style={{
        width: "85%",
        borderRadius: 35,
        overflow: "hidden",
      }}
    >
      <Button
        style={{ width: "100%", height: 45, justifyContent: "center" }}
        title="Login with google"
        color="darkred"
        tintColor="white"
        onPress={handleGoogleLogin}
        leading={(props) => <Fontisto name="google" size={20} color="white" />}
        loading={buttonLoading}
      />
    </View>
  );
};

export default GoogleLogin;
