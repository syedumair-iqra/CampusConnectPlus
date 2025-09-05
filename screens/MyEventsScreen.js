import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyEventsScreen({ navigation }) {
  const [registeredEvents, setRegisteredEvents] = useState([]);

  useEffect(() => {
    const loadRegistered = async () => {
      const data = await AsyncStorage.getItem('registeredEvents');
      if (data) setRegisteredEvents(JSON.parse(data));
    };

    const unsubscribe = navigation.addListener('focus', loadRegistered);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('EventDetails', { event: item })}>
      <ImageBackground source={{ uri: item.image }} style={styles.card}>
        <View style={styles.overlay}>
          <Text style={styles.eventTitle}>{item.title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Registered Events</Text>
      {registeredEvents.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 30 }}>No events registered yet.</Text>
      ) : (
        <FlatList data={registeredEvents} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  card: { height: 180, borderRadius: 10, overflow: 'hidden', marginBottom: 16 },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  eventTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
});
