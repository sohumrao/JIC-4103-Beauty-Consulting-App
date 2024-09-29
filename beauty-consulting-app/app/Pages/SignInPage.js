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
        try {
            const apiUrl = process.env.EXPO_PUBLIC_API_URL;
            if (!apiUrl) {
                console.error("API URL not defined");
                return;
            }
            const res = await axios.post(apiUrl + ':5050/account/signIn', req);
            console.log("Sign in successful: " + res.data);
        } catch (error) {
            setErrorMessage(error.response.data);
            return;
        };
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
            updateUserContext: userContext.updateUserContext
        });
        navigation.navigate("ProfilePage");
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
