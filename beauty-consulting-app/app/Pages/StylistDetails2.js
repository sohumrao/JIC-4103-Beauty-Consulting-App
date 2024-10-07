// import React, { useContext, useState } from 'react';
// import { View, Text, TextInput, ScrollView } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { UserContext } from '../App';
// import globalStyles from '../assets/GlobalStyles';

// import ContinueButton from '../assets/components/ContinueButton';

// function StylistDetails2() {
    
//     const navigation = useNavigation();

//     // State for user input
//     const [gender, setGender] = useState('male');
//     const [name, setName] = useState('');
//     const [age, setAge] = useState('');
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [email, setEmail] = useState('');
//     const [experience, setExperience] = useState(''); 
//     const [specialty, setSpecialty] = useState(''); 
//     const [additionalInfo, setAdditionalInfo] = useState(''); 


//     const userContext = useContext(UserContext);

//     const handleContinue = () => {
//         userContext.updateUserContext({
//             username: userContext.username,
//             name: userContext.name,
//             age: userContext.age,
//             gender: userContext.gender,
//             phoneNumber: userContext.phoneNumber,
//             email: userContext.email,
//             stylistDetails: {
//                 experience: experience,
//                 specialty: specialty,
//                 additionalInfo: additionalInfo,
//             },
//             updateUserContext: userContext.updateUserContext
//         });
//         navigation.navigate('StylistDetailsComplete');
//     };

//     return (
//         <ScrollView style={globalStyles.container}>
//             <Text style={globalStyles.header}>Stylist Details</Text>
//             <View style={globalStyles.stepIndicator}>
//                 <View style={[globalStyles.step, globalStyles.stepCompleted]}></View>
//                 <View style={[globalStyles.step, globalStyles.stepCompleted]}></View>
//             </View>
            
//             <View style={globalStyles.form}>
//                 <Text style={globalStyles.label}>Years of Experience</Text>
//                 <TextInput
//                     style={globalStyles.input}
//                     value={experience}
//                     onChangeText={setExperience}
//                     keyboardType="numeric"
//                 />
                
//                 <Text style={globalStyles.label}>Specialty</Text>
//                 <TextInput
//                     style={globalStyles.input}
//                     value={specialty}
//                     onChangeText={setSpecialty}
//                 />
                
//                 <Text style={globalStyles.label}>Anything else we should know?</Text>
//                 <TextInput
//                     style={globalStyles.input}
//                     value={additionalInfo}
//                     onChangeText={setAdditionalInfo}
//                     multiline
//                 />
//             </View>
            
//             <View style={globalStyles.buttonContainer}>
//                 <ContinueButton onPress={handleContinue} />
//             </View>
//         </ScrollView>
//     );
// }

// export default StylistDetails2;


// import React, { useContext, useState } from 'react';
// import { View, Text, TextInput, ScrollView } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { UserContext } from '../App';
// import globalStyles from '../assets/GlobalStyles';
// import ContinueButton from '../assets/components/ContinueButton';

// function StylistDetails2() {
//     const navigation = useNavigation();

//     // Access the user context
//     const userContext = useContext(UserContext);

//     // State for stylist-specific inputs, initialized with context values if available
//     const [experience, setExperience] = useState(userContext.stylistDetails.experience || ''); 
//     const [specialty, setSpecialty] = useState(userContext.stylistDetails.specialty || ''); 
//     const [additionalInfo, setAdditionalInfo] = useState(userContext.stylistDetails.additionalInfo || ''); 

//     const handleContinue = () => {
//         // Update context with stylist details
//         userContext.updateUserContext({
//             ...userContext, // Keep existing fields in the context (name, age, gender, etc.)
//             stylistDetails: {
//                 experience: experience,
//                 specialty: specialty,
//                 additionalInfo: additionalInfo,
//             },
//         });
//         navigation.navigate('StylistDetailsComplete');
//     };

