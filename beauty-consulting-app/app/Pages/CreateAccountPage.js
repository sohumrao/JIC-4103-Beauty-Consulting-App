import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { UserContext } from '../contexts/userContext';
import SignupBackground from '../assets/components/SignupBackground';
import globalStyles from '../assets/GlobalStyles';
import ErrorMessage from '../components/ErrorMessage';

const CreateAccountPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();

    const userContext = useContext(UserContext);
    const handleCreateAccount = async () => {
        const req = {
            username: username,
            password: password
        };
        console.log(req.body);
        try {
            const apiUrl = process.env.EXPO_PUBLIC_API_URL;
            if (!apiUrl) {
                console.error("API URL not defined");
                return;
            }
            const res = await axios.post(apiUrl + ':5050/account/createAccount', req);
            console.log('Account created: ', res.data);
        } catch (error) {
            setErrorMessage(error.response.data);
            return;
        }
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
        navigation.navigate("LandingPage");
    }

    return (
        <SignupBackground>
            <View style={globalStyles.box}>
                <Text style={globalStyles.title}>Create Your Account</Text>
                <Text style={globalStyles.linkText}>Username</Text>
                <TextInput
                    style={globalStyles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Text style={globalStyles.linkText}>Password</Text>
                <TextInput
                    style={globalStyles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />
                <ErrorMessage message={errorMessage} />
                <TouchableOpacity style={globalStyles.button} onPress={handleCreateAccount}>
                    <Text style={globalStyles.buttonText}>Create Account</Text>
                </TouchableOpacity>
                <Text style={globalStyles.promptText}>Already have an account?</Text>
                <Text style={globalStyles.linkText} onPress={() => navigation.navigate("Sign In")}>Sign in.</Text>
            </View>
        </SignupBackground>
    );
}

export default CreateAccountPage;
