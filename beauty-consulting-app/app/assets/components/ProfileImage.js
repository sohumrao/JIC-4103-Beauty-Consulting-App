import React, { useState, useContext} from 'react';
import { View, Button, Image, Alert } from 'react-native';
import { UserContext } from '../../App';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const ProfileImage = () => {
  const [imageUri, setImageUri] = useState(null);

  const userContext = useContext(UserContext);

  const pickImage = async () => {
    // const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // if (permissionResult.granted === false) {
    //   Alert.alert("Error");
    //   return;
    // }
    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [1, 1],
    //   quality: 1,
    // });
    // if (!result.canceled) {
    //   setImageUri(result.assets[0].uri);
    // }

    const formData = new FormData();
    // Append the username and file to the FormData
    const username = userContext.username
    formData.append('username', username);
    formData.append('photo', imageUri);
  
    try {
      // Make the POST request
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      if (!apiUrl) {
          console.error("API URL not defined");
          return;
      }
      const res1 = await axios.post(apiUrl + ':5050/account/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      console.log('Upload successful:', response.data);

      const res2 = await axios.get(apiUrl + ':5050/account/${username}/photo');
      setImageUri(res2.data)
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
    
  };

//to do: send imageUri to backend
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center'}}>
      <Button title="Picture Test" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, borderRadius: 100, marginTop: 20 }} />}
    </View>
  );
};

export default ProfileImage;