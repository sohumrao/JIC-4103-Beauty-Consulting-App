import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Input} from 'react-native';
import { Link, useNavigation } from '@react-navigation/native';
import { UserContext } from '../App';
import SignupBackground  from '../assets/components/SignupBackground';
import globalStyles from '../assets/GlobalStyles';
import KeyboardAvoidingInput from '../assets/components/KeyboardAvoidingInput';
import  axios  from 'axios';

const ProfileView = () => {
    const userContext = useContext(UserContext);
    var [name ,setName] = useState('');
    var [age, setAge] = useState('');
    var [gender, setGender] = useState('');
    var [phoneNumber, setPhoneNumber] = useState('');
    var [allergies, setAllergies] = useState('');
    var [concerns, setConcerns] = useState('');
    var [isEdit, setIsEdit] = useState(false);

    const handleEdit = async () => {
        if (isEdit) {
            // prevent clearing data if no edits are made
            /*
            name = name == '' ? userContext.name : name;
            gender = gender == '' ? userContext.gender : gender;
            concerns = concerns == '' ? userContext.concerns : concerns;
            allergies = allergies == '' ? userContext.allergies : allergies;
            age = userContext.age;
            phoneNumber = userContext.phoneNumber;
            */

            // send request
            req = {
                username: userContext.username,
                name: name,
                age: age,
                gender: gender,
                phoneNumber: phoneNumber,
                email: userContext.email,
                hairDetails: userContext.hairDetails,
                allergies: allergies,
                concerns: concerns,
            };

            // backend call goes here
        }
        setIsEdit(!isEdit);
    };

    const deleteAccount = async () => {
        //handle
    }

    const styles = StyleSheet.create({
        inputContainer: {
            marginBottom: 10
        },
    });

    return (
        <SignupBackground>
            <View style={globalStyles.box}>
                <KeyboardAvoidingInput>

                    <View style={styles.inputContainer}>
                        <Text style={globalStyles.inputHeaderText}>Name</Text>
                        <TextInput 
                            style= { globalStyles.input }
                            placeholder = { userContext.name}
                            placeholderTextColor={'#000'}
                            value = { name }
                            onChangeText={ setName }
                            editable= { isEdit }
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={globalStyles.inputHeaderText}>Gender</Text>
                        <TextInput 
                            style= { globalStyles.input }
                            placeholder = { userContext.gender}
                            placeholderTextColor={'#000'}
                            value = { gender }
                            onChangeText = { setGender }
                            editable= { isEdit }
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={globalStyles.inputHeaderText}>Allergies</Text>
                        <TextInput 
                            style= { globalStyles.input }
                            placeholder = { userContext.allergies}
                            placeholderTextColor={'#000'}
                            value = { allergies }
                            onChangeText = { setAllergies }
                            editable= { isEdit }
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={globalStyles.inputHeaderText}>Concerns</Text>
                        <TextInput 
                            style= { globalStyles.input }
                            placeholder = { userContext.concerns}
                            placeholderTextColor={'#000'}
                            value = { concerns }
                            onChangeText = { setConcerns }
                            editable= { isEdit }
                        />
                    </View>

                </KeyboardAvoidingInput>

                <TouchableOpacity style={[globalStyles.button, {marginBottom: 15}]} onPress={handleEdit}>
                    <Text style={globalStyles.buttonText}>{isEdit ? 'Update' : 'Edit'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={globalStyles.button} onPress={deleteAccount}>
                    <Text style={globalStyles.buttonText}>Delete Account</Text>
                </TouchableOpacity>

            </View>
        </SignupBackground>
    );
}

export default ProfileView;
