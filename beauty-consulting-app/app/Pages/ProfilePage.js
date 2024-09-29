import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../App';
import SignupBackground from '../assets/components/SignupBackground';
import globalStyles from '../assets/GlobalStyles';

function ProfilePage() {
    const userContext = useContext(UserContext);
    const navigation = useNavigation();

    const profileView = () => {
        navigation.navigate("ProfileView");
    };

    return (
        <SignupBackground>
            <View style={globalStyles.box}>
                <Text>API Request Successful! User added to database</Text>
                <Text>Name: {userContext.name}</Text>
                <Text>Age: {userContext.age}</Text>
                <Text>Email: {userContext.email}</Text>
                <Text>Gender: {userContext.gender}</Text>
                <Text>Phone Number: {userContext.phoneNumber}</Text>
                <Text>Allergies: {userContext.allergies}</Text>
                <TouchableOpacity style={globalStyles.button} onPress={profileView}>
                    <Text style={globalStyles.buttonText}>ProfileView</Text>
                </TouchableOpacity>
            </View>
        </SignupBackground>
    );
}

export default ProfilePage;
