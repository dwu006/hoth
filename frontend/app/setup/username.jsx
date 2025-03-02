import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Username() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const isValidUsername = (username) => {
    return username.length >= 3 && username.length <= 30;
  };

  const handleNext = () => {
    if (isValidUsername(username)) {
      // TODO: Save username to backend
      router.replace('/setup/pfp');
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
