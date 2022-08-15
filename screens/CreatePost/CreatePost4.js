import React, { useContext, useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Button, Provider, Snackbar } from "react-native-paper";
import Upload from "../../components/Upload";
import { EducateContext } from "../../context/context";
import manipulations from "../../utils/manipulate";

const CreatePost4 = ({ navigation }) => {
  const {
    creatingNewPost,
    createPostData,
    setPost,
    updateUser,
    currentUser,
    setCreatingNewPost,
    getMyPosts,
  } = useContext(EducateContext);
  const [numUploads, setNumUploads] = useState(0);
  const [finishLoading, setFinishLoading] = useState(false);
  const [canUpload, setCanUpload] = useState(true);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState(
    "Post created successfully"
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Post a past paper",
    });
  }, [navigation]);

  const handleNext = async () => {
    setFinishLoading(true);
    setCanUpload(false);
    let finalData = createPostData();

    await setPost(finalData, true, false);
    await getMyPosts();
    await updateUser(
      { add_num_posts: { num_posts: currentUser.numPosts + 1 } },
      { ...currentUser, numPosts: currentUser.numPosts + 1 }
    );
    setCreatingNewPost({});
    setSnackBarOpen(true);
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.wrapper}>
        <Text style={styles.text}>
          Please upload pages of the exam with your answers one by one
        </Text>
        <View style={styles.actions}>
          <Upload
            numUploads={numUploads}
            setNumUploads={setNumUploads}
            canUpload={canUpload}
          />
        </View>
        <View style={styles.navigate}>
          <Button
            mode="text"
            icon="arrow-right"
            contentStyle={{ flexDirection: "row-reverse" }}
            onPress={handleNext}
            disabled={!creatingNewPost.assetUrls || finishLoading}
            loading={finishLoading}
          >
            Finish
          </Button>
        </View>
        <Snackbar
          visible={snackBarOpen}
          onDismiss={() => {
            setSnackBarOpen(false);

            navigation.navigate("CreateName");
          }}
          action={{
            label: "OKAY",
            onPress: () => {
              setSnackBarOpen(false);
              navigation.navigate("CreateName");
            },
          }}
        >
          <Text>{snackBarMessage}</Text>
        </Snackbar>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  actions: {
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  navigate: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  text: {
    fontFamily: "NunitoSans-Bold",
    marginVertical: 10,
    textAlign: "center",
    paddingHorizontal: 5,
  },
});

export default CreatePost4;
