import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  FlatList,
  StatusBar,
} from "react-native";
import { ActivityIndicator } from "@react-native-material/core";
import Loading from "../components/Loading";
import Post from "../components/Post";
import { EducateContext, EducateProvider } from "../context/context";
import db from "../firebase/firebase";
import utilColors from "../utils/colors";

const border = {
  borderColor: "black",
  borderWidth: 1,
  borderStyle: "solid",
};

const Home = ({ navigation }) => {
  const {
    currentUser,
    currentUserSchool,
    baseUrl,
    posts,
    postLoading,
    getPosts,
    morePosts,
  } = useContext(EducateContext);

  // const [refreshing, setRefreshing] = useState()
  const { userId } = currentUser;
  useEffect(() => {
    getPosts();
  }, [userId]);

  if (postLoading) {
    return <Loading color={utilColors.darkOrchid} />;
  }
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="darkorchid" />
      <FlatList
        data={posts}
        refreshing={postLoading}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          getPosts(1);
        }}
        ListFooterComponent={
          morePosts ? (
            <ActivityIndicator
              size="large"
              color="darkorchid"
              style={{
                paddingVertical: 10,
                backgroundColor: "white",
                borderTopColor: "whitesmoke",
                borderTopWidth: 1,
                borderTopStyle: "solid",
              }}
            />
          ) : null
        }
        onRefresh={async () => {
          await getPosts(0);
        }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.postId}
        renderItem={({ item, index }) => (
          <Post
            postIndex={index}
            postType="general-post"
            navigation={navigation}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerView: {},
  container: { flex: 1 },
});

export default Home;
