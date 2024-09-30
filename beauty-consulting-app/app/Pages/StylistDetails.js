// import React, { useState, useContext } from 'react';
// import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
// import { RadioButton } from 'react-native-paper';
// import { useNavigation } from '@react-navigation/native';
// import { UserContext } from '../App';
// import ContinueButton from '../assets/components/ContinueButton';
// import globalStyles from '../assets/GlobalStyles';

// const StylistDetails = () => {
  
//   const navigation = useNavigation();
//   const [gender, setGender] = useState('male');
//   const [name, setName] = useState('');
//   const [age, setAge] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [email, setEmail] = useState('');

//   const userContext = useContext(UserContext);

//   const handleContinue = () => {
//     userContext.updateUserContext({
//       username: userContext.username,
//       name: name,
//       age: age,
//       gender: gender,
//       phoneNumber: phoneNumber,
//       email: email,
//       stylistDetails: {
//         experience: experience,
//         specialty: specialty,
//         additionalInfo: additionalInfo,
//     },
//       updateUserContext: userContext.updateUserContext
//     });
//     navigation.navigate('StylistDetails2');
//   };

//   const navigateToBusinessInfo = () => {
//     navigation.navigate('BusinessInfoPage');
//   };    

//   return (
//     <ScrollView contentContainerStyle ={globalStyles.container}>
//       <Text style={globalStyles.header}>Stylist Details</Text>

//       <View style={globalStyles.stepIndicator}>
//         <View style={[globalStyles.step, globalStyles.stepCompleted]}></View>
//         <View style={globalStyles.step}></View>
//       </View>

//       <View style={globalStyles.form}>
//         <Text style={globalStyles.label}>Name</Text>
//         <TextInput
//           style={globalStyles.input}
//           value={name}
//           onChangeText={setName}
//         />

//         <Text style={globalStyles.label}>Age</Text>
//         <View style={globalStyles.ageInputContainer}>
//           <TextInput
//             style={globalStyles.ageInput}
//             value={age}
//             onChangeText={setAge}
//           />
//         </View>

//         <Text style={globalStyles.label}>Gender</Text>
//         <View style={globalStyles.radioContainer}>
//           <RadioButton
//             value="male"
//             status={gender === 'male' ? 'checked' : 'unchecked'}
//             onPress={() => setGender('male')}
//           />
//           <Text>Male</Text>
//           <RadioButton
//             value="female"
//             status={gender === 'female' ? 'checked' : 'unchecked'}
//             onPress={() => setGender('female')}
//           />
//           <Text>Female</Text>
//           <RadioButton
//             value="other"
//             status={gender === 'other' ? 'checked' : 'unchecked'}
//             onPress={() => setGender('other')}
//           />
//           <Text>Other</Text>
//         </View>

//         <Text style={globalStyles.label}>Mobile Number</Text>
//         <TextInput
//           style={globalStyles.input}
//           keyboardType="phone-pad"
//           value={phoneNumber}
//           onChangeText={setPhoneNumber}
//         />

//         <Text style={globalStyles.label}>Email</Text>
//         <TextInput
//           style={globalStyles.input}
//           keyboardType="email-address"
//           value={email}
//           onChangeText={setEmail}
//         />
//       </View>

//       <ContinueButton onPress={handleContinue} />

// 	  <TouchableOpacity
// 			style={globalStyles.button}
// 			onPress={navigateToBusinessInfo}
// 		>
// 			<Text style={globalStyles.buttonText}>Go to Business Info</Text>
// 		</TouchableOpacity>
//     </ScrollView>
//   );
// };

// export default StylistDetails;



// import React, { useState, useContext } from 'react';
// import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
// import { RadioButton } from 'react-native-paper';
// import { useNavigation } from '@react-navigation/native';
// import { UserContext } from '../App';
// import ContinueButton from '../assets/components/ContinueButton';
// import globalStyles from '../assets/GlobalStyles';

// const StylistDetails = () => {
//   const navigation = useNavigation();

//   // State for user input
//   const [gender, setGender] = useState('male');
//   const [name, setName] = useState('');
//   const [age, setAge] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [email, setEmail] = useState('');
//   const [experience, setExperience] = useState(''); // Added missing state
//   const [specialty, setSpecialty] = useState(''); // Added missing state
//   const [additionalInfo, setAdditionalInfo] = useState(''); // Added missing state

