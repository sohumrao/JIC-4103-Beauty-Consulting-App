import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Link, useNavigation } from '@react-navigation/native';
import { UserContext } from '../App';

const ProfileView = () => {
    //const userContext = useContext(UserContext);
    const  [isEdit, setIsEdit] = useState(false);

    const styles = StyleSheet.create({
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'fff'
        },

        input: {
            height: 40,
            width: 120,
            bordercolor: '#ccc',
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10,
            marginBottom: 15,
            marginRight: 10,
            color: "000",
        },

        button: {
            height: 40,
            justifyContent: 'center',
            backgroundColor: "#FF5252",
            borderRadius: 10,
        },

        buttonText: {
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
        },
    });

    const handleEdit = () => {
        setIsEdit(!isEdit);
    };

    return (
        //a bunch of placeholders rn
       <View style={styles.container}>
            <TextInput 
                style={styles.input}
                value={"user id"} //should display user id
                // add on change text handling
                editable={isEdit}
                keyboardType='email-address'
                autoCapitalize='none'
            />
            <TextInput
                style={styles.input}
                value={"this is proof of concept"}
                editable={isEdit}
            />
            <TouchableOpacity style={styles.button} onPress={handleEdit}>
                <Text style={styles.buttonText}>{isEdit ? 'Update' : 'Edit'}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default ProfileView;