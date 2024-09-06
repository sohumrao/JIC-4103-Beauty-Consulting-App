import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import { TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import { useState, useContext } from 'react';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../App';

import ContinueButton from '../assets/components/ContinueButton';

const ClientDetails = () => {
  
  // State variables for text fields
  const navigation = useNavigation();
  const [gender, setGender] = useState('male');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const userContext = useContext(UserContext);


  // Updating context values when continue button is hit
  const handleContinue = () => {
    userContext.updateUserContext({
      username: userContext.username,
      name: name,
      age: age,
      gender: gender,
      phoneNumber: phoneNumber,
      email: email,
      hairDetails:
      userContext.hairDetails,
      allergies: userContext.allergies,
      concerns: userContext.concerns,
      updateUserContext: userContext.updateUserContext
    });
    navigation.navigate('ClientDetails2');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    header: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    stepIndicator: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    step: {
      flex: 1,
      height: 5,
      backgroundColor: '#eee',
      borderRadius: 2.5,
      marginHorizontal: 2,
    },
    stepCompleted: {
      backgroundColor: 'red',
    },
    form: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      marginBottom: 10,
    },
    input: {
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 20,
    },
    ageInputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      
    },
    ageInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginHorizontal: 5,
      marginBottom: 20,
    },
    radioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    continueButton: {
      backgroundColor: 'red',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    continueButtonText: {
      fontSize: 16,
      color: '#fff',
      fontWeight: 'bold',
    },
  });
//add keyboardAvoidingView here - currently keyboard blocks input
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Client Details
      </Text>

      <View style={styles.stepIndicator}>
        <View style={[styles.step, styles.stepCompleted]}></View>
        <View style={styles.step}></View>
        <View style={styles.step}></View>
        <View style={styles.step}></View>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
        style={styles.input}
        value={name}
        onChangeText={(text) => setName(text)}
        />

        <Text style={styles.label}>Age</Text>
        {/* REDO THIS PART: MAKE AN ACTUAL DATE INPUT */}
        <View style={styles.ageInputContainer}>
          <TextInput style={styles.ageInput}
          value={age}
          onChangeText={(text) => setAge(text)}
          />
          {/* <TextInput style={styles.ageInput} />
          <TextInput style={styles.ageInput} /> */}
        </View>

        <Text style={styles.label}>Gender</Text>
        {/* REDO THIS PART BUBBLES AND CLICK ON TEXT*/} 
        <View style={styles.radioContainer}>
          <RadioButton
            value="male"
            status={gender === 'male' ? 'checked' : 'unchecked'}
            onPress={() => setGender('male')}
          />
          <Text>Male</Text>
          <RadioButton
            value="female"
            status={gender === 'female' ? 'checked' : 'unchecked'}
            onPress={() => setGender('female')}
          />
          <Text>Female</Text>
          <RadioButton
            value="other"
            status={gender === 'other' ? 'checked' : 'unchecked'}
            onPress={() => setGender('other')}
          />
          <Text>Other</Text>
        </View>

        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
        style={styles.input}
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
        />
      </View>

      <ContinueButton onPress={() => handleContinue()} />
    </ScrollView>
  );
};

export default ClientDetails;
    