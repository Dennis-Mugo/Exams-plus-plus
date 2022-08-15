import { Avatar, IconButton } from "@react-native-material/core";
import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableNativeFeedback,
  TouchableOpacity,
} from "react-native";
import { EducateContext } from "../context/context";
import manipulations from "../utils/manipulate";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Button, Divider } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import Loading from "../components/Loading";

const EditUserPhoto = ({ navigation }) => {
  const { currentUser, uploadFile, putUser, getUser } =
    useContext(EducateContext);
  const [imageUrl, setImageUrl] = useState(currentUser.photoUrl);
  const [canSave, setCanSave] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userDetails, setUserDetails] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      (async () => {
        setUserLoading(true);
        let user = await getUser(currentUser.userId);
        setUserDetails(user);
        setUserLoading(false);
      })();
    });

    return unsubscribe;
  }, [navigation]);

  const handleImageChange = (newUrl) => {
    setCanSave(newUrl !== currentUser.photoUrl);
    setImageUrl(newUrl);
  };

  const handleCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    console.log(result);
    if (!result.cancelled) {
      handleImageChange(result.uri);
    }
  };
  const handleGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    console.log(result);
    if (!result.cancelled) {
      handleImageChange(result.uri);
    }
  };

  const urlCallBack = async (downloadUrl) => {
    setImageUrl(downloadUrl);
    await putUser({ ...userDetails, photoUrl: imageUrl }, true, true, false);
    setSaving(false);
    navigation.goBack();
  };

  const handleSave = async () => {
    if (saving) return;
    if (imageUrl === currentUser.photoUrl) return;
    setSaving(true);

    if (imageUrl.includes("https")) {
      setSaving(false);
      await putUser({ ...userDetails, photoUrl: imageUrl }, true, true, false);
      navigation.navigate("Authenticated");
    } else {
      let fileName = imageUrl.split("/").pop();
      await uploadFile(
        imageUrl,
        fileName,
        "customUserAvatars",
        setUploadProgress,
        urlCallBack
      );
    }
  };
  if (userLoading) {
    return <Loading color="darkorchid" />;
  }
  return (
    <View style={styles.container}>
      {canSave && (
        <Button
          loading={saving}
          onPress={() => {
            handleSave();
          }}
          mode="contained"
          color="darkorchid"
          style={{
            position: "absolute",
            top: 20,
            right: 10,
            zIndex: 99,
            borderRadius: 35,
          }}
          uppercase={false}
        >
          {saving ? Math.round(uploadProgress) + "%" : "Save"}
        </Button>
      )}
      <View style={styles.photoContainer}>
        <Avatar image={{ uri: imageUrl }} size={150} />
      </View>
      <View style={styles.actionContainer}>
        <View
          style={{
            alignItems: "center",
            // ...manipulations.border(),
            // marginRight: 10,
          }}
        >
          <IconButton
            onPress={() => {
              handleCamera();
            }}
            style={{
              backgroundColor: "rgba(60, 20, 80, 0.2)",
              width: 55,
              height: 55,
            }}
            icon={(props) => (
              <MaterialIcons name="photo-camera" size={25} color="darkorchid" />
            )}
          />
          <Text style={{ fontFamily: "Nunito-Regular", textAlign: "center" }}>
            Camera
          </Text>
        </View>
        <View
          style={{
            alignItems: "center",
            // ...manipulations.border(),
            // marginLeft: 10,
          }}
        >
          <IconButton
            onPress={() => {
              handleGallery();
            }}
            style={{
              backgroundColor: "rgba(60, 20, 80, 0.2)",
              width: 55,
              height: 55,
            }}
            icon={(props) => (
              <MaterialIcons name="photo" size={30} color="darkorchid" />
            )}
          />
          <Text style={{ fontFamily: "Nunito-Regular", textAlign: "center" }}>
            Photo
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: "whitesmoke",
          height: 2.5,
          marginVertical: 15,
        }}
      />
      <Text
        style={{
          fontFamily: "Nunito-Bold",
          fontSize: 16,
          marginLeft: 20,
          paddingBottom: 10,
        }}
      >
        Select an image
      </Text>
      <ScrollView contentContainerStyle={styles.allPhotosContainer}>
        {manipulations.getUserAvatar(true).map((url, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              handleImageChange(url);
            }}
          >
            <View style={styles.allPhotos}>
              <Avatar image={{ uri: url }} size={80} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  photoContainer: {
    height: 180,
    justifyContent: "flex-end",
    alignItems: "center",
    // ...manipulations.border(),
  },
  actionContainer: {
    height: 100,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    // ...manipulations.border(),
  },
  allPhotos: {
    // ...manipulations.border(),
    marginVertical: 10,
    marginHorizontal: 5,
  },
  allPhotosContainer: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    paddingHorizontal: 5,
  },
});

export default EditUserPhoto;
