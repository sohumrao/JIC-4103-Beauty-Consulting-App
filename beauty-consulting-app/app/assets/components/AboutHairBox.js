import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HairIcon from '../images/hair-icon.svg';
import Comb from '../images/comb.svg';
import Allergies from '../images/allergies.svg';
import Concerns from '../images/concerns.svg';

const HairDetailsBox = ({ hairDetails, allergies, concerns }) => {
  return (
    <View>
      <Text style={styles.title}>My Hair</Text>
      <View style={styles.container}>
        <View style={styles.infoRow}>
        <HairIcon width={20} height={20} style={styles.icon}/>
          <Text style={styles.label}>Hair Type:</Text>
          <Text style={styles.value}>{hairDetails.type}</Text>
        </View>
        <View style={styles.infoRow}>
          <Comb width={20} height={20} style={styles.icon}/>
          <Text style={styles.label}>Texture:</Text>
          <Text style={styles.value}>{hairDetails.texture}</Text>
        </View>
        <View style={styles.infoRow}>
          <Allergies width={20} height={20} style={styles.icon}/>
          <Text style={styles.label}>Allergies:</Text>
          <Text
            style={styles.value}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {allergies}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Concerns width={20} height={20} style={styles.icon}/>
          <Text style={styles.label}>Concerns:</Text>
          <Text
            style={styles.value}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {concerns}
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

export default HairDetailsBox;
