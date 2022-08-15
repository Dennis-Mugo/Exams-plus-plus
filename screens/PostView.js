import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  Avatar,
  Divider,
  IconButton,
  Surface,
} from "@react-native-material/core";
import DocAsset from "../components/DocAsset";
import { AntDesign } from "@expo/vector-icons";
import {
  MaterialCommunityIcons,
  Octicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { EducateContext } from "../context/context";
import manipulations from "../utils/manipulate";
import { Chip } from "react-native-paper";

const border = {
  borderColor: "black",
  borderWidth: 1,
  borderStyle: "solid",
};

const PostView = ({ navigation, route }) => {
  const { postUser, index } = route.params;
  const {
    setPost,
    updateUser,
    posts,
    handleShare,
    handleDownload,
    currentUser,
    setCurrentUser,
    dummyUserAlert,
  } = useContext(EducateContext);

  const [post, setCurrentPost] = useState(posts[index]);
  const [liked, setLiked] = useState(post.userLikedPost);
  const [disliked, setDisliked] = useState(post.userDislikedPost);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [dislikeCount, setDislikeCount] = useState(post.dislikeCount);
  const [downloading, setDownloading] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: post.unitName,
    });
  }, [navigation]);

  useEffect(() => {
    setCurrentPost(posts[index]);
  }, [posts]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      await setPost({ ...posts[index], viewCount: post.viewCount + 1 });
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  const handleFeedback = async (action) => {
    if (!currentUser.userId) {
      dummyUserAlert(
        `In order to ${action} a post, you need to sign in`,
        () => {
          navigation.navigate("Profile");
        }
      );
      return;
    }
    let userFeedbackData = {};
    let [userHasLikedPost, userHasDislikedPost] = [liked, disliked];
    let newLikeCount = likeCount;
    let newDislikeCount = dislikeCount;
    if (action === "like") {
      newLikeCount = !liked ? likeCount + 1 : likeCount - 1;
      setLikeCount(newLikeCount);
      if (disliked) {
        userHasDislikedPost = false;
        setDisliked(false);
        newDislikeCount = dislikeCount - 1;
        setDislikeCount(newDislikeCount);
        userFeedbackData.remove_dislikes = { postId: post.postId };
      }
      if (liked) {
        userFeedbackData.remove_likes = { postId: post.postId };
      } else {
        userFeedbackData.add_likes = { postId: post.postId };
      }
      userHasLikedPost = !userHasLikedPost;
      setLiked((prev) => !prev);
    } else {
      newDislikeCount = !disliked ? dislikeCount + 1 : dislikeCount - 1;
      setDislikeCount(newDislikeCount);
      if (liked) {
        userHasLikedPost = false;
        setLiked(false);
        newLikeCount = likeCount - 1;
        setLikeCount(newLikeCount);
        userFeedbackData.remove_likes = { postId: post.postId };
      }
      userHasDislikedPost = !userHasDislikedPost;
      setDisliked((prev) => !prev);
      if (disliked) {
        userFeedbackData.remove_dislikes = { postId: post.postId };
      } else {
        userFeedbackData.add_dislikes = { postId: post.postId };
      }
    }
    await setPost({
      ...posts[index],
      userLikedPost: userHasLikedPost,
      userDislikedPost: userHasDislikedPost,
      likeCount: newLikeCount,
      dislikeCount: newDislikeCount,
    });
    let likedPosts = currentUser.likedPosts;
    let dislikedPosts = currentUser.dislikedPosts;
    if (userHasLikedPost) {
      likedPosts = Array.from(new Set([...likedPosts, post.postId]));
      dislikedPosts = dislikedPosts.filter((id) => id !== post.postId);
    }
    if (userHasDislikedPost) {
      dislikedPosts = Array.from(new Set([...dislikedPosts, post.postId]));
      likedPosts = likedPosts.filter((id) => id !== post.postId);
    }

    await updateUser(
      userFeedbackData,
      { ...currentUser, likedPosts, dislikedPosts },
      false
    );
  };

  const downloadAction = async () => {
    if (!currentUser.userId) {
      dummyUserAlert("In order to download, you need to sign in", () => {
        navigation.navigate("Profile");
      });
      return;
    }
    if (downloading === 2) return;

    setDownloading(1);
    await handleDownload(index);
    setDownloading(2);
    await setPost({
      ...posts[index],
      downloadCount: post.downloadCount + 1,
    });
    if (post.userDownloadedPost) return;
    await setPost({ ...posts[index], userDownloadedPost: true }, false);
    let newDownloadedPosts = currentUser.downloadedPosts.concat(post.postId);

    await updateUser(
      { add_downloaded: { postId: post.postId } },
      { ...currentUser, downloadedPosts: newDownloadedPosts }
    );
  };

  const shareAction = async () => {
    if (!currentUser.userId) {
      dummyUserAlert("In order to share, you need to sign in", () => {
        navigation.navigate("Profile");
      });
      return;
    }
    setIsSharing(true);
    await handleShare(index);
    setIsSharing(false);
    setPost({
      ...posts[index],
      shareCount: post.shareCount + 1,
    });
    if (posts[index].userSharedPost) return;
    setPost({ ...post, userDownloadedPost: true, userSharedPost: true }, false);
    let onlineData = {};
    let newDownloadedPosts = currentUser.downloadedPosts;
    if (!post.userDownloadedPost) {
      newDownloadedPosts = newDownloadedPosts.concat(post.postId);
      onlineData.add_downloaded = { postId: post.postId };
    }
    onlineData.add_shared = { postId: post.postId };
    let newSharedPosts = currentUser.sharedPosts.concat(post.postId);
    await updateUser(onlineData, {
      ...currentUser,
      downloadedPosts: newDownloadedPosts,
      sharedPosts: newSharedPosts,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* <View style={styles.numPagesContainer}>
        <Text style={styles.numPages}>{post.assetUrls.length} pages </Text>
      </View> */}
      <View style={styles.postUserWrapper}>
        <View style={styles.postUserLeft}>
          <Avatar image={{ uri: postUser.photoUrl }} size={40} />
        </View>
        <View style={styles.postUserRight}>
          <Text style={styles.postUserName}>{postUser.userName}</Text>
          <Text style={styles.postDescription}>{post.description}</Text>
        </View>
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {post.postType === "photos" ? (
          post.assetUrls.map((imgUrl, i) => (
            <Surface
              key={i}
              elevation={4}
              style={styles.assetContainer}
              category="medium"
            >
              {/* <View style={{ alignItems: "flex-end", height: 40 }}>
                <Chip style={{ height: 30 }}>1/1</Chip>
              </View> */}

              <Image
                style={styles.assetImage}
                source={{ uri: imgUrl }}
                resizeMode="contain"
              />
            </Surface>
          ))
        ) : (
          <DocAsset assets={post.assetUrls} />
        )}
      </ScrollView>
      <View style={styles.detailsWrapper}>
        <Text style={styles.mainTitle}>
          {post.unitName} {post.examType}
        </Text>
        <View style={styles.detailContainer}>
          <Text style={styles.viewCount}>
            {post.viewCount} {post.viewCount === 1 ? "view" : "views"}
            {"  \u2022  "}
            {manipulations.getRelativeDate(post.dateCreated.seconds)}
            {"  \u2022  "}
            Yr {post.year} Sem {post.semester}
            {"  \u2022 "}
            {post.score}%
          </Text>
        </View>

        <Divider style={{ marginVertical: 5 }} />
        <View style={styles.actionContainer}>
          <View style={styles.feedbackContainer}>
            <IconButton
              onPress={() => {
                handleFeedback("like");
              }}
              icon={(props) => (
                <AntDesign
                  name={liked ? "like1" : "like2"}
                  size={24}
                  color={liked ? "darkorchid" : "black"}
                />
              )}
            />
            <Text style={styles.feedbackText}>{likeCount}</Text>
          </View>
          <View style={styles.feedbackContainer}>
            <IconButton
              onPress={() => {
                handleFeedback("dislike");
              }}
              icon={(props) => (
                <AntDesign
                  name={disliked ? "dislike1" : "dislike2"}
                  size={24}
                  color={disliked ? "#DC3545" : "black"}
                />
              )}
            />
            <Text style={styles.feedbackText}>{dislikeCount}</Text>
          </View>
          <View style={styles.feedbackContainer}>
            {!isSharing ? (
              <IconButton
                onPress={() => {
                  shareAction();
                }}
                icon={(props) => (
                  <MaterialCommunityIcons
                    name="share"
                    size={24}
                    color="black"
                  />
                )}
              />
            ) : (
              <ActivityIndicator
                style={{ marginBottom: 15, marginTop: 8 }}
                size={24}
                color="black"
              />
            )}
            <Text style={styles.feedbackText}>share</Text>
          </View>
          <View style={styles.feedbackContainer}>
            {downloading === 1 ? (
              <ActivityIndicator
                color="grey"
                size={24}
                style={{ marginBottom: 15, marginTop: 8 }}
              />
            ) : (
              <IconButton
                onPress={() => {
                  downloadAction();
                }}
                icon={(props) =>
                  !downloading ? (
                    <Octicons name="download" size={24} color="black" />
                  ) : (
                    <MaterialIcons
                      name="file-download-done"
                      size={24}
                      color="black"
                    />
                  )
                }
              />
            )}
            <Text style={styles.feedbackText}>download</Text>
          </View>
        </View>
        <Divider style={{ marginTop: 10, marginBottom: 5 }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "aliceblue",
  },
  assetImage: {
    width: 350,
    height: 400,
  },
  assetContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  detailsWrapper: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  mainTitle: {
    fontFamily: "NunitoSans-Bold",
    fontSize: 16,
  },
  numPagesContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    height: 30,
    backgroundColor: "white",
    paddingRight: 10,
  },
  numPages: {
    fontFamily: "NunitoSans-Light",
    fontSize: 14,
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginVertical: 5,
  },
  viewCount: {
    fontFamily: "Nunito-Light",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: 65,
  },
  feedbackContainer: {
    alignItems: "center",
    width: 80,
  },
  feedbackText: {
    fontFamily: "NunitoSans-Regular",
  },
  postUserWrapper: {
    flexDirection: "row",
    // alignItems: "center",
    backgroundColor: "white",
    padding: 10,
  },
  postUserLeft: {
    flex: 0.2,
    alignItems: "center",
  },
  postUserRight: {
    flex: 0.8,
    paddingHorizontal: 10,
  },
  postDescription: {
    fontFamily: "NunitoSans-Light",
  },
  postUserName: {
    fontFamily: "NunitoSans-Bold",
    fontSize: 15,
  },
});

export default PostView;
