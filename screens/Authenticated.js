import { Avatar, TextInput } from "@react-native-material/core";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import {
  Button,
  HelperText,
  Menu,
  Modal,
  Portal,
  Provider,
} from "react-native-paper";
import { EducateContext } from "../context/context";
import manipulations from "../utils/manipulate";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { TouchableNativeFeedback } from "react-native";
import Loading from "../components/Loading";

const Authenticated = ({ navigation }) => {
  // console.log(navigation);
  const { currentUser, putUser, logoutUser, getUser } =
    useContext(EducateContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("changeName");
  const [name, setName] = useState(currentUser.userName);
  const [saveLoading, setSaveLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const maxNamelength = 25;

  useEffect(() => {
    let unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (logoutLoading) {
        navigation.dispatch(e.data.action);
      }
      e.preventDefault();
    });
    return unsubscribe;
  }, [navigation, logoutLoading]);

  useEffect(() => {
    let unsubscribe = navigation.addListener("focus", () => {
      (async () => {
        setUserLoading(true);
        let user = await getUser(currentUser.userId);
        setUserDetails(user);
        setUserLoading(false);
      })();
    });
    return unsubscribe;
  }, [navigation]);

  const handleEditDetail = (type) => {
    setModalAction(type);
    setModalOpen(true);
  };

  const onModalClose = (type) => {
    if (type === "changeName") {
      setName(currentUser.userName);
    }
    setModalOpen(false);
  };

  const handleName = (value) => {
    if (value.length > maxNamelength) return;
    setName(value);
  };

  const handleSave = async (type) => {
    if (saveLoading) return;
    if (type === "changeName") {
      if (name === currentUser.userName) return;
      setSaveLoading(true);
      await putUser({ ...userDetails, userName: name }, true, true, false);
      setSaveLoading(false);
      onModalClose("changeName");
    }
  };

  const handleLogout = () => {
    if (logoutLoading) return;
    Alert.alert("Logout", "Are you sure you want to log out?", [
      {
        text: "No",
        onPress: () => {},
      },
      {
        text: "Yes",
        onPress: () => {
          setLogoutLoading(true);
          logoutUser(currentUser.userId).then(() => {
            navigation.navigate("GetProfile");
          });
        },
      },
    ]);
  };

  if (userLoading) {
    return <Loading color="darkorchid" />;
  }
  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.photoContainer}>
          {currentUser.photoUrl ? (
            <Avatar image={{ uri: currentUser.photoUrl }} size={100} />
          ) : null}
          <Button
            mode="text"
            color="black"
            uppercase={false}
            labelStyle={{
              fontFamily: "Nunito-Bold",
              fontSize: 12,
            }}
            style={{
              borderRadius: 30,
              backgroundColor: "gainsboro",
              marginVertical: 10,
            }}
            onPress={() => {
              navigation.navigate("EditUserPhoto");
            }}
          >
            Edit Photo
          </Button>
        </View>
        <View style={styles.viewSeparator}>
          <View style={styles.details}>
            <TouchableNativeFeedback
              onPress={() => {
                handleEditDetail("changeName");
              }}
            >
              <View style={styles.detailContainer}>
                <View style={styles.detailLeft}>
                  <FontAwesome5 name="user-alt" size={24} color="grey" />
                </View>
                <View style={styles.detailRight}>
                  <Text style={styles.label}>Name</Text>
                  <Text style={styles.detailValue}>{currentUser.userName}</Text>
                </View>
                <View style={styles.detailRightMost}>
                  <MaterialIcons name="edit" size={24} color="darkorchid" />
                </View>
              </View>
            </TouchableNativeFeedback>
          </View>
          <View style={styles.logoutContainer}>
            <Button
              mode="contained"
              color="darkred"
              style={styles.logoutButton}
              onPress={handleLogout}
              icon="logout"
              loading={logoutLoading}
            >
              Logout
            </Button>
          </View>
        </View>
      </View>
      <Portal>
        <Modal
          visible={modalOpen}
          onDismiss={onModalClose}
          contentContainerStyle={styles.modalContainerStyle}
        >
          <View style={styles.modalContainer}>
            {modalAction === "changeName" ? (
              <>
                <TextInput
                  variant="standard"
                  label="Name"
                  leading={(props) => (
                    <FontAwesome5
                      name="user-alt"
                      size={18}
                      color="darkorchid"
                    />
                  )}
                  value={name}
                  color="darkorchid"
                  onChangeText={handleName}
                  style={styles.nameInputs}
                  inputStyle={styles.textStyle}
                />
                <View style={{ alignItems: "flex-end" }}>
                  <HelperText visible={true}>
                    {maxNamelength - name.length}
                  </HelperText>
                </View>
              </>
            ) : null}
            <View style={{ alignItems: "flex-end" }}>
              <View style={{ flexDirection: "row" }}>
                <Button
                  mode="text"
                  onPress={() => {
                    onModalClose("changeName");
                  }}
                  style={{ marginRight: 5 }}
                  color="darkorchid"
                >
                  Cancel
                </Button>
                <Button
                  disabled={!name.length}
                  mode="text"
                  color="darkorchid"
                  loading={saveLoading}
                  onPress={() => {
                    handleSave("changeName");
                  }}
                >
                  Save
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  photoContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 190,
    // ...manipulations.border(),
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginTop: 20,
    paddingHorizontal: 10,
    height: 60,
  },
  detailLeft: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    // ...manipulations.border(),
  },
  detailRight: {
    flex: 0.7,
  },
  detailRightMost: {
    flex: 0.1,
  },

  label: { fontFamily: "Nunito-Bold" },
  detailValue: { fontFamily: "Nunito-Regular" },
  modalContainerStyle: {
    // flexDirection: "row",
    justifyContent: "flex-end",
    flex: 1,
  },
  textStyle: {
    fontFamily: "Nunito-Regular",
  },
  modalContainer: {
    backgroundColor: "white",
    height: 150,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  viewSeparator: {
    flex: 1,
    justifyContent: "space-between",
  },
  logoutContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  logoutButton: {
    width: "85%",
    borderRadius: 35,
    height: 45,
    justifyContent: "center",
  },
});

export default Authenticated;
