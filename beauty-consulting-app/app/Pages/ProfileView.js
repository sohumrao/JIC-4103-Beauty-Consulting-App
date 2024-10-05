import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Link, useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/userContext";
import SignupBackground from "../assets/components/SignupBackground";
import globalStyles from "../assets/GlobalStyles";
import axios from "axios";

const ProfileView = () => {
  const navigation = useNavigation();

  var userContext = useContext(UserContext);
  var [name, setName] = useState("");
  var [age, setAge] = useState("");
  var [gender, setGender] = useState("");
  var [phoneNumber, setPhoneNumber] = useState("");
  var [allergies, setAllergies] = useState("");
  var [concerns, setConcerns] = useState("");
  var [isEdit, setIsEdit] = useState(false);

  const handleEdit = async () => {

    name = name != '' ? name : userContext.name;
    gender = gender != '' ? gender : userContext.gender;
    allergies = allergies != '' ? allergies : userContext.allergies;
    concerns = concerns != '' ? concerns : userContext.concerns;

    if (isEdit) {
      req = {
        username: userContext.username,
        name: name,
        age: userContext.age,
        gender: gender,
        phoneNumber: userContext.phoneNumber,
        email: userContext.email,
        hairDetails: userContext.hairDetails,
        allergies: allergies,
        concerns: concerns,
      };
      try {
        const apiURL =
          process.env.EXPO_PUBLIC_API_URL +
          ":5050/client/" +
          userContext.username;
        if (!apiURL) {
          console.error("apiURL not defined");
          return;
        }
        const res = await axios.put(apiURL, req);
        console.log("update successful: ", res.data);
      } catch (error) {
        console.error("Error with request: ", error);
      }

      // update user context for rest of session
      userContext = userContext.updateUserContext({username: userContext.username,
        name: name,
        age: age,
        gender: gender,
        phoneNumber: userContext.phoneNumber,
        email: userContext.email,
        hairDetails: userContext.hairDetails,
        allergies: allergies,
        concerns: concerns,
        updateUserContext: userContext.updateUserContext
    });
    }
    setIsEdit(!isEdit);
  };

  const deleteAccount = async () => {
    // TODO: update with a separate flow for password validation after backend rework

    try {
        console.log(userContext);
      const apiURL =
        process.env.EXPO_PUBLIC_API_URL +
        ":5050/client/" +
        userContext.username;
      if (!apiURL) {
        console.error("apiURL not defined");
      }
      const res = axios.delete(apiURL);
      console.log(res.message);
    } catch (error) {
      console.error("Error with request: ", error);
      return;
    }
    navigation.navigate("Sign In");
  };

  const styles = StyleSheet.create({
    inputContainer: {
      marginBottom: 10,
    },
  });

  return (
    <SignupBackground>
      <View style={globalStyles.box}>
          <View style={styles.inputContainer}>
            <Text style={globalStyles.inputHeaderText}>Name</Text>
            <TextInput
              style={globalStyles.input}
              placeholder={userContext.name}
              placeholderTextColor={"#000"}
              value={name}
              onChangeText={setName}
              editable={isEdit}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={globalStyles.inputHeaderText}>Gender</Text>
            <TextInput
              style={globalStyles.input}
              placeholder={userContext.gender}
              placeholderTextColor={"#000"}
              value={gender}
              onChangeText={setGender}
              editable={isEdit}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={globalStyles.inputHeaderText}>Allergies</Text>
            <TextInput
              style={globalStyles.input}
              placeholder={userContext.allergies}
              placeholderTextColor={"#000"}
              value={allergies}
              onChangeText={setAllergies}
              editable={isEdit}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={globalStyles.inputHeaderText}>Concerns</Text>
            <TextInput
              style={globalStyles.input}
              placeholder={userContext.concerns}
              placeholderTextColor={"#000"}
              value={concerns}
              onChangeText={setConcerns}
              editable={isEdit}
            />
          </View>

        <TouchableOpacity
          style={[globalStyles.button, { marginBottom: 15 }]}
          onPress={handleEdit}
        >
          <Text style={globalStyles.buttonText}>
            {isEdit ? "Update" : "Edit"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={globalStyles.button} onPress={deleteAccount}>
          <Text style={globalStyles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </SignupBackground>
  );
};

export default ProfileView;
