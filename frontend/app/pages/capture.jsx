import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

export default function Capture() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');
  const [capturing, setCapturing] = useState(false);
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);

  // Reset photo when leaving the page
  useEffect(() => {
    if (!isFocused && photo) {
      setPhoto(null);
    }
  }, [isFocused, photo]);

  // Function to take picture
  const takePicture = async () => {
    if (!cameraRef.current || !cameraReady || capturing) return;
    
    try {
      setCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });
      
      console.log('Photo taken:', photo.uri);
      setPhoto(photo);
      
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to capture photo');
    } finally {
      setCapturing(false);
    }
  };

  // Function to retake photo
  const retakePhoto = () => {
    setPhoto(null);
  };

  // Function to proceed with the photo
  const handleDone = () => {
    router.push('/events/events');
  };

  // Toggle between front and back camera
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // Toggle flash mode
  const toggleFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : 'off'));
  };

  if (!permission) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.loading}>
        <Icon name="camera-off-outline" size={60} color="#FFFFFF" />
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={requestPermission}
        >
          <ActivityIndicator size="large" color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  }

  if (photo) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <Image source={{ uri: photo.uri }} style={styles.preview} />
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {isFocused ? (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          enableTorch={flash === 'on'}
          onCameraReady={() => setCameraReady(true)}
          onMountError={(error) => {
            console.error('Camera mount error:', error);
            Alert.alert('Camera Error', 'Failed to initialize camera');
          }}
        >
          <View style={styles.overlay}>
            {/* Controls */}
            <View style={styles.controlsContainer}>
              {/* Flash Toggle Button */}
              <TouchableOpacity 
                style={styles.controlButton} 
                onPress={toggleFlash}
              >
                <Icon 
                  name={flash === 'on' ? 'flash' : 'flash-off'} 
                  size={24} 
                  color="#FFFFFF" 
                />
              </TouchableOpacity>
              
              {/* Capture Button */}
              <TouchableOpacity 
                style={[styles.captureButton, capturing && styles.capturingButton]} 
                onPress={takePicture}
                disabled={!cameraReady || capturing}
              >
                <View style={styles.captureButtonInner}>
                  {capturing ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <View style={styles.captureButtonCore} />
                  )}
                </View>
              </TouchableOpacity>
              
              {/* Camera Toggle Button */}
              <TouchableOpacity 
                style={styles.controlButton} 
                onPress={toggleCameraFacing}
                disabled={capturing}
              >
                <Icon name="camera-reverse-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      ) : (
        <View style={[styles.camera, styles.loading]}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loading: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  capturingButton: {
    opacity: 0.7,
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonCore: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  previewControls: {
    position: 'absolute',
    bottom: 30,
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
});