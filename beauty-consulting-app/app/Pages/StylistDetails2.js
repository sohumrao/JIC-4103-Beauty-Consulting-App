import React, { useContext, useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../App';
import globalStyles from '../assets/GlobalStyles';

import ContinueButton from '../assets/components/ContinueButton';

function StylistDetails2() {
    const navigation = useNavigation();
    const userContext = useContext(UserContext);

    const [experience, setExperience] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');

    const handleContinue = () => {
        userContext.updateUserContext({
            username: userContext.username,
            name: userContext.name,
            age: userContext.age,
            gender: userContext.gender,
            phoneNumber: userContext.phoneNumber,
            email: userContext.email,
            stylistDetails: {
                experience: experience,
                specialty: specialty,
                additionalInfo: additionalInfo,
            },
            updateUserContext: userContext.updateUserContext
        });
        navigation.navigate('StylistDetailsComplete');
    };

    return (
        <ScrollView style={globalStyles.container}>
            <Text style={globalStyles.header}>Stylist Details</Text>
            <View style={globalStyles.stepIndicator}>
                <View style={[globalStyles.step, globalStyles.stepCompleted]}></View>
                <View style={[globalStyles.step, globalStyles.stepCompleted]}></View>
            </View>
            
            <View style={globalStyles.form}>
                <Text style={globalStyles.label}>Years of Experience</Text>
                <TextInput
                    style={globalStyles.input}
                    value={experience}
                    onChangeText={setExperience}
                    keyboardType="numeric"
                />
                
                <Text style={globalStyles.label}>Specialty</Text>
                <TextInput
                    style={globalStyles.input}
                    value={specialty}
                    onChangeText={setSpecialty}
                />
                
                <Text style={globalStyles.label}>Anything else we should know?</Text>
                <TextInput
                    style={globalStyles.input}
                    value={additionalInfo}
                    onChangeText={setAdditionalInfo}
                    multiline
                />
            </View>
            
            <View style={globalStyles.buttonContainer}>
                <ContinueButton onPress={handleContinue} />
            </View>
        </ScrollView>
    );
}

export default StylistDetails2;
