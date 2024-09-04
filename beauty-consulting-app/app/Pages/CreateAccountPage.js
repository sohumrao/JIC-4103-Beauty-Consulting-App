import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Link, useNavigation } from '@react-navigation/native';

const CreateAccountPage = () => {
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

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
    signInLink: {
        textAlign: 'center',
        marginTop: 10,
        color: '#FF5252'
    }
});
    const handleCreateAccount = () => {
        navigation.navigate("LandingPage");
    }

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.title}>Create Your Account</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    value={emailAddress}
                    onChangeText={setEmailAddress}
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
                <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
                    <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>
                <Text style={styles.needAccountText}>Already have an account?</Text>
                <Text style={styles.signInLink} onPress={() => {navigation.navigate("Sign In")}}>Sign in.</Text>
            </View>
        </View>
    );
}

export default CreateAccountPage;