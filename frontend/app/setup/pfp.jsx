import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Animated, Dimensions, Alert } from 'react-native';
import { router } from 'expo-router';
import { CameraView } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Svg, Circle, Rect } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CIRCLE_RADIUS = 180;
const window = Dimensions.get('window');

export default function ProfilePicture() {
  const [photo, setPhoto] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [facing, setFacing] = useState('front');
  const [showCamera, setShowCamera] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fadeOut = Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      delay: 5000,
      useNativeDriver: true,
    });

    fadeOut.start();

    return () => fadeOut.stop();
  }, []);

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
      Alert.alert('Error', 'Please take or select a profile picture');
      return;
    }

    try {
      setIsLoading(true);
      
      // Store the profile picture in AsyncStorage
      await AsyncStorage.setItem('profilePicture', photo.base64);
      
      console.log('Profile picture saved successfully');
      
      // Navigate to sad picture setup
      router.replace('/setup/sadpic');
    } catch (error) {
      console.error('Error saving profile picture:', error);
      Alert.alert('Error', 'Failed to save profile picture. Please try again.');
    } finally {
      setIsLoading(false);
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
        <View style={[styles.previewContainer, { width: CIRCLE_RADIUS * 2, height: CIRCLE_RADIUS * 2 }]}>
          <Image source={{ uri: photo.uri }} style={styles.preview} />
        </View>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Saving profile picture...</Text>
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
      <View style={styles.cameraContainer}>
        {showCamera && (
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            onCameraReady={() => setCameraReady(true)}
          />
        )}
        <View style={styles.maskContainer}>
          <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
            <Rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.8)"
            />
            <Circle
              cx="50%"
              cy="50%"
              r={CIRCLE_RADIUS}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="2"
            />
          </Svg>
        </View>
        <Animated.Text style={[styles.tempText, { opacity: fadeAnim }]}>
          Take a profile picture
        </Animated.Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
  },
  camera: {
    flex: 1,
  },
  maskContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tempText: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
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
  previewContainer: {
    aspectRatio: 1,
    borderRadius: 1000,
    overflow: 'hidden',
    marginVertical: 40,
  },
  preview: {
    width: '100%',
    height: '100%',
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
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
  },
});