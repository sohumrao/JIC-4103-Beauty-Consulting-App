import { StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import React from 'react';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      marginBottom: 16,
    },
    button: {
      elevation: 8,
      backgroundColor: "#FF5252",
      borderRadius: 6,
      paddingVertical: 12,
      paddingHorizontal: 84,
    },
    buttonText: {
      fontSize: 24,
      color: "#fff",
      fontWeight: "bold",
      alignSelf: "center",
    }
  });

  const ContinueButton = ({ onPress }) => {
    return (
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    );
  };

  export default ContinueButton;