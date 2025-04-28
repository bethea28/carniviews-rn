import * as React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";

// Colors (matching your palette)
const primaryColor = "#a349a4"; // Purple 500
const textColorSecondary = "#333333"; // Dark Gray
const surfaceColor = "#FFFFFF"; // White
const disabledColor = "#E0E0E0"; // Grey 300

export const EmptyCardComponent = ({ onRetry }) => {
  return (
    <View style={styles.card}>
      <Image
        style={styles.image}
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/4076/4076549.png",
        }}
        resizeMode="contain"
      />
      <Text style={styles.title}>No Companies Yet</Text>
      <Text style={styles.subtitle}>
        Check back soon — we’re adding more amazing Carnival Bands!
      </Text>

      {onRetry && (
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? "#c062c0" : primaryColor },
          ]}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: surfaceColor,
    borderRadius: 8,
    elevation: 2,
    overflow: "hidden",
    alignItems: "center",
    padding: 24,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 16,
    tintColor: disabledColor,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: textColorSecondary,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: textColorSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    marginTop: 12,
    backgroundColor: primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    elevation: 1,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
