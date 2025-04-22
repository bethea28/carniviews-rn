import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Easing,
} from "react-native";
import { useAddFeedbackMutation } from "@/store/api/api";
import { useNavigation } from "@react-navigation/native";
import { Notifier, NotifierComponents } from "react-native-notifier";

// Color scheme
const primaryColor = "#a349a4";
const primaryLightColor = "#d67bff";
const primaryDarkColor = "#751976";
const secondaryColor = "#f28e1c";
const backgroundColor = "#f7b767";
const textColorPrimary = "#ffffff";
const textColorSecondary = "#333333";
const errorColor = "#B00020";
const surfaceColor = "#FFFFFF";
const dividerColor = "#E0E0E0";

export const AnonymousFeedback = () => {
  const [feedback, setFeedback] = useState("");
  const [sendFeedback] = useAddFeedbackMutation();
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      Alert.alert("Please enter some feedback before submitting.");
      return;
    }

    try {
      await sendFeedback({ feedback }).unwrap();
      setFeedback("");

      Notifier.showNotification({
        title: "Success",
        description: "Thank you for your anonymous feedback!",
        Component: NotifierComponents.Alert,
        hideOnPress: true,
        componentProps: {
          alertType: "success",
        },
        duration: 6000,
      });

      navigation.navigate("Bands");
    } catch (err) {
      console.log("feedback error", err);

      Notifier.showNotification({
        title: "Error",
        hideOnPress: true,
        description: "Something went wrong. Please try again.",
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: "error",
        },
        duration: 6000,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>Leave Anonymous Feedback</Text>
        <TextInput
          style={styles.input}
          placeholder="Type your feedback here..."
          placeholderTextColor={dividerColor}
          multiline
          numberOfLines={4}
          value={feedback}
          onChangeText={setFeedback}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: backgroundColor,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: textColorSecondary,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderColor: dividerColor,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    textAlignVertical: "top",
    backgroundColor: surfaceColor,
    color: textColorSecondary,
    fontSize: 16,
    flex: 1,
  },
  button: {
    backgroundColor: primaryColor,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: primaryDarkColor,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: textColorPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
});
