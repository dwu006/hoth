import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { CameraView } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

export default function SadPicture() {
  const [photo, setPhoto] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [facing, setFacing] = useState('front');
  const [showCamera, setShowCamera] = useState(true);
  const cameraRef = useRef(null);

  const pickImage = async () => {
    try {
      setShowCamera(false);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhoto({ uri: result.assets[0].uri });
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
      });
      setPhoto(photo);
    } catch (error) {
      console.error('Failed to take picture:', error);
    }
  };

  const handleDone = () => {
    // TODO: Upload sadPic to backend
    router.replace('/pages/feed');
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
      {showCamera && (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          onCameraReady={() => setCameraReady(true)}
        >
          <View style={styles.overlay}>
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
});