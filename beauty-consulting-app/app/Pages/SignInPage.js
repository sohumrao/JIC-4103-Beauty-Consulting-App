import React, { useContext, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { UserContext } from '../App';
import SignupBackground from '../assets/components/SignupBackground';
import globalStyles from '../assets/GlobalStyles';
import ErrorMessage from '../components/ErrorMessage';

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
        console.log(req);

        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        if (!apiUrl) {
            console.error("API URL not defined");
            return;
        }

        // Validate account information
        try {
            const res = await axios.post(apiUrl + ':5050/account/signIn', req);
            setErrorMessage('');
            console.log("Sign in successful: " + res.data);
        } catch (error) {
            setErrorMessage(error.response.data);
            return;
        };

        // Check if account has associated client data. If so, navigate to profile
        var userProfileDataExists = false;
        try {
            const res = await axios.get(apiUrl + ':5050/client/' + username);
            console.log(res.data);
            userProfileDataExists = true;
            userContext.updateUserContext({
                username: username,
                name: res.data.name,
                age: res.data.age,
                gender: res.data.gender,
                phoneNumber: res.data.phoneNumber,
                email: res.data.email,
                hairDetails: res.data.hairDetails,
                allergies: res.data.allergies,
                concerns: res.data.concerns,
                updateUserContext: userContext.updateUserContext
            });
            navigation.navigate('ProfileView');
        } catch (error) {
            if (error.response.status !== 404) {
                setErrorMessage(error.response.data);
                return;
            }
        }

        // Check if account has associated stylist data. If so, navigate to business page.
        if (!userProfileDataExists) {
            try {
                const res = await axios.get(apiUrl + ':5050/stylist/' + username);
                userProfileDataExists = true;
                userContext.updateUserContext({
                    username: username,
                    name: res.data.name,
                    age: res.data.age,
                    gender: res.data.gender,
                    phoneNumber: res.data.phoneNumber,
                    email: res.data.email,
                    stylistDetails: res.data.stylistDetails,
                    updateUserContext: userContext.updateUserContext
                });
                navigation.navigate('BusinessInfoPage');
            } catch (error) {
                if (error.response.status !== 404) {
                    setErrorMessage(error.response.data);
                    return;
                }
            }
        }

        // If no profile data exists, take to landing page.
        if (!userProfileDataExists) {
            userContext.updateUserContext({
                username: username,
                name: userContext.name,
                age: userContext.age,
                gender: userContext.gender,
                phoneNumber: userContext.phoneNumber,
                email: userContext.email,
                hairDetails: userContext.hairDetails,
                allergies: userContext.allergies,
                concerns: userContext.concerns,
                stylistDetails: userContext.stylistDetails,
                updateUserContext: userContext.updateUserContext
            });
            navigation.navigate('LandingPage');
        }
    };

    return (
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
    );
}

export default SignInPage;
