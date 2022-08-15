import React, { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";
import manipulations from "../utils/manipulate";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, Portal, Button, Provider, Menu } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { EducateContext } from "../context/context";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Upload = ({ numUploads, setNumUploads, canUpload }) => {
  const defaultImage =
    "https://icon-library.com/images/image-placeholder-icon/image-placeholder-icon-5.jpg";
  const [modalOpen, setModalOpen] = useState(false);
  const [image, setImage] = useState(defaultImage);
  const [lastFileUploadUrl, setLastFileUploadUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [lastFileUploadProgress, setLastFileUploadProgress] = useState(0);
  const { uploadFile, creatingNewPost, setCreatingNewPost } =
    useContext(EducateContext);

  const handleCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
      setNumUploads((prev) => prev + 1);
      setModalOpen(false);
    }
  };
  const handleGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
      setNumUploads((prev) => prev + 1);
      setModalOpen(false);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    let fileName = image.split("/").pop();
    await uploadFile(
      image,
      fileName,
      "postImages",
      setLastFileUploadProgress,
      async (downloadURL) => {
        let newAssetUrls;
        if (creatingNewPost.assetUrls) {
          newAssetUrls = creatingNewPost.assetUrls.concat(downloadURL);
        } else {
          newAssetUrls = [downloadURL];
        }
        setCreatingNewPost((prev) => ({ ...prev, assetUrls: newAssetUrls }));
        setUploading(false);
      }
    );
  };

  const openModal = () => {
    if (!canUpload) return;
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <TouchableNativeFeedback onPress={openModal}>
        <View style={styles.wrapper}>
          <Image
            style={styles.image}
            source={{ uri: image }}
            resizeMode={image === defaultImage ? "cover" : "contain"}
          />
          <TouchableNativeFeedback onPress={openModal}>
            <View style={styles.info}>
              <MaterialCommunityIcons
                name="camera-plus-outline"
                size={20}
                color="darkorchid"
              />
              <Text style={styles.textInfo}>
                {"Press to select " + (numUploads ? "another " : "") + "photo"}
              </Text>
            </View>
          </TouchableNativeFeedback>

          <Portal>
            <Modal visible={modalOpen} onDismiss={closeModal}>
              <View style={{ alignItems: "center" }}>
                <View style={styles.modalContainer}>
                  <Menu.Item
                    contentStyle={{ width: "100%" }}
                    icon="camera-plus-outline"
                    onPress={() => {
                      handleCamera();
                    }}
                    title="Take a photo"
                  />
                  <Menu.Item
                    icon="folder-multiple-image"
                    onPress={() => {
                      handleGallery();
                    }}
                    title="Choose from gallery"
                  />
                </View>
              </View>
            </Modal>
          </Portal>
        </View>
      </TouchableNativeFeedback>
      {image !== defaultImage && (
        <View style={{ alignItems: "center" }}>
          <Button
            onPress={() => {
              handleUpload();
            }}
            icon="upload"
            mode="outlined"
            color="darkorchid"
            style={{ marginTop: 15 }}
            loading={uploading}
            disabled={uploading || !canUpload}
          >
            {!uploading ? "Save" : Math.round(lastFileUploadProgress) + "%"}
          </Button>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderColor: "darkorchid",
    borderStyle: "dotted",
    borderWidth: 1,

    borderRadius: 5,
  },
  image: {
    width: "100%",
    height: windowHeight * 0.5,
  },
  info: {
    backgroundColor: "#E5E4E2",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  textInfo: {
    fontFamily: "Nunito-Regular",
    color: "darkorchid",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    marginHorizontal: 10,
    width: "78%",
  },
});

export default Upload;
