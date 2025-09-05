import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import EventDetailsScreen from './screens/EventDetailsScreen';
import MyEventsScreen from './screens/MyEventsScreen';
import FeedScreen from './screens/FeedScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AllEvents" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
  let iconName;
  if (route.name === 'Home') iconName = focused ? 'calendar' : 'calendar-outline';
  else if (route.name === 'My Events') iconName = focused ? 'bookmark' : 'bookmark-outline';
  else if (route.name === 'Feed') iconName = focused ? 'newspaper' : 'newspaper-outline';
  else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
  return <Ionicons name={iconName} size={size} color={color} />;
},
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="My Events" component={MyEventsScreen} />
        <Tab.Screen name="Feed" component={FeedScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