//     return (
//         <ScrollView style={globalStyles.container}>
//             <Text style={globalStyles.header}>Stylist Details</Text>
//             <View style={globalStyles.stepIndicator}>
//                 <View style={[globalStyles.step, globalStyles.stepCompleted]}></View>
//                 <View style={[globalStyles.step, globalStyles.stepCompleted]}></View>
//             </View>
            
//             <View style={globalStyles.form}>
//                 <Text style={globalStyles.label}>Years of Experience</Text>
//                 <TextInput
//                     style={globalStyles.input}
//                     value={experience}
//                     onChangeText={setExperience}
//                     keyboardType="numeric"
//                     placeholder="Enter your years of experience"
//                 />
                
//                 <Text style={globalStyles.label}>Specialty</Text>
//                 <TextInput
//                     style={globalStyles.input}
//                     value={specialty}
//                     onChangeText={setSpecialty}
//                     placeholder="Enter your specialty"
//                 />
                
//                 <Text style={globalStyles.label}>Anything else we should know?</Text>
//                 <TextInput
//                     style={globalStyles.input}
//                     value={additionalInfo}
//                     onChangeText={setAdditionalInfo}
//                     multiline
//                     placeholder="Enter any additional info"
//                 />
//             </View>
            
//             <View style={globalStyles.buttonContainer}>
//                 <ContinueButton onPress={handleContinue} />
//             </View>
//         </ScrollView>
//     );
// }

// export default StylistDetails2;


import React, { useContext, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../contexts/userContext';
import ContinueButton from '../assets/components/ContinueButton';

const StylistDetails2 = () => {
  const navigation = useNavigation();

  // Access the user context
  const userContext = useContext(UserContext);

  // State for stylist-specific inputs, initialized with context values if available
  const [experience, setExperience] = useState(userContext.stylistDetails.experience || ''); 
  const [specialty, setSpecialty] = useState(userContext.stylistDetails.specialty || ''); 
  const [additionalInfo, setAdditionalInfo] = useState(userContext.stylistDetails.additionalInfo || '');
  const [businessName, setBusinessName] = useState(userContext.stylistDetails.businessName || '');
  const [businessAddress, setBusinessAddress] = useState(userContext.stylistDetails.businessAddress || '');

  const handleContinue = () => {
    // Update context with stylist details
    userContext.updateUserContext({
      ...userContext, // Keep existing fields in the context (name, age, gender, etc.)
      stylistDetails: {
        experience: experience,
        specialty: specialty,
        additionalInfo: additionalInfo,
        businessName: businessName,
        businessAddress: businessAddress
      },
    });
    navigation.navigate('StylistDetailsComplete');
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
        <View style={[styles.step, styles.stepCompleted]}></View>
      </View>


      <Text style={styles.label}>Name of Business</Text>
        <TextInput
          style={styles.input}
          value={businessName}
          onChangeText={setBusinessName}
          placeholder="Enter your business name"
        />

        <Text style={styles.label}>Address of Business</Text>
        <TextInput
          style={styles.input}
          value={businessAddress}
          onChangeText={setBusinessAddress}
          placeholder="Enter your business address"
        />


      <View style={styles.form}>
        <Text style={styles.label}>Years of Experience</Text>
        <TextInput
          style={styles.input}
          value={experience}
          onChangeText={setExperience}
          keyboardType="numeric"
          placeholder="Enter your years of experience"
        />

        <Text style={styles.label}>Specialty</Text>
        <TextInput
          style={styles.input}
          value={specialty}
          onChangeText={setSpecialty}
          placeholder="Enter your specialty"
        />

        <Text style={styles.label}>Anything else we should know?</Text>
        <TextInput
          style={styles.input}
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
          multiline
          placeholder="Enter any additional info"
        />
      </View>

      <ContinueButton onPress={handleContinue} />
    </ScrollView>
  );
};

export default StylistDetails2;
