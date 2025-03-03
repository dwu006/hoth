import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Username() {
  const [username, setUsername] = useState('');
  const [tagId, setTagId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Generate a random 7-digit tag ID
    const randomTagId = Math.floor(1000000 + Math.random() * 9000000).toString();
    setTagId(randomTagId);
  }, []);

  const isValidUsername = (username) => {
    return username.length >= 3 && username.length <= 30;
  };

  const handleNext = async () => {
    if (isValidUsername(username)) {
      try {
        // Store username and tagId in AsyncStorage
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('tagId', tagId);
        
        // Hard-coded for now - in a real app, we'd send this to the backend
        console.log('Username set:', username);
        console.log('Tag ID set:', tagId);
        
        // Navigate to profile picture setup
        router.replace('/setup/pfp');
      } catch (error) {
        console.error('Error saving username:', error);
        Alert.alert('Error', 'Failed to save username. Please try again.');
      }
    } else {
      setError('Username must be between 3 and 30 characters');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Text style={styles.title}>Enter your username</Text>
        <Text style={styles.subtitle}>This is how other users will see you</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Enter username"
          placeholderTextColor="#666666"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            setError(''); // Clear error when typing
          }}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={30}
        />
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        {username.length > 0 && (
          <View style={styles.tagContainer}>
            <Text style={styles.tagLabel}>Your unique tag ID:</Text>
            <Text style={styles.tagId}>{tagId}</Text>
            <Text style={styles.tagInfo}>This will be your unique identifier</Text>
          </View>
        )}
      </View>

      <TouchableOpacity 
        style={[
          styles.checkButton,
          !username.trim() && styles.buttonDisabled
        ]}
        onPress={handleNext}
        disabled={!username.trim()}
      >
        <Icon name="checkmark" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666666',
    fontSize: 16,
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  error: {
    color: '#FF4444',
    fontSize: 14,
    marginBottom: 16,
  },
  tagContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    alignItems: 'center',
  },
  tagLabel: {
    color: '#AAAAAA',
    fontSize: 14,
    marginBottom: 8,
  },
  tagId: {
    color: '#4CAF50',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  tagInfo: {
    color: '#888888',
    fontSize: 12,
  },
  checkButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});