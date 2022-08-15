import { TextInput } from "@react-native-material/core";
import React, { useContext, useLayoutEffect, useState } from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { Button, Divider } from "react-native-paper";
import { EducateContext } from "../../context/context";

const CreatePost3 = ({ navigation }) => {
  const { setCreatingNewPost } = useContext(EducateContext);
  const [score, setScore] = useState("");
  const [outOf, setOutOf] = useState("");
  const [description, setDescription] = useState("");
  const maxDescriptionLength = 60;
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Post a past paper",
    });
  }, [navigation]);

  const handleNext = () => {
    let percentScore = Math.round((parseInt(score) / parseInt(outOf)) * 100);
    setCreatingNewPost((prev) => ({
      ...prev,
      score: percentScore,
      description,
    }));
    navigation.navigate("CreatePost4");
  };

  const handleScore = (value) => {
    let len = value.length;
    let valid = " 1234567890";

    for (let val of value) {
      if (!valid.includes(val)) {
        return;
      }
    }
    setScore(value);
  };

  const handleOutOf = (value) => {
    let len = value.length;
    let valid = " 1234567890";

    for (let val of value) {
      if (!valid.includes(val)) {
        return;
      }
    }
    setOutOf(value);
  };

  const handleDescription = (value) => {
    if (value.length > maxDescriptionLength) {
      value = value.slice(0, maxDescriptionLength);
    }
    setDescription(value);
  };

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <View style={styles.actions}>
        <Text style={{ ...styles.labels, textAlign: "center" }}>
          What did you score in this paper?
        </Text>
        <View style={styles.score}>
          <TextInput
            keyboardType="number-pad"
            variant="standard"
            value={score}
            onChangeText={handleScore}
            label="Score"
            style={{ width: 50 }}
            color="darkorchid"
          />
          <Text>{"   /   "}</Text>
          <TextInput
            keyboardType="number-pad"
            variant="standard"
            value={outOf}
            onChangeText={handleOutOf}
            label="Out of"
            style={{ width: 50 }}
            color="darkorchid"
          />
        </View>
        <View style={{ alignItems: "center" }}>
          <Divider
            style={{
              marginVertical: 40,
              backgroundColor: "darkorchid",
              width: "85%",
              height: 1.5,
            }}
          />
        </View>
        <View style={styles.description}>
          <Text style={styles.labels}>
            Give a short description about the exam
          </Text>
          <View style={{ alignItems: "center" }}>
            <TextInput
              variant="standard"
              onChangeText={handleDescription}
              label="Description"
              value={description}
              style={{ width: "85%", marginTop: 10 }}
              helperText={description.length + " / " + maxDescriptionLength}
              multiline={true}
              numberOfLines={Math.ceil(description.length / 20) + 1}
              color="darkorchid"
            />
          </View>
        </View>
      </View>
      <View style={styles.navigate}>
        <Button
          mode="text"
          icon="arrow-right"
          contentStyle={{ flexDirection: "row-reverse" }}
          onPress={handleNext}
          disabled={
            !(
              description &&
              score &&
              outOf &&
              outOf >= score &&
              score !== "0" &&
              outOf !== "0"
            )
          }
        >
          Next
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "white",
    flexGrow: 1,
    justifyContent: "space-between",
  },
  navigate: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  labels: {
    fontFamily: "NunitoSans-Bold",
    marginVertical: 10,
    textAlign: "center",
  },
  score: {
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    paddingHorizontal: 15,
    marginVertical: 0,
  },
});

export default CreatePost3;
