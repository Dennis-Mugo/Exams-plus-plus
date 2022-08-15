import React, { useLayoutEffect, useContext, useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Button, Divider, TextInput } from "react-native-paper";
import { EducateContext } from "../../context/context";
import { AntDesign } from "@expo/vector-icons";
import manipulations from "../../utils/manipulate";
import SelectDropdown from "react-native-select-dropdown";

const CreatePost2 = ({ navigation }) => {
  const examTypes = manipulations.getExamTypes();
  const { setCreatingNewPost } = useContext(EducateContext);
  const [examType, setExamType] = useState(examTypes[0]);
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Post a past paper",
    });
  }, [navigation]);
  const handleNext = () => {
    setCreatingNewPost((prev) => ({
      ...prev,
      examType,
      year: parseInt(year),
      semester: parseInt(semester),
    }));
    navigation.navigate("CreatePost3");
  };
  const handleExamType = (option, index) => {
    setExamType(option);
  };
  const handleYear = (value) => {
    let len = value.length;
    let valid = " 1234567890";

    for (let val of value) {
      if (!valid.includes(val)) {
        return;
      }
    }
    if (value && parseInt(value) > 10) return;

    setYear(value);
  };
  const handleSemester = (value) => {
    let len = value.length;
    let valid = " 1234567890";

    for (let val of value) {
      if (!valid.includes(val)) {
        return;
      }
    }
    if (value && parseInt(value) > 10) return;

    setSemester(value);
  };
  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <View style={styles.actions}>
        <View style={styles.examType}>
          <Text style={styles.labels}>
            Select the type of exam your past paper is
          </Text>
          <SelectDropdown
            defaultValue={examTypes[0]}
            buttonStyle={{
              width: "100%",
              borderRadius: 5,
              backgroundColor: "transparent",
              borderColor: "#ccc",
              borderWidth: 0.5,
            }}
            rowTextStyle={{
              fontFamily: "NunitoSans-Regular",
            }}
            buttonTextStyle={{
              fontFamily: "NunitoSans-Regular",
            }}
            renderDropdownIcon={() => (
              <AntDesign name="caretdown" size={20} color="grey" />
            )}
            data={examTypes}
            onSelect={handleExamType}
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
        <View style={{ ...styles.examType, ...styles.yearSem }}>
          <Text style={styles.labels}>
            Type the YEAR(eg Yr 1) and SEMESTER in which this exam was done
          </Text>
          <View style={styles.yearSemContainer}>
            <TextInput
              keyboardType="number-pad"
              mode="outlined"
              value={year}
              onChangeText={handleYear}
              label="Year"
              style={{ width: "40%" }}
              outlineColor="darkorchid"
              theme={{
                colors: {
                  placeholder: "darkorchid",
                },
              }}
            />
            <TextInput
              keyboardType="number-pad"
              mode="outlined"
              value={semester}
              onChangeText={handleSemester}
              label="Semester"
              style={{ width: "40%" }}
              outlineColor="darkorchid"
              theme={{
                colors: {
                  placeholder: "darkorchid",
                },
              }}
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
          disabled={!(examType && year !== "0" && semester && semester !== "0")}
        >
          Next
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  navigate: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  examType: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  labels: {
    marginVertical: 10,
    fontFamily: "NunitoSans-Bold",
  },
  yearSem: {
    marginTop: 0,
  },
  yearSemContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default CreatePost2;
