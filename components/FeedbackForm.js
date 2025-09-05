import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FeedbackForm({ onSubmit }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() !== '') {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Write your feedback..."
        value={text}
        onChangeText={setText}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleSend} style={styles.iconButton}>
        <Ionicons name="send" size={22} color="#007BFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
  },
  iconButton: {
    paddingLeft: 8,
  },
});
