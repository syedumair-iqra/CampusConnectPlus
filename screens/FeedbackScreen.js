import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FeedbackScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const submitFeedback = async () => {
    const feedback = { eventId, rating, comment };
    const stored = await AsyncStorage.getItem('feedbacks');
    const allFeedbacks = stored ? JSON.parse(stored) : [];
    allFeedbacks.push(feedback);
    await AsyncStorage.setItem('feedbacks', JSON.stringify(allFeedbacks));
    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Rate the event (1-5):</Text>
      <TextInput keyboardType="numeric" value={rating} onChangeText={setRating} />
      <Text>Leave a comment:</Text>
      <TextInput multiline value={comment} onChangeText={setComment} />
      <Button title="Submit" onPress={submitFeedback} />
    </View>
  );
};

export default FeedbackScreen;
