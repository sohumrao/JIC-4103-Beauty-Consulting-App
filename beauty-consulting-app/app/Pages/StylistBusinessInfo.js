import React, { useState } from 'react';
import { View, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const StylistBusinessInfo = () => {
  const [profileImage, setProfileImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stylist Business Info</Text>
      {profileImage && <Image source={{ uri: profileImage }} style={styles.image} />}
      <Button title="Change Profile Image" onPress={pickImage} />
      <Text style={styles.info}>Business Name: Glamour Salon</Text>
      <Text style={styles.info}>Contact: (123) 456-7890</Text>
      <Text style={styles.info}>Email: info@glamoursalon.com</Text>
      <Text style={styles.description}>
        Welcome to Glamour Salon! We offer a variety of beauty services to help you look and feel your best.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default StylistBusinessInfo;