import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import SignupBackground from '../assets/components/SignupBackground';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [sentEmail, setSentEmail] = useState(false);

    const styles = StyleSheet.create({
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
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 8,
        marginBottom: 10,
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
});

    const handleForgotPassword = async () => {
        setSentEmail(true);
    }

    return (
        <SignupBackground>
            <View style={styles.box}>
                <Text style={styles.title}>Reset Password</Text>
                { sentEmail ?
                    <Text style={styles.description}>An email with a link to reset your password has been sent to {email}.</Text>
                    :
                    <>
                    <Text style={styles.description}>Enter the email associated with your account to reset your password.</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
                        <Text style={styles.buttonText}>Send Email</Text>
                    </TouchableOpacity>
                    </>
                }

            </View>
        </SignupBackground>
    );
}

export default ForgotPasswordPage;