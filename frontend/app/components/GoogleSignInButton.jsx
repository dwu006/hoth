import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
          // Add calendar.readonly scope to access Google Calendar
          scopes: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.readonly'],
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
        
        try {
          // Exchange code for tokens
          const tokenResult = await exchangeCodeForToken(code, request.redirectUri);
          
          if (tokenResult && tokenResult.access_token) {
            // Store tokens in AsyncStorage
            await AsyncStorage.setItem('googleAccessToken', tokenResult.access_token);
            
            if (tokenResult.refresh_token) {
              await AsyncStorage.setItem('googleRefreshToken', tokenResult.refresh_token);
            }
            
            // Store user email if available
            if (tokenResult.id_token) {
              const userInfo = parseJwt(tokenResult.id_token);
              if (userInfo && userInfo.email) {
                await AsyncStorage.setItem('email', userInfo.email);
              }
            }
            
            console.log('Tokens stored successfully');
          }
        } catch (tokenError) {
          console.error('Error exchanging code for token:', tokenError);
          // Continue with navigation even if token exchange fails
        }
        
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

  // Function to exchange authorization code for tokens
  const exchangeCodeForToken = async (code, redirectUri) => {
    try {
      const tokenEndpoint = 'https://oauth2.googleapis.com/token';
      
      const params = new URLSearchParams();
      params.append('client_id', googleClientId);
      params.append('code', code);
      params.append('redirect_uri', redirectUri);
      params.append('grant_type', 'authorization_code');
      
      // In a production app, you would typically handle this on your backend
      // to avoid exposing your client secret
      
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });
      
      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  };

  // Helper function to parse JWT token
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
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
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 10,
    width: '20%',
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