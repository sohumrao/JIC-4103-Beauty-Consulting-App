import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { UserContext, userContextProvider } from '../contexts/userContext';
import ProfileImage from '../assets/components/ProfileImage';
import axios from 'axios';


const BusinessInfoPage = () => {
  // Access the user context
  const userContext = useContext(UserContext);

  const { name, age, phoneNumber, email, stylistDetails } = userContext;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{stylistDetails.businessName}</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Stylist Name:</Text>
        <Text style={styles.value}>{name}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Business Address:</Text>
        <Text style={styles.value}>{stylistDetails.businessAddress}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Age:</Text>
        <Text style={styles.value}>{age}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Phone Number:</Text>
        <Text style={styles.value}>{phoneNumber}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{email}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Years of Experience:</Text>
        <Text style={styles.value}>{stylistDetails.experience}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Specialty:</Text>
        <Text style={styles.value}>{stylistDetails.specialty}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Additional Info:</Text>
        <Text style={styles.value}>{stylistDetails.additionalInfo}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
});

export default BusinessInfoPage;


