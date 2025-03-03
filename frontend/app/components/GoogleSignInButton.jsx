import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Configure Google Sign-In
WebBrowser.maybeCompleteAuthSession();

// Google OAuth configuration
const googleClientId = Platform.select({
  ios: '552772906284-plrbblvlcu7k42e9s4cvhht5hhqtlg4v.apps.googleusercontent.com',
  android: '552772906284-plrbblvlcu7k42e9s4cvhht5hhqtlg4v.apps.googleusercontent.com',
  web: '552772906284-rfc5jhovebjrqra25e447hh1vnd2c32i.apps.googleusercontent.com',
});

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export const GoogleSignInButton = () => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function prepareGoogleSignIn() {
      try {
        // Use different redirect URI approach based on platform
        const redirectUri = Platform.select({
          web: AuthSession.makeRedirectUri({ useProxy: false }),
          default: AuthSession.makeRedirectUri({ 
            useProxy: true,
            scheme: 'com.hoth.rollcall' 
          })
        });
        
        console.log('Redirect URI:', redirectUri);
        
        const newRequest = await AuthSession.loadAsync({
          clientId: googleClientId,
          redirectUri,
          responseType: 'code',
          usePKCE: false,
          scopes: ['profile', 'email'],
        }, discovery);
        
        setRequest(newRequest);
      } catch (error) {
        console.error('Error preparing Google Sign-In:', error);
      }
    }
    
    prepareGoogleSignIn();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      
      if (!request) {
        Alert.alert('Error', 'Google Sign-In is not ready yet. Please try again.');
        setLoading(false);
        return;
      }
      
      // Use different prompt approach based on platform
      const result = await Platform.select({
        web: request.promptAsync(),
        default: request.promptAsync({ useProxy: true })
      });
      
      if (result.type === 'success') {
        // Handle successful authentication
        const { code } = result.params;
        
        console.log('Authentication successful!');
        console.log('Authorization code:', code);
        
        // Here you would typically send the code to your backend
        // to exchange it for tokens and create a user session
        
        // Navigate to setup page
        router.replace('/setup/username');
      } else {
        console.log('Authentication failed or was cancelled');
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.googleButton}
      onPress={handleGoogleSignIn}
      disabled={loading || !request}
    >
      <View style={styles.buttonContent}>
        <Ionicons name="logo-google" size={24} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.buttonText}>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});