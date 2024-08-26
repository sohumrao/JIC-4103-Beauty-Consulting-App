import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../App';


function ProfilePage() {
    const userContext = useContext(UserContext);

    const navigation = useNavigation();

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
            <Text>API Request Successful! User added to database</Text>
            <Text>Name: {userContext.name}</Text>
            <Text>Age: {userContext.age}</Text>
            <Text>Email: {userContext.email}</Text>
            <Text>Gender: {userContext.gender}</Text>
            <Text>Phone Number: {userContext.phoneNumber}</Text>
            <Text>Allergies: {userContext.allergies}</Text>
        </View>
    );
}

export default ProfilePage;