import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

export default function EventCard({ event, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <ImageBackground source={{ uri: event.image }} style={styles.image}>
        <View style={styles.overlay}>
          <Text style={styles.title}>{event.title}</Text>
        </View>
      </ImageBackground>
      <Text style={styles.badge}>{event.category}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: '#fff',
  },
  image: {
    height: 180,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  badge: {
    backgroundColor: '#FF9500',
    color: '#fff',
    fontSize: 12,
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 20,
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 10,
  }
});
