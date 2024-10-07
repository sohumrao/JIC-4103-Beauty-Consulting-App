import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import { TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import { useState } from 'react';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../contexts/userContext';

import OptionsButton from '../assets/components/OptionsButton';
import ContinueButton from '../assets/components/ContinueButton';

function ClientDetails3() {
    const navigation = useNavigation();

    const [showChemicalSection, setShowChemicalSection] = useState(false);
    const [allergies, setAllergies] = useState('');

    const [showOtherSection, setShowOtherSection] = useState(false);

    const userContext = useContext(UserContext);

    const handleContinue = () => {
      userContext.updateUserContext({
      username: userContext.username,
      name: userContext.name,
      age: userContext.age,
      gender: userContext.gender,
      phoneNumber: userContext.phoneNumber,
      email: userContext.email,
      hairDetails: userContext.hairDetails,
      allergies: allergies,
      concerns: userContext.concerns,
      updateUserContext: userContext.updateUserContext
      });
      navigation.navigate('ClientDetailsComplete');
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
        textBoxHeader: {
          fontSize: 18,
          marginBottom: 10,
          fontWeight: 'bold',
          textAlign: 'center',
        },
        optionsContainer: {
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          marginBottom: 20,
        },
        allOptionsContainer: {
          flexDirection: 'row',
          flex: 1,
          justifyContent: 'space-between',
          marginBottom: 20,
        },
    });

    return (
      <ScrollView style={styles.container}>
      <Text style={styles.header}>Client Details
      </Text>
  <View style = {styles.stepIndicator}>
      <View style={[styles.step, styles.stepCompleted]}></View>
      <View style={[styles.step, styles.stepCompleted]}></View>
      <View style={[styles.step, styles.stepCompleted]}></View>
      <View style={styles.step}></View>
      </View>
      <View>
      <Text style={styles.textBoxHeader}>Any allergies we should know about?</Text>
      <TextInput style={styles.input} onChangeText={(text) => setAllergies(text)}/>
      <Text style={styles.textBoxHeader}>Any other concerns?</Text>
      <View style={styles.allOptionsContainer}> 
        <View style={styles.optionsContainer}>
          <OptionsButton title="Alopecia" />
          <OptionsButton title="Heat Damage"/>
          <OptionsButton title="Cradle Cap"/>
        </View>
        <View style={styles.optionsContainer}>
          <OptionsButton title="Thinning"/>
          <OptionsButton title="Chemicals" onPress={() => setShowChemicalSection(!showChemicalSection)}/>
          <OptionsButton title="Other" onPress={() => setShowOtherSection(!showOtherSection)}/>
          </View>
        </View>
        {showChemicalSection && (
          <View>
            <Text style={styles.textBoxHeader}>How have you used chemicals?</Text>
            <TextInput style={styles.input} placeholder="Colors?" placeholderTextColor="#000"/>
            <TextInput style={styles.input} placeholder="Relaxers?" placeholderTextColor="#000"/>
            <TextInput style={styles.input} placeholder="How long ago?" placeholderTextColor="#000"/>
          </View>
        )}
        {showOtherSection && (
          <View>
            <Text style={styles.textBoxHeader}>What are your other concerns?</Text>
            <TextInput style={styles.input}/>
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
          <ContinueButton onPress={() => handleContinue()} />
      </View>
      </ScrollView>
    );
}

export default ClientDetails3;
