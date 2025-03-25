import React, { useEffect } from "react";
import { Button, Alert } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";

export function SocialLoginScreen() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "YOUR_EXPO_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    iosClientId:
      "743443225844-tg0083sojer7e57dlj91q1eg3s4qqnhn.apps.googleusercontent.com",
    webClientId:
      "743443225844-fmrdev7pa964gof4akfahi3dkin5jpkb.apps.googleusercontent.com",
    redirectUri: makeRedirectUri({ useProxy: true }), // Ensures Expo handles redirects properly
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      console.log("Authentication:", authentication);
      // Handle authentication (e.g., send to your server)
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Login with Google"
      onPress={() => {
        promptAsync();
      }}
    />
  );
}
