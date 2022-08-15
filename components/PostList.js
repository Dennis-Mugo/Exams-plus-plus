import React, { useContext, useEffect, useState } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import { EducateContext } from "../context/context";
import Post from "./Post";

const PostList = ({ onReload, refreshing, navigation, style, postType }) => {
  const { myPosts } = useContext(EducateContext);
  // const [data, setData] = useState(postType === "my-post" ? myPosts : null);

  return (
    // <View style={{ ...styles.container, ...style }}>
    <FlatList
      data={myPosts}
      refreshing={refreshing}
      onRefresh={() => {
        onReload(0);
      }}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.postId}
      renderItem={({ item, index }) => (
        <Post postIndex={index} navigation={navigation} postType={postType} />
      )}
    />
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default PostList;
