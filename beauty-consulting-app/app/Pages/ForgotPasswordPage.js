import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import SignupBackground from '../assets/components/SignupBackground';
import globalStyles from '../assets/GlobalStyles';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [sentEmail, setSentEmail] = useState(false);

    const handleForgotPassword = async () => {
        setSentEmail(true);
    };

    return (
        <SignupBackground>
            <View style={globalStyles.box}>
                <Text style={globalStyles.title}>Reset Password</Text>
                { sentEmail ? (
                    <Text style={globalStyles.description}>
                        An email with a link to reset your password has been sent to {email}.
                    </Text>
                ) : (
                    <>
                        <Text style={globalStyles.description}>
                            Enter the email associated with your account to reset your password.
                        </Text>
                        <TextInput
                            style={globalStyles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TouchableOpacity style={globalStyles.button} onPress={handleForgotPassword}>
                            <Text style={globalStyles.buttonText}>Send Email</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </SignupBackground>
    );
}

export default ForgotPasswordPage;
