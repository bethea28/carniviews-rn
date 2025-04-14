import React, { useEffect } from "react";
import {
  View,
  Image,
  ScrollView,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGetAllEventsQuery } from "@/store/api/api";
import {
  Text,
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
} from "react-native-paper";

// Color Scheme
const primaryColor = "#a349a4";
const secondaryColor = "#FF8C00";
const backgroundColor = "#FFB347";
const textColorPrimary = "#ffffff";
const textColorSecondary = "#333333";
const inputBackgroundColor = textColorPrimary;
const buttonBackgroundColor = primaryColor;
const buttonTextColor = textColorPrimary;
const errorTextColor = "red";
const placeholderTextColor = "gray";

export const EventScreen = () => {
  const navigation = useNavigation();
  const { data: allEvents, isLoading, error } = useGetAllEventsQuery();

  useEffect(() => {
    console.log("EventScreen loaded");
  }, []);

  const renderEventItem = ({ item }) => (
    <Card style={styles.card}>
      {item.images?.[0]?.uri && (
        <Card.Cover source={{ uri: item.images[0].uri }} />
      )}
      <Card.Content>
        <Title style={styles.title}>{item.name}</Title>
        <Paragraph style={styles.paragraph} numberOfLines={2}>
          {item.description}
        </Paragraph>
        <Text style={styles.text}>
          🕒 {item.hours?.start} - {item.hours?.end}
        </Text>
        <Text style={styles.text}>
          📍 {item.address}, {item.city}, {item.state} {item.zip_code}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Button
          mode="contained"
          onPress={() =>
            navigation.navigate("AddCompEvent", { eventType: "event" })
          }
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Add Event
        </Button>

        {isLoading ? (
          <ActivityIndicator animating={true} color={primaryColor} />
        ) : error ? (
          <Text style={styles.errorText}>Error fetching events</Text>
        ) : (
          <FlatList
            data={allEvents?.events || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderEventItem}
            scrollEnabled={false} // Disable since ScrollView handles scrolling
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    backgroundColor: inputBackgroundColor,
  },
  title: {
    color: textColorSecondary,
    fontSize: 18,
    fontWeight: "bold",
  },
  paragraph: {
    color: textColorSecondary,
    marginBottom: 6,
  },
  text: {
    color: textColorSecondary,
  },
  button: {
    backgroundColor: buttonBackgroundColor,
    marginBottom: 20,
    borderRadius: 6,
  },
  buttonLabel: {
    color: buttonTextColor,
    fontSize: 16,
  },
  errorText: {
    color: errorTextColor,
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});
