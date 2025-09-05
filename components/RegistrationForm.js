// RegistrationForm.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';

const RegistrationForm = ({ eventId }) => {
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = async () => {
    try {
      const key = `registration-${eventId}`;
      await AsyncStorage.setItem(key, 'true');
      setIsRegistered(true);
      Alert.alert('Registered Successfully!');
    } catch (error) {
      console.error('Registration Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {isRegistered ? (
        <View style={styles.qrSection}>
          <Text style={styles.successText}>You are registered!</Text>
          <QRCode value={`event-${eventId}`} size={150} />
        </View>
      ) : (
        <Button title="Register for Event" onPress={handleRegister} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  qrSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  successText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

export default RegistrationForm;
