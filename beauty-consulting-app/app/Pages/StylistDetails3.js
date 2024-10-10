import React, { useState, useContext } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/userContext";

import OptionsButton from "../assets/components/OptionsButton";
import ContinueButton from "../assets/components/ContinueButton";

const StylistDetails3 = () => {
  const navigation = useNavigation();
  const userContext = useContext(UserContext);

  const [workedWithHairTypes, setWorkedWithHairTypes] = useState({
    Natural: false,
    Relaxed: false,
    Straight: false,
    Wavy: false,
    Curly: false,
    DeepWave: false,
    LooseCurl: false,
    TightlyCoiled: false,
    Fine: false,
    Medium: false,
    Thick: false,
  });

  const handleSelectionChange = (option) => {
    setWorkedWithHairTypes((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  const handleContinue = () => {
    // Update context with stylist's hair type experience
    userContext.updateUserContext({
      ...userContext,
      business: {
        ...userContext.business,
        workedWithHairTypes: workedWithHairTypes,
      },
    });
    navigation.navigate("StylistDetailsComplete");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#fff",
    },
    header: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
    stepIndicator: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    step: {
      flex: 1,
      height: 5,
      backgroundColor: "#eee",
      borderRadius: 2.5,
      marginHorizontal: 2,
    },
    stepCompleted: {
      backgroundColor: "red",
    },
    form: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      marginBottom: 10,
    },
    optionsContainer: {
      flexDirection: "column",
      flex: 1,
      justifyContent: "space-between",
      marginBottom: 20,
    },
    allOptionsContainer: {
      flexDirection: "row",
      flex: 1,
      justifyContent: "space-between",
      marginBottom: 20,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>What Hair Types Have You Worked With?</Text>

      <View style={styles.stepIndicator}>
        <View style={[styles.step, styles.stepCompleted]}></View>
        <View style={[styles.step, styles.stepCompleted]}></View>
        <View style={[styles.step, styles.stepCompleted]}></View>
      </View>

      <View style={styles.container}>
        <Text style={styles.header}>Hair Type Experience</Text>
        <View style={styles.allOptionsContainer}>
          <View style={styles.optionsContainer}>
            <OptionsButton
              title="Natural"
              onPress={() => handleSelectionChange("Natural")}
            />
            <OptionsButton
              title="Relaxed"
              onPress={() => handleSelectionChange("Relaxed")}
            />
            <OptionsButton
              title="Straight"
              onPress={() => handleSelectionChange("Straight")}
            />
            <OptionsButton
              title="Wavy"
              onPress={() => handleSelectionChange("Wavy")}
            />
          </View>
          <View style={styles.optionsContainer}>
            <OptionsButton
              title="Curly"
              onPress={() => handleSelectionChange("Curly")}
            />
            <OptionsButton
              title="Deep Wave"
              onPress={() => handleSelectionChange("DeepWave")}
            />
            <OptionsButton
              title="Loose Curl"
              onPress={() => handleSelectionChange("LooseCurl")}
            />
            <OptionsButton
              title="Tightly Coiled"
              onPress={() => handleSelectionChange("TightlyCoiled")}
            />
          </View>
        </View>

        <Text style={styles.header}>Hair Density Experience</Text>
        <View
          style={[
            styles.optionsContainer,
            { justifyContent: "space-between", flexDirection: "row" },
          ]}
        >
          <View style={[styles.optionsContainer]}>
            <OptionsButton
              title="Fine"
              onPress={() => handleSelectionChange("Fine")}
            />
          </View>
          <View style={[styles.optionsContainer]}>
            <OptionsButton
              title="Medium"
              onPress={() => handleSelectionChange("Medium")}
            />
          </View>
          <View style={[styles.optionsContainer]}>
            <OptionsButton
              title="Thick"
              onPress={() => handleSelectionChange("Thick")}
            />
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <ContinueButton onPress={() => handleContinue()} />
      </View>
    </ScrollView>
  );
};

export default StylistDetails3;
