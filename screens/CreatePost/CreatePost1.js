import React, { useContext, useLayoutEffect, useState } from "react";
import { Button, TextInput, Divider } from "react-native-paper";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import manipulations from "../../utils/manipulate";
import SelectDropdown from "react-native-select-dropdown";
import { AntDesign } from "@expo/vector-icons";
import { EducateContext } from "../../context/context";

const CreatePost1 = ({ navigation }) => {
  const categories = manipulations.getPostCategories();
  const { setCreatingNewPost } = useContext(EducateContext);
  const [unitName, setUnitName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Post a past paper",
    });
  }, [navigation]);
  const handleNext = () => {
    setCreatingNewPost((prev) => ({
      ...prev,
      unitName,
      subject: selectedCategory,
    }));
    navigation.navigate("CreatePost2");
  };
  const handleChangeUnitName = (value) => {
    setUnitName(value);
  };
  const handleUnitCategory = (selected, index) => {
    setSelectedCategory(selected);
  };
  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <View style={styles.actions}>
        <View style={styles.unitName}>
          <TextInput
            label="Unit/Subject name"
            mode="outlined"
            outlineColor="darkorchid"
            value={unitName}
            onChangeText={handleChangeUnitName}
            theme={{
              colors: {
                placeholder: "darkorchid",
              },
            }}
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
        <View style={styles.unitCategory}>
          <Text style={styles.categoryText}>Category</Text>
          <SelectDropdown
            defaultValue={categories[0]}
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
            data={categories}
            onSelect={handleUnitCategory}
          />
        </View>
      </View>
      <View style={styles.navigate}>
        <Button
          mode="text"
          icon="arrow-right"
          contentStyle={{ flexDirection: "row-reverse" }}
          onPress={handleNext}
          disabled={!(unitName && selectedCategory)}
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
  unitName: {
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 15,
    // ...manipulations.border(),
  },
  navigate: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  unitCategory: {
    backgroundColor: "white",
    // marginTop: 30,
    padding: 15,
  },
  categoryText: {
    fontFamily: "NunitoSans-Regular",
    fontSize: 14,
    marginBottom: 5,
  },
});

export default CreatePost1;
