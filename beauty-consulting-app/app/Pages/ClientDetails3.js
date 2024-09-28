import React, { useContext, useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../App';
import globalStyles from '../assets/GlobalStyles';

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

    return (
        <ScrollView style={globalStyles.container}>
            <Text style={globalStyles.header}>Client Details</Text>
            <View style={globalStyles.stepIndicator}>
                <View style={[globalStyles.step, globalStyles.stepCompleted]}></View>
                <View style={[globalStyles.step, globalStyles.stepCompleted]}></View>
                <View style={[globalStyles.step, globalStyles.stepCompleted]}></View>
                <View style={globalStyles.step}></View>
            </View>
            <View>
                <Text style={globalStyles.textBoxHeader}>Any allergies we should know about?</Text>
                <TextInput 
                    style={globalStyles.input} 
                    onChangeText={(text) => setAllergies(text)} 
                />
                <Text style={globalStyles.textBoxHeader}>Any other concerns?</Text>
                <View style={globalStyles.allOptionsContainer}> 
                    <View style={globalStyles.optionsContainer}>
                        <OptionsButton title="Alopecia" />
                        <OptionsButton title="Heat Damage"/>
                        <OptionsButton title="Cradle Cap"/>
                    </View>
                    <View style={globalStyles.optionsContainer}>
                        <OptionsButton title="Thinning"/>
                        <OptionsButton title="Chemicals" onPress={() => setShowChemicalSection(!showChemicalSection)}/>
                        <OptionsButton title="Other" onPress={() => setShowOtherSection(!showOtherSection)}/>
                    </View>
                </View>
                {showChemicalSection && (
                    <View>
                        <Text style={globalStyles.textBoxHeader}>How have you used chemicals?</Text>
                        <TextInput style={globalStyles.input} placeholder="Colors?" placeholderTextColor="#000"/>
                        <TextInput style={globalStyles.input} placeholder="Relaxers?" placeholderTextColor="#000"/>
                        <TextInput style={globalStyles.input} placeholder="How long ago?" placeholderTextColor="#000"/>
                    </View>
                )}
                {showOtherSection && (
                    <View>
                        <Text style={globalStyles.textBoxHeader}>What are your other concerns?</Text>
                        <TextInput style={globalStyles.input}/>
                    </View>
                )}
            </View>
            <View style={globalStyles.buttonContainer}>
                <ContinueButton onPress={handleContinue} />
            </View>
        </ScrollView>
    );
}

export default ClientDetails3;
