import React, { useEffect, useState } from "react";
import { Button, Alert, View } from "react-native";
import { setUserState } from "@/store/globalState/globalState";
import { useDispatch } from "react-redux";
import { useGoogleAuthMutation } from "@/store/api/api";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { useAsyncStorage } from "@/app/customHooks";

export function SocialLoginScreen() {
  const dispatch = useDispatch();
  const [googleSignIn] = useGoogleAuthMutation();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "389796448834-lokv2d5vt75qbshil74f1t6c8hrajm48.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);
  const [storeData, getData] = useAsyncStorage();
  const handleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      // const req = response.json();
      const fullUserResponse = await googleSignIn(response);
      // const decode = jwt_decode(jwtResponse.data.tokens.access);
      console.log("NEW RESPONSE OBJH", fullUserResponse);
      // console.log("NEW test", decode);
      const formattedJwt = fullUserResponse.data;
      // storeData("tokens", formattedJwt);
      dispatch(setUserState(fullUserResponse));
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
  // const tokens = getData();
  console.log("here are tokens now");
  return (
    <View style={{ padding: 20 }}>
      <Button title="Login with Google" onPress={handleSignIn} />
    </View>
  );
}
