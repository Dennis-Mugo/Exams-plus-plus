import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Button, Divider, Snackbar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View, SafeAreaView } from "react-native";
import { Surface } from "@react-native-material/core";
import { EducateContext } from "../context/context";
import PostList from "../components/PostList";

const border = {
  borderColor: "black",
  borderWidth: 1,
  borderStyle: "solid",
};

const Create = ({ navigation, route }) => {
  const {
    currentUser,
    getMyPosts,
    myPosts,
    myPostLoading,
    posts,
    dummyUserAlert,
    getUser,
  } = useContext(EducateContext);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState(
    "Post created successfully"
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Create",
    });
  }, [navigation]);
  const { userId } = currentUser;
  useEffect(() => {
    (async () => {
      await getMyPosts(0);
    })();
  }, [userId]);
  // console.log(myPosts);

  useEffect(() => {
    let sub = navigation.addListener("focus", () => {
      (async () => {
        await getMyPosts(0);
      })();
    });
    return sub;
  }, [navigation]);

  return (
    <View style={styles.createContainer}>
      <View style={styles.createButtonContainer}>
        {/* <Surface
          elevation={2}
          style={{
            
            
          }}
          category="medium"
        > */}
        <Button
          icon="pencil"
          mode="contained"
          color="darkorchid"
          style={{
            width: "70%",
            height: 50,
            justifyContent: "center",
            borderRadius: 35,
          }}
          labelStyle={{
            fontSize: 16,
          }}
          onPress={() => {
            if (currentUser.userId) {
              navigation.navigate("CreatePost1", {});
            } else {
              dummyUserAlert(
                "In order to create a post, you need to sign in",
                () => {
                  navigation.navigate("Profile");
                }
              );
            }
          }}
        >
          Create A Post
        </Button>
        {/* </Surface> */}
      </View>
      <View style={styles.myPostsContainer}>
        <Text style={styles.myPostsTitle}>My Posts</Text>
        {myPosts.message || !currentUser.userId ? (
          <View style={{ padding: 10 }}>
            <Text
              style={{ fontFamily: "NunitoSans-Light", textAlign: "center" }}
            >
              There are no posts in this list
            </Text>
          </View>
        ) : (
          <PostList
            style={{ marginTop: 10 }}
            data={myPosts}
            onReload={getMyPosts}
            refreshing={myPostLoading}
            navigation={navigation}
            postType="my-post"
          />
        )}
      </View>
      <Snackbar
        visible={snackBarOpen}
        onDismiss={() => {
          setSnackBarOpen(false);
          setNewPostCreated(false);
        }}
        action={{
          label: "OKAY",
          onPress: () => {
            setSnackBarOpen(false);
          },
        }}
      >
        <Text>{snackBarMessage}</Text>
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  createContainer: {
    flex: 1,
    backgroundColor: "aliceblue",
  },
  createButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 80,
    backgroundColor: "white",
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  myPostsContainer: {
    backgroundColor: "white",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    marginTop: 15,
    marginBottom: 120,
    // flex: 1,
    // paddingRight: 50,
    // padding: 15,
  },
  myPostsTitle: {
    fontFamily: "NunitoSans-Bold",
    fontSize: 15,
    margin: 10,
  },
});

export default Create;
