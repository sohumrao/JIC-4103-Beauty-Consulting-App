import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import ContinueButton from '../assets/components/ContinueButton';
import { UserContext } from '../App';
import globalStyles from '../assets/GlobalStyles';

function ClientDetailsComplete() {
    const navigation = useNavigation();
    const userContext = useContext(UserContext);

    const handleContinue = async () => {
        const req = {
            username: userContext.username,
            name: userContext.name,
            email: userContext.email, 
            gender: userContext.gender,
            age: userContext.age,
            phoneNumber: userContext.phoneNumber,
            hairDetails: userContext.hairDetails,
            allergies: userContext.allergies,
        };
        console.log(req.body);
        try {
            const apiUrl = process.env.EXPO_PUBLIC_API_URL;
            if (!apiUrl) {
                console.error("API URL not defined");
                return;
            }
            const res = await axios.post(apiUrl + ':5050/client/', req);
            console.log('User created: ', res.data);
        } catch (error) {
            console.error('Error with API: ', error);
        }
        navigation.navigate('ProfileView');
    };

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>You're all set!</Text>
            <View style={globalStyles.buttonContainer}>
                <ContinueButton onPress={() => handleContinue()} />
            </View>
        </View>
    );
}

export default ClientDetailsComplete;
