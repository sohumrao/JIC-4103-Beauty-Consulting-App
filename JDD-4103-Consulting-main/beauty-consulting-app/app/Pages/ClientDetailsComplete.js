import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';
import axios from 'axios';

import ClientDetails from './ClientDetails';
import ContinueButton from '../assets/components/ContinueButton';
import { UserContext } from '../App';


function ClientDetailsComplete() {

    const navigation = useNavigation();

    const userContext = useContext(UserContext);

    const handleContinue = async () => {
        req = {
                name: userContext.name,
                email: userContext.email, 
                gender: userContext.gender,
                age: userContext.age,
                phoneNumber: userContext.phoneNumber,
                hairDetails: userContext.hairDetails,
                allergies: userContext.allergies
        };
        console.log(req.body);
        try {
            apiUrl = process.env.EXPO_PUBLIC_API_URL;
            if (!apiUrl) {
                console.error("API URL not defined");
                return;
            }
            const res = await axios.post(apiUrl + ':5050/record/', req);
            console.log('User created: ', res.data);
        } catch (error) {
            console.error('Error with API: ', error);
        };
        navigation.navigate('ProfilePage');
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'space-around',
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: -48,
        },
        buttonContainer: {
            width: '100%',
            paddingHorizontal: 20,
            paddingVertical: 20,
        },
    });
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>You're all set!</Text>
            <View style={styles.buttonContainer}>
                <ContinueButton onPress={() => handleContinue()} />
            </View>
        </View>
    );
}

export default ClientDetailsComplete;