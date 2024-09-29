import React, { useState, useContext } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../App';
import ContinueButton from '../assets/components/ContinueButton';
import globalStyles from '../assets/GlobalStyles';

const StylistDetails = () => {
  
  const navigation = useNavigation();
  const [gender, setGender] = useState('male');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const userContext = useContext(UserContext);

  const handleContinue = () => {
    userContext.updateUserContext({
      username: userContext.username,
      name: name,
      age: age,
      gender: gender,
      phoneNumber: phoneNumber,
      email: email,
      stylistDetails: {
        experience: experience,
        specialty: specialty,
        additionalInfo: additionalInfo,
    },
      updateUserContext: userContext.updateUserContext
    });
    navigation.navigate('StylistDetails2');
  };

  const navigateToBusinessInfo = () => {
    navigation.navigate('BusinessInfoPage');
  };    

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.header}>Stylist Details</Text>

      <View style={globalStyles.stepIndicator}>
        <View style={[globalStyles.step, globalStyles.stepCompleted]}></View>
        <View style={globalStyles.step}></View>
      </View>

      <View style={globalStyles.form}>
        <Text style={globalStyles.label}>Name</Text>
        <TextInput
          style={globalStyles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={globalStyles.label}>Age</Text>
        <View style={globalStyles.ageInputContainer}>
          <TextInput
            style={globalStyles.ageInput}
            value={age}
            onChangeText={setAge}
          />
        </View>

        <Text style={globalStyles.label}>Gender</Text>
        <View style={globalStyles.radioContainer}>
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

        <Text style={globalStyles.label}>Mobile Number</Text>
        <TextInput
          style={globalStyles.input}
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <Text style={globalStyles.label}>Email</Text>
        <TextInput
          style={globalStyles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <ContinueButton onPress={handleContinue} />

      <Button title="Go to Business Info" onPress={navigateToBusinessInfo} />

    </ScrollView>
  );
};

export default StylistDetails;
