import React from 'react';
import { TextInput, View } from 'react-native';

const SearchFilter = ({ query, setQuery }) => (
  <View style={{ padding: 10 }}>
    <TextInput
      placeholder="Search by name or venue"
      value={query}
      onChangeText={setQuery}
      style={{ padding: 10, backgroundColor: '#fff', borderRadius: 8 }}
    />
  </View>
);

export default SearchFilter;
