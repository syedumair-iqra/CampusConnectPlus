import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { events as defaultEvents } from '../utils/api';

export default function HomeScreen() {
  const [events, setEvents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', description: '', image: '' });

  const navigation = useNavigation();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const stored = await AsyncStorage.getItem('customEvents');
    const customEvents = stored ? JSON.parse(stored) : [];
    setEvents([...defaultEvents, ...customEvents]);
  };

  const addNewEvent = async () => {
    const id = Date.now().toString();
    const eventToAdd = { ...newEvent, id };
    const stored = await AsyncStorage.getItem('customEvents');
    const customEvents = stored ? JSON.parse(stored) : [];
    const updated = [...customEvents, eventToAdd];
    await AsyncStorage.setItem('customEvents', JSON.stringify(updated));
    setNewEvent({ title: '', date: '', description: '', image: '' });
    setModalVisible(false);
    loadEvents();
  };

  const filteredEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes(searchText.toLowerCase()) ||
      e.venue?.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('EventDetails', { event: item })}>
      <ImageBackground source={{ uri: item.image }} style={styles.card} imageStyle={{ borderRadius: 10 }}>
        <View style={styles.overlay}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        <Text style={{ color: '#000' }}>Campus</Text>
        <Text style={{ color: '#007BFF' }}>Connect+</Text>
      </Text>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search events..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Add Event Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add-circle-outline" size={26} color="#007BFF" />
        <Text style={styles.addButtonText}>Add Event</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredEvents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Modal for Adding Event */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Create New Event</Text>

            {['title', 'date', 'description', 'image'].map((field) => (
              <TextInput
                key={field}
                placeholder={`Enter ${field}`}
                value={newEvent[field]}
                onChangeText={(text) => setNewEvent({ ...newEvent, [field]: text })}
                style={styles.modalInput}
              />
            ))}

            <Pressable style={styles.saveButton} onPress={addNewEvent}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>

            <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 40 },
  heading: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#007BFF',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    height: 160,
    borderRadius: 10,
    marginBottom: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 13,
  },
});
