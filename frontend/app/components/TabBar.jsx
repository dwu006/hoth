import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const TabBar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const tabs = [
    {
      name: 'Feed',
      icon: 'home',
      route: 'Feed'
    },
    {
      name: 'Capture',
      icon: 'camera',
      route: 'Capture'
    },
    {
      name: 'Profile',
      icon: 'person',
      route: 'Profile'
    }
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = route.name === tab.route;
        
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => navigation.navigate(tab.route)}
          >
            <Icon
              name={tab.icon}
              size={24}
              color={isActive ? '#FFFFFF' : '#666666'}
            />
            <Text style={[
              styles.label,
              { color: isActive ? '#FFFFFF' : '#666666' }
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#333333',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  }
});

export default TabBar;
