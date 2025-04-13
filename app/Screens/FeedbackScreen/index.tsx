import React, { useState } from "react";
import { useAddFeedbackMutation } from "@/store/api/api";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";

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
      const postFeedback = await sendFeedback({ feedback });
      setFeedback("");
      navigation.navigate("Home");
    } catch (err) {
      console.log("feedback error", err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Leave Anonymous Feedback</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your feedback here..."
        multiline
        numberOfLines={4}
        value={feedback}
        onChangeText={setFeedback}
      />
      <Button title="Submit Feedback" onPress={handleSubmit} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    // borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    textAlignVertical: "top",
    backgroundColor: "#f9f9f9",
  },
});
