import { Avatar } from "@react-native-material/core";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { EducateContext } from "../context/context";
import manipulations from "../utils/manipulate";
// import mathImg from "../utils/backgrounds/math.jpg";

const border = {
  borderColor: "black",
  borderWidth: 1,
  borderStyle: "solid",
};

const Post = ({ postIndex, navigation, postType }) => {
  const { getUser, posts, myPosts, setPost } = useContext(EducateContext);

  const [post, setCurrentPost] = useState(
    postType === "my-post" ? myPosts[postIndex] : posts[postIndex]
  );
  const [postUser, setPostUser] = useState(
    postType === "my-post" ? myPosts[postIndex].user : posts[postIndex].user
  );
  useEffect(() => {
    setCurrentPost(
      postType === "my-post" ? myPosts[postIndex] : posts[postIndex]
    );
    setPostUser(
      postType === "my-post" ? myPosts[postIndex].user : posts[postIndex].user
    );
  }, [posts, myPosts]);

  let backgroundImg;
  switch (post.postBackground) {
    case "img_reachout.jpg":
      backgroundImg = require("../utils/backgrounds/img_reachout.jpg");
      break;
    case "math.jpg":
      backgroundImg = require("../utils/backgrounds/math.jpg");
      break;
    case "img_backtoschool.jpg":
      backgroundImg = require("../utils/backgrounds/img_backtoschool.jpg");
      break;
    case "img_bookclub.jpg":
      backgroundImg = require("../utils/backgrounds/img_bookclub.jpg");
      break;
    case "img_breakfast.jpg":
      backgroundImg = require("../utils/backgrounds/img_breakfast.jpg");
      break;
    case "img_graduation.jpg":
      backgroundImg = require("../utils/backgrounds/img_graduation.jpg");
      break;
    case "img_learnlanguage.jpg":
      backgroundImg = require("../utils/backgrounds/img_learnlanguage.jpg");
      break;
    case "img_read.jpg":
      backgroundImg = require("../utils/backgrounds/img_read.jpg");
      break;
    case "math2.jpg":
      backgroundImg = require("../utils/backgrounds/math2.jpg");
      break;
    case "physics.jpg":
      backgroundImg = require("../utils/backgrounds/physics.jpg");
      break;
    case "world_studies.jpg":
      backgroundImg = require("../utils/backgrounds/world_studies.jpg");
      break;
    case "writing.jpg":
      backgroundImg = require("../utils/backgrounds/writing.jpg");
      break;
    case "honors.jpg":
      backgroundImg = require("../utils/backgrounds/honors.jpg");
      break;
  }

  useEffect(() => {
    // (async () => {
    //   let user = await getUser(post.userId);
    //   setPostUser(user);
    // })();
  }, []);

  return (
    <TouchableOpacity
      onPress={async () => {
        if (postType === "my-post") {
          let newIndex = await setPost(post, false, true);
          // console.log(newIndex);
          navigation.navigate("PostView", { postUser, index: newIndex });
        } else {
          navigation.navigate("PostView", { postUser, index: postIndex });
        }
      }}
    >
      <View style={styles.container}>
        <Image style={styles.backgroundImg} source={backgroundImg} />
        <View style={styles.detailContainer}>
          <View style={styles.detailContainerLeft}>
            <Avatar size={30} image={{ uri: postUser?.photoUrl }} />
          </View>
          <View style={styles.detailContainerRight}>
            <Text style={styles.postTitle}>{post.unitName}</Text>
            <View style={{ height: 1 }}></View>

            <Text style={styles.postDetails}>
              {postUser?.userName}
              {"  \u2022  "}
              Year {post.year} Semester {post.semester}
              {"  \u2022  "}
              {manipulations.getRelativeDate(post.dateCreated.seconds)}
            </Text>
            <View style={{ height: 1 }}></View>
            <Text style={styles.postScore}>{post.score}% score</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: 10,
    backgroundColor: "white",
  },
  backgroundImg: {
    width: "100%",
    height: 150,
  },
  detailContainer: {
    flexDirection: "row",
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  detailContainerLeft: {
    width: "15%",
    alignItems: "center",
  },
  detailContainerRight: {
    width: "85%",
  },
  postTitle: {
    fontFamily: "Nunito-Bold",
    fontSize: 15,
  },
  postDetails: {
    fontFamily: "Nunito-Light",
    fontSize: 12,
  },
  postScore: {
    fontFamily: "Nunito-Bold",
  },
});

export default Post;