//   const userContext = useContext(UserContext);

//   // Handle continue button press
//   const handleContinue = () => {
//     userContext.updateUserContext({
//       username: userContext.username,
//       name: name,
//       age: age,
//       gender: gender,
//       phoneNumber: phoneNumber,
//       email: email,
//       stylistDetails: {
//         experience: experience,
//         specialty: specialty,
//         additionalInfo: additionalInfo,
//       },
//       updateUserContext: userContext.updateUserContext
//     });
//     navigation.navigate('StylistDetails2');
//   };

// //   // Navigate to Business Info Page
// //   const navigateToBusinessInfo = () => {
// //     navigation.navigate('BusinessInfoPage');
// //   };

//   return (
//     <ScrollView style={[globalStyles.container, { justifyContent: undefined }]}>
//       <Text style={globalStyles.header}>Stylist Details</Text>

//       <View style={globalStyles.stepIndicator}>
//         <View style={[globalStyles.step, globalStyles.stepCompleted]}></View>
//         <View style={globalStyles.step}></View>
//       </View>

//       <View style={globalStyles.form}>
//         <Text style={globalStyles.label}>Name</Text>
//         <TextInput
//           style={globalStyles.input}
//           value={name}
//           onChangeText={setName}
//         />

//         <Text style={globalStyles.label}>Age</Text>
//         <View style={globalStyles.ageInputContainer}>
//           <TextInput
//             style={globalStyles.ageInput}
//             value={age}
//             onChangeText={setAge}
//             keyboardType="numeric"
//           />
//         </View>

//         <Text style={globalStyles.label}>Gender</Text>
//         <View style={globalStyles.radioContainer}>
//           <RadioButton
//             value="male"
//             status={gender === 'male' ? 'checked' : 'unchecked'}
//             onPress={() => setGender('male')}
//           />
//           <Text>Male</Text>
//           <RadioButton
//             value="female"
//             status={gender === 'female' ? 'checked' : 'unchecked'}
//             onPress={() => setGender('female')}
//           />
//           <Text>Female</Text>
//           <RadioButton
//             value="other"
//             status={gender === 'other' ? 'checked' : 'unchecked'}
//             onPress={() => setGender('other')}
//           />
//           <Text>Other</Text>
//         </View>

//         <Text style={globalStyles.label}>Mobile Number</Text>
//         <TextInput
//           style={globalStyles.input}
//           keyboardType="phone-pad"
//           value={phoneNumber}
//           onChangeText={setPhoneNumber}
//         />

//         <Text style={globalStyles.label}>Email</Text>
//         <TextInput
//           style={globalStyles.input}
//           keyboardType="email-address"
//           value={email}
//           onChangeText={setEmail}
//         />
//       </View>

//       <ContinueButton onPress={handleContinue} />

//       {/* <TouchableOpacity
//         style={globalStyles.button}
//         onPress={navigateToBusinessInfo}
//       > */}
//         <Text style={globalStyles.buttonText}>Go to Business Info</Text>
//       {/* </TouchableOpacity> */}
//     </ScrollView>
//   );
// };

// export default StylistDetails;


import React, { useState, useContext } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../App';
import ContinueButton from '../assets/components/ContinueButton';

const StylistDetails = () => {
  const navigation = useNavigation();

  // State for user input
  const [gender, setGender] = useState('male');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState(''); 
  const [specialty, setSpecialty] = useState(''); 
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [businessName, setBusinessName] = useState(''); 
  const [businessAddress, setBusinessAddress] = useState('');

  const userContext = useContext(UserContext);

  // Handle continue button press
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
        businessName: businessName,
        businessAddress: businessAddress
      },
      updateUserContext: userContext.updateUserContext
    });
    // console.log('Navigating to StylistDetails2');
    navigation.navigate('StylistDetails2');
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Stylist Details</Text>

      <View style={styles.stepIndicator}>
        <View style={[styles.step, styles.stepCompleted]}></View>
        <View style={styles.step}></View>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Age</Text>
        <View style={styles.ageInputContainer}>
          <TextInput
            style={styles.ageInput}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.label}>Gender</Text>
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
          onChangeText={setPhoneNumber}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <ContinueButton onPress={handleContinue} />
    </ScrollView>
  );
};

export default StylistDetails;
