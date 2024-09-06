import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Link, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { UserContext } from '../App';

const SignInPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const userContext = useContext(UserContext);

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    box: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#FF5252',
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    needAccountText: {
        textAlign: 'center',
        marginTop: 20
    },
    createAccountLink: {
        textAlign: 'center',
        marginTop: 10,
        color: '#FF5252'
    }
});

    const handleSignIn = async () => {
        req = {
                username: username,
                password: password
        };
        console.log(req.body);
        try {
            apiUrl = process.env.EXPO_PUBLIC_API_URL;
            if (!apiUrl) {
                console.error("API URL not defined");
                return;
            }
            const res = await axios.post(apiUrl + ':5050/record/signIn', req);
            console.log("Sign in successful: " + res.data.username);
        } catch (error) {
            console.error('Error with Sign In: ', error.response.data);
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
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.title}>Sign In</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
                <Text style={styles.needAccountText}>Dont have an account?</Text>
                <Text style={styles.createAccountLink} onPress={() => {navigation.navigate("Create Account")}}>Create one.</Text>
            </View>
        </View>
    );
}

export default SignInPage;