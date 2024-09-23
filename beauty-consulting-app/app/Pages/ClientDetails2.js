import React, { useContext, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../App';
import globalStyles from '../assets/GlobalStyles';

import OptionsButton from '../assets/components/OptionsButton';
import ContinueButton from '../assets/components/ContinueButton';

function ClientDetails2() {
    const navigation = useNavigation();
    const userContext = useContext(UserContext);

    const [selections, setSelections] = useState({
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
        setSelections(prev => ({ ...prev, [option]: !prev[option] }));
    };

    const handleContinue = () => {
        userContext.updateUserContext({
            username: userContext.username,
            name: userContext.name,
            age: userContext.age,
            gender: userContext.gender,
            phoneNumber: userContext.phoneNumber,
            email: userContext.email,
            hairDetails: selections,
            allergies: userContext.allergies,
            concerns: userContext.concerns,
            updateUserContext: userContext.updateUserContext
        });
        navigation.navigate('ClientDetails3');
    };

    return (
        <ScrollView style={globalStyles.container}>
            <Text style={globalStyles.header}>Client Details</Text>
            <View style={globalStyles.stepIndicator}>
                <View style={[globalStyles.step, globalStyles.stepCompleted]}></View>
                <View style={[globalStyles.step, globalStyles.stepCompleted]}></View>
                <View style={globalStyles.step}></View>
                <View style={globalStyles.step}></View>
            </View>
            <View>
                <Text style={globalStyles.header}>Hair Type</Text>
                <View style={globalStyles.allOptionsContainer}>
                    <View style={globalStyles.optionsContainer}>
                        <OptionsButton title="Natural" onPress={() => handleSelectionChange('Natural')} />
                        <OptionsButton title="Relaxed" onPress={() => handleSelectionChange('Relaxed')} />
                        <OptionsButton title="Straight" onPress={() => handleSelectionChange('Straight')} />
                        <OptionsButton title="Wavy" onPress={() => handleSelectionChange('Wavy')} />
                    </View>
                    <View style={globalStyles.optionsContainer}>
                        <OptionsButton title="Curly" onPress={() => handleSelectionChange('Curly')} />
                        <OptionsButton title="Deep Wave" onPress={() => handleSelectionChange('DeepWave')} />
                        <OptionsButton title="Loose Curl" onPress={() => handleSelectionChange('LooseCurl')} />
                        <OptionsButton title="Tightly Coiled" onPress={() => handleSelectionChange('TightlyCoiled')} />
                    </View>
                </View>
                <Text style={globalStyles.header}>Hair Density</Text>
                <View style={[globalStyles.optionsContainer, { justifyContent: 'space-between', flexDirection: 'row' }]}>
                    <OptionsButton title="Fine" onPress={() => handleSelectionChange('Fine')} />
                    <OptionsButton title="Medium" onPress={() => handleSelectionChange('Medium')} />
                    <OptionsButton title="Thick" onPress={() => handleSelectionChange('Thick')} />
                </View>
            </View>
            <View style={globalStyles.buttonContainer}>
                <ContinueButton onPress={handleContinue} />
            </View>
        </ScrollView>
    );
}

export default ClientDetails2;
