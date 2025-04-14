import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
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
  const { data: allEvents, isLoading, error, refetch } = useGetAllEventsQuery();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log("EventScreen loaded");
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (err) {
      console.error("Refresh failed", err);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const renderEventItem = ({ item }) =>
    console.log("images now", item.price) || (
      <Card style={styles.card}>
        {item.images[0]?.uri ? (
          <Card.Cover
            style={styles.eventImage}
            source={{
              uri: item.images[0].uri,
            }}
          />
        ) : (
          <></>
        )}
        <Card.Content>
          <Title style={styles.title}>{item.name}</Title>
          <Title style={styles.title}>{item.price}</Title>
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
  console.log("all my eventgs", allEvents?.events.at(-1));
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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

        {isLoading && !refreshing ? (
          <ActivityIndicator animating={true} color={primaryColor} />
        ) : error ? (
          <Text style={styles.errorText}>Error fetching events</Text>
        ) : (
          <FlatList
            data={allEvents?.events || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderEventItem}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[primaryColor]}
                tintColor={primaryColor}
              />
            }
            contentContainerStyle={{ paddingBottom: 32 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  eventImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 10,
  },

  container: {
    flex: 1,
    padding: 16,
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
