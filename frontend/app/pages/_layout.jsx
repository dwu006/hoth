import React from 'react';
import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'feed':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'capture':
              iconName = focused ? 'camera' : 'camera-outline';
              break;
            case 'profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#333333',
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#666666',
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tabs.Screen name="feed" />
      <Tabs.Screen name="capture" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}