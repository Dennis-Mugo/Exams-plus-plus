import axios from "axios";
import React, { useState, useEffect, createContext } from "react";
import * as firebase from "firebase";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";
import backgrounds from "../utils/backgrounds";
import { v4 } from "uuid";
import { Alert } from "react-native";

export const EducateContext = createContext();

const baseUrl = "https://exams-plus-plus-api.herokuapp.com";

export const EducateProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({ userId: null });
  const [currentUserSchool, setCurrentUserSchool] = useState("Strathmore");
  const [posts, setPosts] = useState([]);
  const [creatingNewPost, setCreatingNewPost] = useState({});
  const [postLoading, setPostLoading] = useState(true);
  const [myPostLoading, setMyPostLoading] = useState(true);
  const [myPosts, setMyPosts] = useState([]);
  const [morePosts, setMorePosts] = useState(true);

  const dummyUser = {
    userName: "",
    school: "Strathmore",
    userId: null,
    email: "",
    numPosts: 0,
    sharedPosts: [],
    likedPosts: [],
    dislikedPosts: [],
    downloadedPosts: [],
    photoUrl: "",
  };

  const getUserFromStorage = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        console.log("No user in storage");
      }
      return userId;
    } catch (e) {
      // error reading value
    }
  };

  const getUser = async (id = currentUser.userId, starting = false) => {
    let userId = id;
    if (starting) {
      userId = await getUserFromStorage();
    }
    if (!userId) {
      console.log("No user");
      return dummyUser;
    }
    let res = await fetch(`${baseUrl}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      res = await res.json();
      return JSON.parse(res);
    } else {
      throw new Error("An error occured");
    }
  };
  useEffect(() => {
    (async () => {
      let user = await getUser(currentUser.userId, true);
      setCurrentUser(user);
    })();
  }, []);

  const addUserToStorage = async (userId) => {
    try {
      await AsyncStorage.setItem("userId", userId);
    } catch (e) {
      console.log(e);
    }
  };

  const removeUserFromStorage = async (userId) => {
    try {
      await AsyncStorage.removeItem("userId");
    } catch (e) {
      console.log(e);
    }
  };

  const logoutUser = async (userId) => {
    await removeUserFromStorage(userId);
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("Logout successful");
        setCurrentUser(dummyUser);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPosts = async (page = 0, type = "") => {
    // if (!currentUser.userId) return;
    let updatedPosts = posts;
    let lastPostDateCreated, payload;
    let user = await getUser();
    if (page === 0) {
      setPostLoading(true);
      setMorePosts(true);
      updatedPosts = [];
      payload = {
        userSchool: currentUserSchool,
        page: page,
        userData: user,
        type: type,
      };
    } else {
      let lastIndex = posts.length - 1;
      lastPostDateCreated = posts[lastIndex].dateCreated.seconds;

      payload = {
        userSchool: currentUserSchool,
        page: page,
        userData: user,
        type: type,
        fromDate: lastPostDateCreated,
      };
    }

    fetch(baseUrl + "/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.message) {
          setMorePosts(false);
          return;
        }
        setPosts([...updatedPosts, ...res.data]);
        setPostLoading(false);
      })
      .catch((e) => console.log(e));
  };

  const getMyPosts = async (page = 0, type = "currentUser") => {
    if (!currentUser.userId) return;
    let updatedPosts = myPosts;
    let user = await getUser();
    if (page === 0) {
      setMyPostLoading(true);
      updatedPosts = [];
    }
    fetch(baseUrl + "/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page: page,
        userData: user,
        type: type,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message) {
          setMyPosts(res);
        } else {
          setMyPosts([...updatedPosts, ...res.data]);
        }

        setMyPostLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const setPost = async (postData, updateOnline = true, updateLocal = true) => {
    let newIndex;
    if (updateLocal) {
      setPosts((prevPosts) => {
        let postToUpdateIndex = posts.findIndex(
          (post) => post.postId === postData.postId
        );
        if (postToUpdateIndex === -1) {
          prevPosts.push(postData);
          newIndex = prevPosts.length - 1;
        } else {
          newIndex = postToUpdateIndex;
          prevPosts[postToUpdateIndex] = postData;
        }

        return prevPosts;
      });
    }

    if (!updateOnline) return newIndex;

    fetch(baseUrl + "/posts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postData }),
    })
      .then((response) => {
        return response.json();
      })
      .catch((e) => {
        console.log(e);
      });
    return newIndex;
  };

  const putUser = async (
    userData,
    putLocal = true,
    putOnline = true,
    newUser = false
  ) => {
    if (putLocal) {
      setCurrentUser(userData);
    }

    if (newUser) {
      await addUserToStorage(userData.userId);
    }

    if (putOnline) {
      fetch(baseUrl + "/users/" + userData.userId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userData }),
      })
        .then((res) => res.json())
        .catch((e) => console.log(e));
    }
  };

  const updateUser = async (
    userData,
    localUserData,
    updateLocal = true,
    updateOnline = true
  ) => {
    if (updateLocal) {
      setCurrentUser(localUserData);
    }
    if (!updateOnline) return;
    fetch(baseUrl + "/users/" + currentUser.userId, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((res) => {
        return res.json();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const downloadFile = async (fromUrl, toUrl) => {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (permission.status === "granted") {
      try {
        let downloadedFile = await FileSystem.downloadAsync(
          fromUrl,
          FileSystem.documentDirectory + toUrl
        );

        const asset = await MediaLibrary.createAssetAsync(downloadedFile.uri);
        // const album = await MediaLibrary.getAlbumAsync("Download");
        // if (album == null) {
        //   await MediaLibrary.createAlbumAsync("Download", asset, false);
        // } else {
        //   await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        // }
        const album = await MediaLibrary.getAlbumAsync("Download");
        if (album == null) {
          await MediaLibrary.createAlbumAsync("Download", asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
        return downloadedFile.uri;
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleDownload = async (postIndex) => {
    let post = posts[postIndex];
    let localUrls = [];

    for await (let assetUrl of post.assetUrls) {
      let fileList, fileName;
      if (assetUrl.includes("?")) {
        fileList = assetUrl.split("/");
        let fileNameLast = fileList[fileList.length - 1];
        fileName = fileNameLast.split("?")[0];
        fileName = fileName.split("%").pop();
      } else {
        fileList = assetUrl.split("/");
        fileName = fileList[fileList.length - 1];
      }

      let resUri = await downloadFile(assetUrl, fileName);
      localUrls.push(resUri);
    }

    return localUrls;
  };

  const handleShare = async (postIndex) => {
    let canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      return "Cannot share";
    }
    let localUrls = await handleDownload(postIndex);

    if (localUrls.length === posts[postIndex].assetUrls.length) {
      let res = await Sharing.shareAsync(localUrls[0]);
    }
  };

  const uploadFile = async (
    image,
    fileName,
    directory,
    setLastFileUploadProgress,
    callBack
  ) => {
    setLastFileUploadProgress(0);

    const response = await fetch(image);
    const blob = await response.blob();
    let ref = firebase
      .storage()
      .ref()
      .child(`${directory}/` + fileName);

    let uploadTask = ref.put(blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setLastFileUploadProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
          await callBack(downloadURL);
        });
      }
    );
  };

  const createPostData = () => {
    let postData = {
      dateCreated: { seconds: Date.now() / 1000 },
      likeCount: 0,
      dislikeCount: 0,
      downloadCount: 0,
      postBackground:
        backgrounds[Math.floor(Math.random() * backgrounds.length)],
      postId: v4(),
      postType: "photos",
      school: currentUser.school,
      shareCount: 0,
      userId: currentUser.userId,
      viewCount: 0,
    };
    return { ...creatingNewPost, ...postData };
  };

  const dummyUserAlert = (message, callBack) => {
    Alert.alert("Not signed in", message, [
      {
        text: "Cancel",
        onPress: () => {},
      },
      {
        text: "Sign In",
        onPress: callBack,
      },
    ]);
  };

  return (
    <EducateContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentUserSchool,
        baseUrl,
        getUser,
        setPost,
        updateUser,
        posts,
        setPosts,
        postLoading,
        getPosts,
        handleShare,
        handleDownload,
        setCreatingNewPost,
        creatingNewPost,
        uploadFile,
        createPostData,
        getMyPosts,
        myPosts,
        myPostLoading,
        putUser,
        addUserToStorage,
        logoutUser,
        dummyUserAlert,
        morePosts,
      }}
    >
      {children}
    </EducateContext.Provider>
  );
};
