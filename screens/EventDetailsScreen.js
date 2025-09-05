import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import FeedbackForm from '../components/FeedbackForm';
import { events } from '../utils/api';

export default function EventDetailsScreen({ route }) {
  const { event } = route.params;
  const [feedbacks, setFeedbacks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    loadFeedbacks();
    checkRegistration();
  }, []);

  const loadFeedbacks = async () => {
    const data = await AsyncStorage.getItem(`feedbacks_${event.id}`);
    if (data) setFeedbacks(JSON.parse(data));
  };

  const saveFeedbacks = async (updated) => {
    await AsyncStorage.setItem(`feedbacks_${event.id}`, JSON.stringify(updated));
    setFeedbacks(updated);
  };

  const addFeedback = async (text) => {
    const updated = [...feedbacks, text];
    await saveFeedbacks(updated);
  };

  const deleteFeedback = async (index) => {
    const updated = [...feedbacks];
    updated.splice(index, 1);
    await saveFeedbacks(updated);
  };

  const editFeedback = async (index) => {
    const currentText = feedbacks[index];
    if (Platform.OS === 'web') {
      const updatedText = prompt('Edit your feedback:', currentText);
      if (updatedText) {
        const updated = [...feedbacks];
        updated[index] = updatedText;
        await saveFeedbacks(updated);
      }
    } else {
      Alert.prompt(
        'Edit Feedback',
        'Update your feedback message',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Save',
            onPress: async (text) => {
              if (text) {
                const updated = [...feedbacks];
                updated[index] = text;
                await saveFeedbacks(updated);
              }
            },
          },
        ],
        'plain-text',
        currentText
      );
    }
  };

  const handleFeedbackLongPress = (index) => {
    Alert.alert('Manage Feedback', 'Choose an option:', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Edit', onPress: () => editFeedback(index) },
      { text: 'Delete', onPress: () => deleteFeedback(index), style: 'destructive' },
    ]);
  };

  const registerEvent = async () => {
    await AsyncStorage.setItem(`registered_${event.id}`, 'true');
    const saved = await AsyncStorage.getItem('registeredEvents');
    let registeredList = saved ? JSON.parse(saved) : [];
    const alreadyAdded = registeredList.find((e) => e.id === event.id);
    if (!alreadyAdded) {
      registeredList.push(event);
      await AsyncStorage.setItem('registeredEvents', JSON.stringify(registeredList));
    }
    setIsRegistered(true);
    Alert.alert('Registered!', 'You have successfully registered for this event.');
  };

  const checkRegistration = async () => {
    const reg = await AsyncStorage.getItem(`registered_${event.id}`);
    setIsRegistered(reg === 'true');
  };

  const handleQRCodePress = () => {
    if (!isRegistered) {
      Alert.alert('Not Registered', 'Please register first to view the QR code.');
    } else {
      setShowModal(true);
    }
  };

  // Recommendations: fallback to all events if no match
  let recommended = events.filter(
    (e) =>
      e.id !== event.id &&
      e.title.toLowerCase().includes(event.title.split(' ')[0].toLowerCase())
  );
  if (recommended.length === 0) {
    recommended = events.filter((e) => e.id !== event.id);
  }

  return (
    <ScrollView style={styles.container}>
      <ImageBackground source={{ uri: event.image }} style={styles.image}>
        <View style={styles.overlay}>
          <Text style={styles.title}>{event.title}</Text>
        </View>
      </ImageBackground>

      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.text}>{event.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Date</Text>
        <Text style={styles.text}>{event.date}</Text>
      </View>

      {/* REGISTER + QR BUTTONS */}
      <View style={styles.section}>
  <TouchableOpacity
    style={styles.mainButton}
    onPress={isRegistered ? handleQRCodePress : registerEvent}
  >
    <Text style={styles.buttonText}>
      {isRegistered ? 'Show QR Code' : 'Register for Event'}
    </Text>
  </TouchableOpacity>
</View>

      {/* QR Code Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Your QR Code</Text>
            <QRCode value={`Event:${event.id}`} size={160} />
            <Pressable onPress={() => setShowModal(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* FEEDBACK SECTION */}
      <View style={styles.section}>
        <Text style={styles.label}>Leave Feedback</Text>
        <FeedbackForm onSubmit={addFeedback} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Feedbacks</Text>
        {feedbacks.length === 0 ? (
          <Text style={styles.text}>No feedback yet.</Text>
        ) : (
          feedbacks.map((fb, idx) => (
            <TouchableOpacity
              key={idx}
              onLongPress={() => handleFeedbackLongPress(idx)}
              style={styles.feedbackBox}
            >
              <Text style={styles.feedbackText}>• {fb}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* RECOMMENDATIONS */}
      <View style={styles.section}>
        <Text style={styles.label}>Recommended Events</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recommended.map((rec) => (
            <ImageBackground
              key={rec.id}
              source={{ uri: rec.image }}
              style={styles.recommend}
              imageStyle={{ borderRadius: 10 }}
            >
              <View style={styles.overlaySmall}>
                <Text style={styles.recommendText}>{rec.title}</Text>
              </View>
            </ImageBackground>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff' },
  image: { height: 220 },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
    justifyContent: 'flex-end',
    height: '100%',
  },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  text: {
    fontSize: 14,
    color: '#444',
  },
  mainButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  feedbackBox: {
    backgroundColor: '#f3f3f3',
    padding: 10,
    marginVertical: 5,
    borderRadius: 6,
  },
  feedbackText: {
    fontSize: 14,
    color: '#333',
  },
  recommend: {
    width: 160,
    height: 100,
    marginRight: 10,
    marginTop: 10,
  },
  overlaySmall: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  recommendText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
    width: 250,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
