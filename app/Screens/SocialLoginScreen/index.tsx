import React, { useEffect, useState } from "react";
import { Button, Alert, View } from "react-native";
import { setUserState } from "@/store/globalState/globalState";
import { useDispatch } from "react-redux";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

export function SocialLoginScreen() {
  const dispatch = useDispatch();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "389796448834-lokv2d5vt75qbshil74f1t6c8hrajm48.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);

  const handleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      dispatch(setUserState(response));
    } catch (error) {
      handleSignInError(error);
    }
  };

  const handleSignInError = (error) => {
    let message = "An unknown error occurred. Please try again.";
    if (error.code) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          message = "Sign-in was cancelled by the user.";
          break;
        case statusCodes.IN_PROGRESS:
          message = "Sign-in is already in progress.";
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          message = "Google Play Services is not available or outdated.";
          break;
        default:
          message = "An error occurred: " + error.message;
      }
    }
    Alert.alert("Sign-In Error", message);
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Login with Google" onPress={handleSignIn} />
    </View>
  );
}
