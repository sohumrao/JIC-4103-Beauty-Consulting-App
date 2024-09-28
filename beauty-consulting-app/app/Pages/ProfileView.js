import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../assets/GlobalStyles';

const ProfileView = () => {
    const [isEdit, setIsEdit] = useState(false);

    const handleEdit = () => {
        setIsEdit(!isEdit);
    };

    return (
        <View style={globalStyles.container}>
            <TextInput 
                style={globalStyles.input}
                value={"user id"} // should display user id
                editable={isEdit}
                keyboardType='email-address'
                autoCapitalize='none'
            />
            <TextInput
                style={globalStyles.input}
                value={"this is proof of concept"}
                editable={isEdit}
            />
            <TouchableOpacity style={globalStyles.button} onPress={handleEdit}>
                <Text style={globalStyles.buttonText}>{isEdit ? 'Update' : 'Edit'}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default ProfileView;
