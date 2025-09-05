import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventCard from './EventCard';

const AIRecommender = ({ events, navigation }) => {
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await AsyncStorage.getItem('registrations');
      const regIds = data ? JSON.parse(data) : [];
      const categories = events
        .filter(e => regIds.includes(e.id))
        .map(e => e.category);

      const freq = {};
      categories.forEach(c => (freq[c] = (freq[c] || 0) + 1));

      const topCategory = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0];

      if (topCategory) {
        setRecommended(events.filter(e => e.category === topCategory));
      }
    };
    load();
  }, [events]);

  if (recommended.length === 0) return null;

  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Recommended for You</Text>
      {recommended.map(event => (
        <EventCard key={event.id} event={event} navigation={navigation} />
      ))}
    </View>
  );
};

export default AIRecommender;
