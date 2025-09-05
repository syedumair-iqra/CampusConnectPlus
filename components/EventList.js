import React from 'react';
import { View } from 'react-native';
import EventCard from './EventCard';

const EventList = ({ events, navigation }) => (
  <View>
    {events.map(event => (
      <EventCard key={event.id} event={event} navigation={navigation} />
    ))}
  </View>
);

export default EventList;
