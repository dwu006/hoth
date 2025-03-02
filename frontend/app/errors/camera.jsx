import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Ionicons';

export default function CameraError() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Icon name="camera-off-outline" size={80} color="#FFFFFF" />
      <Text style={styles.title}>Camera Access Needed</Text>
      <Text style={styles.subtitle}>
        Please allow camera access in your device settings to continue using RollCall
      </Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#333333',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
