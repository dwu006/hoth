import React, { useState, useEffect } from "react";
import { Button, View, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from 'expo-router'

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton() {
    const [userInfo, setUserInfo] = React.useState(null);
    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: "552772906284-plrbblvlcu7k42e9s4cvhht5hhqtlg4v.apps.googleusercontent.com",  // Replace with your iOS client ID
        webClientId: "552772906284-rfc5jhovebjrqra25e447hh1vnd2c32i.apps.googleusercontent.com",
    });

    React.useEffect(() => {
        handleSignInWithGoogle();
    }, [response])

    async function handleSignInWithGoogle() {
        const user = await AsyncStorage.getItem("@user");
        if (!user){
            if(response?.type === "success") {
                await getUserInfo(response.authentication.accessToken)
            }
        } else {
            setUserInfo(JSON.parse(user))
        }
        router.push('/pages/setup/username')
    }

    const getUserInfo = async (token) => {
        if (!token) return;
        try {
            const response = await fetch(
                "https://www.googleapis.com/userinfo/v2/me",
                {
                    headers: { Authorization: `Bearer ${token}`},
                }
            )
            const user = await response.json();
            await AsyncStorage.setItem("@user", JSON.stringify(user))
        } catch (error) {

        }
    }

    return (
        <View>
            <Button title="Sign in with Google" onPress={() => promptAsync()}></Button>
        </View>
    )
}
/*
export default function GoogleSignInButton() {
  const [userInfo, setUserInfo] = useState(null);
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true, // This will use Expo's redirect URI
  });

  // OAuth setup with expoClientId and iosClientId
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "552772906284-rfc5jhovebjrqra25e447hh1vnd2c32i.apps.googleusercontent.com", // Replace with your Expo client ID
    iosClientId: "552772906284-plrbblvlcu7k42e9s4cvhht5hhqtlg4v.apps.googleusercontent.com",  // Replace with your iOS client ID
    webClientId: "552772906284-rfc5jhovebjrqra25e447hh1vnd2c32i.apps.googleusercontent.com",
    redirectUri,
  });

  useEffect(() => {
    // If the response is successful, fetch user info
    if (response?.type === "success") {
      const { access_token } = response.authentication; // Use the access_token from the response
      fetchUserInfo(access_token);
    }
  }, [response]);

  // Function to fetch user info from Google API
  async function fetchUserInfo(token) {
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      setUserInfo(user);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }

  return (
    <View
        backgroundColor="#333333"
    >
      <Button
        title="Sign in with Google"
        disabled={!request} // Disable the button if the request is not ready
        onPress={() => promptAsync()} // Trigger OAuth flow
      />
      {userInfo && (
        <View>
          <Text>Welcome, {userInfo.name}!</Text>
          <Text>Email: {userInfo.email}</Text>
        </View>
      )}
    </View>
  );
}*/