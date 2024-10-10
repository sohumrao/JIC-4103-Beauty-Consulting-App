import { StyleSheet } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import React from "react";
import { useState } from "react";

const styles = StyleSheet.create({
  button: {
    elevation: 8,
    backgroundColor: "#ccc",
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    midWidth: 50,
  },
});

const OptionsButton = ({ title, onPress }) => {
  const [buttonColor, setButtonColor] = useState("#ccc");
  const handlePress = () => {
    const changeColor = buttonColor === "#ccc" ? "#FF5252" : "#ccc";
    setButtonColor(changeColor);
    if (onPress) {
      onPress();
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: buttonColor }]}
        onPress={handlePress}
      >
        <Text>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OptionsButton;
