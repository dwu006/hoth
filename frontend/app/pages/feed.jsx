import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Feed() {
  const [activeTab, setActiveTab] = useState('friends');

  const goToFriends = () => {
    router.push('/friends/friends');
  };

  const goToAddFriend = () => {
    router.push('/friends/addfriend');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: false,
          gestureEnabled: false,
        }} 
      />
      <View style={styles.header}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={goToFriends} style={styles.iconButton}>
            <Icon name="people-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>RollCall</Text>
          <TouchableOpacity onPress={goToAddFriend} style={styles.iconButton}>
            <Icon name="person-add-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={styles.tabButton} 
            onPress={() => setActiveTab('friends')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'friends' && styles.activeTabText
            ]}>
              Friends
            </Text>
            {activeTab === 'friends' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.tabButton}
            disabled={true}
          >
            <Text style={[styles.tabText, styles.comingSoonText]}>
              Community
              <Text style={styles.comingSoonLabel}> (Coming Soon!)</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>Feed Page</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 50,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 30,
    justifyContent: 'center',
    gap: 30,
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 8,
    minWidth: 80,
  },
  tabText: {
    color: '#999999',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 24,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  comingSoonText: {
    color: '#666666',
  },
  comingSoonLabel: {
    fontSize: 12,
    color: '#666666',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});