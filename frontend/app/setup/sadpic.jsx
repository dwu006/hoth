import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Text, Alert } from 'react-native';
import { router } from 'expo-router';
import { CameraView } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SadPicture() {
  const [photo, setPhoto] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [facing, setFacing] = useState('front');
  const [showCamera, setShowCamera] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef(null);

  const pickImage = async () => {
    try {
      setShowCamera(false);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled) {
        setPhoto({ uri: result.assets[0].uri, base64: result.assets[0].base64 });
      } else {
        setShowCamera(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setShowCamera(true);
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current || !cameraReady) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
        base64: true,
      });
      setPhoto(photo);
    } catch (error) {
      console.error('Failed to take picture:', error);
    }
  };

  const handleDone = async () => {
    if (!photo) {
      Alert.alert('Error', 'Please take or select a sad picture');
      return;
    }

    try {
      setIsLoading(true);
      
      // Store the sad picture in AsyncStorage
      await AsyncStorage.setItem('sadPicture', photo.base64);
      
      console.log('Sad picture saved successfully');
      
      // Save all user data to MongoDB (in a real app)
      // For now, we'll simulate this by logging to console
      await saveUserDataToMongoDB();
      
      // Navigate to events page with the updated path
      router.replace('/events/events');
    } catch (error) {
      console.error('Error saving sad picture:', error);
      Alert.alert('Error', 'Failed to save sad picture. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate saving user data to MongoDB
  const saveUserDataToMongoDB = async () => {
    try {
      // In a real app, this would be an API call to your backend
      const username = await AsyncStorage.getItem('username');
      const tagId = await AsyncStorage.getItem('tagId');
      const profilePicture = await AsyncStorage.getItem('profilePicture');
      const sadPicture = await AsyncStorage.getItem('sadPicture');
      
      console.log('Saving user data to MongoDB:');
      console.log('- Username:', username);
      console.log('- Tag ID:', tagId);
      console.log('- Profile Picture:', profilePicture ? 'Set' : 'Not set');
      console.log('- Sad Picture:', sadPicture ? 'Set' : 'Not set');
      
      // Simulate a delay for the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Error saving to MongoDB:', error);
      throw error;
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    setShowCamera(true);
  };

  const toggleCamera = () => {
    setFacing(current => current === 'front' ? 'back' : 'front');
  };

  if (photo) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <Image source={{ uri: photo.uri }} style={styles.preview} />
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Saving sad picture...</Text>
          </View>
        ) : (
          <View style={styles.previewControls}>
            <TouchableOpacity 
              style={styles.previewButton} 
              onPress={retakePhoto}
            >
              <Icon name="refresh-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.previewButton, styles.doneButton]} 
              onPress={handleDone}
            >
              <Icon name="checkmark" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {showCamera && (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          onCameraReady={() => setCameraReady(true)}
        >
          <View style={styles.overlay}>
            <Text style={styles.instructionText}>
              Take a picture of your sad face
            </Text>
            <View style={styles.controls}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={toggleCamera}
              >
                <Icon name="camera-reverse-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.captureButton}
                onPress={takePicture}
                disabled={!cameraReady}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.controlButton}
                onPress={pickImage}
              >
                <Icon name="images-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    padding: 4,
  },
  captureButtonInner: {
    flex: 1,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  previewControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  previewButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
  },
});