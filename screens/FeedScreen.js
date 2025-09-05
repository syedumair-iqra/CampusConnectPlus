import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { events } from '../utils/api';
import { Ionicons } from '@expo/vector-icons';

export default function FeedScreen() {
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const likeData = await AsyncStorage.getItem('likes');
      const commentData = await AsyncStorage.getItem('comments');
      if (likeData) setLikes(JSON.parse(likeData));
      if (commentData) setComments(JSON.parse(commentData));
    };
    loadData();
  }, []);

  const toggleLike = async (eventId) => {
    const updated = { ...likes, [eventId]: !likes[eventId] };
    setLikes(updated);
    await AsyncStorage.setItem('likes', JSON.stringify(updated));
  };

  const addComment = async (eventId) => {
    if (!newComment.trim()) return;
    const updated = {
      ...comments,
      [eventId]: [...(comments[eventId] || []), newComment.trim()],
    };
    setComments(updated);
    setNewComment('');
    await AsyncStorage.setItem('comments', JSON.stringify(updated));
  };

  const renderItem = ({ item }) => (
    <View style={styles.post}>
      <ImageBackground source={{ uri: item.image }} style={styles.image}>
        <View style={styles.overlay}>
          <Text style={styles.postTitle}>{item.title}</Text>
        </View>
      </ImageBackground>
      <View style={styles.postBody}>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => toggleLike(item.id)}>
            <Ionicons
              name={likes[item.id] ? 'heart' : 'heart-outline'}
              size={24}
              color={likes[item.id] ? 'red' : 'gray'}
            />
          </TouchableOpacity>
          <Text style={{ marginLeft: 8 }}>
            {likes[item.id] ? 'You liked this' : ''}
          </Text>
        </View>

        <View style={styles.commentSection}>
          <FlatList
            data={comments[item.id] || []}
            keyExtractor={(c, idx) => idx.toString()}
            renderItem={({ item: comment }) => (
              <Text style={styles.comment}>💬 {comment}</Text>
            )}
          />
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Add a comment"
              value={newComment}
              onChangeText={setNewComment}
              style={styles.input}
            />
            <TouchableOpacity onPress={() => addComment(item.id)}>
              <Ionicons name="send" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
}

const styles = StyleSheet.create({
  post: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    height: 180,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
  },
  postTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  postBody: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  commentSection: {
    marginTop: 5,
  },
  comment: {
    fontSize: 14,
    color: '#444',
    marginBottom: 3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    paddingVertical: 4,
  },
});
