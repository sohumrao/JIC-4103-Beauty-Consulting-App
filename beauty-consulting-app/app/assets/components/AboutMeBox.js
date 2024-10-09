import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PhoneIcon from '../images/phone-call.svg';
import AgeIcon from '../images/birthday-cake.svg';
import EmailIcon from '../images/email.svg';
import GenderIcon from '../images/genders.svg';

const AboutMeBox = ({ age, phoneNumber, gender, email }) => {
  return (
    <View>
      <Text style={styles.title}>About Me</Text>
      <View style={styles.container}>
        <View style={styles.infoRow}>
          <AgeIcon width={20} height={20} style={styles.icon} />
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{age}</Text>
        </View>
        <View style={styles.infoRow}>
          <PhoneIcon width={20} height={20} style={styles.icon} />
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{phoneNumber}</Text>
        </View>
        <View style={styles.infoRow}>
          <GenderIcon width={20} height={20} style={styles.icon} />
          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{gender}</Text>
        </View>
        <View style={styles.infoRow}>
          <EmailIcon width={20} height={20} style={styles.icon} />
          <Text style={styles.label}>Email:</Text>
          <Text
            style={styles.value}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {email}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 20,
    width: '30%',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    width: '55%',
    flexGrow: 1,
    textAlign: 'right',
  },
  icon: {
    marginRight: 10,
  }
});

export default AboutMeBox;
