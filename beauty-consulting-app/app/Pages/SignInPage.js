import React, { useContext, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { UserContext } from '../App';
import SignupBackground from '../assets/components/SignupBackground';
import globalStyles from '../assets/GlobalStyles';
import ErrorMessage from '../components/ErrorMessage';
import KeyboardMove from '../assets/components/KeyboardMove'

const SignInPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();

    const userContext = useContext(UserContext);

    const handleSignIn = async () => {
        const req = {
            username: username,
            password: password
        };
    
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        if (!apiUrl) {
            console.error("API URL not defined");
            return;
        }
    
        try {
            const res = await axios.post(apiUrl + ':5050/account/signIn', req);
            setErrorMessage('');
            console.log("Sign in successful: " + res.data);
        } catch (error) {
            setErrorMessage(error.response.data);
            return;
        }
    
        let userProfileDataExists = false;
    
        try {
            const clientRes = await axios.get(apiUrl + ':5050/client/' + username);
            userProfileDataExists = true;
            userContext.updateUserContext({
                username: username,
                name: clientRes.data.name,
                age: clientRes.data.age,
                gender: clientRes.data.gender,
                phoneNumber: clientRes.data.phoneNumber,
                email: clientRes.data.email,
                hairDetails: clientRes.data.hairDetails,
                allergies: clientRes.data.allergies,
                concerns: clientRes.data.concerns,
                role: 'client', 
                updateUserContext: userContext.updateUserContext
            });
                navigation.replace('Main');
            return;
        } catch (error) {
            if (error.response.status !== 404) {
                setErrorMessage(error.response.data);
                return;
            }
        }
    
        if (!userProfileDataExists) {
            try {
                const stylistRes = await axios.get(apiUrl + ':5050/stylist/' + username);
                userProfileDataExists = true;
                userContext.updateUserContext({
                    username: username,
                    name: stylistRes.data.name,
                    age: stylistRes.data.age,
                    gender: stylistRes.data.gender,
                    phoneNumber: stylistRes.data.phoneNumber,
                    email: stylistRes.data.email,
                    stylistDetails: stylistRes.data.stylistDetails,
                    role: 'stylist',
                    updateUserContext: userContext.updateUserContext
                });
                
    
                navigation.replace('Main');
                return;
            } catch (error) {
                if (error.response.status !== 404) {
                    setErrorMessage(error.response.data);
                    return;
                }
            }
        }
            if (!userProfileDataExists) {
            console.log('no navigation');
            navigation.replace('LandingPage');
        }
    };
    
    return (
        <KeyboardMove>
        <SignupBackground>
            <View style={globalStyles.box}>
                <Text style={globalStyles.title}>Sign In</Text>
                <TextInput
                    style={globalStyles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TextInput
                    style={globalStyles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <ErrorMessage message={errorMessage} />
                <TouchableOpacity style={globalStyles.button} onPress={handleSignIn}>
                    <Text style={globalStyles.buttonText}>Sign In</Text>
                </TouchableOpacity>
                <Text style={globalStyles.promptText}>Don't have an account?</Text>
                <Text style={globalStyles.linkText} onPress={() => { navigation.navigate("Create Account") }}>Create one.</Text>
                <Text style={globalStyles.linkText} onPress={() => { navigation.navigate("Forgot Password") }}>Forgot Password?</Text>
            </View>
        </SignupBackground>
        </KeyboardMove>
    );
}

export default SignInPage;
