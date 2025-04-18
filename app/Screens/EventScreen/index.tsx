import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  SectionList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Modal,
  Pressable,
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  const handleEventDetails = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const renderEventItem = ({ item }) => (
    <Card onPress={() => handleEventDetails(item)} style={styles.card}>
      {item.images[0]?.uri ? (
        <Card.Cover
          style={styles.eventImage}
          source={{ uri: item.images[0].uri }}
        />
      ) : null}
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

  const groupEventsAlphabetically = (events) => {
    const grouped = events.reduce((acc, event) => {
      const firstLetter = event.name?.[0]?.toUpperCase() || "#";
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(event);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort()
      .map((letter) => ({
        title: letter,
        data: grouped[letter].sort((a, b) => a.name.localeCompare(b.name)),
      }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Button
          mode="contained"
          onPress={() =>
            navigation.navigate("CompanyForms", { eventType: "event" })
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
          <SectionList
            sections={groupEventsAlphabetically(allEvents?.events || [])}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderEventItem}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionHeader}>{title}</Text>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[primaryColor]}
                tintColor={primaryColor}
              />
            }
            stickySectionHeadersEnabled={true} // <-- Make headers sticky!
            contentContainerStyle={{ paddingBottom: 32 }}
          />
        )}
      </View>

      {/* Event Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedEvent && (
              <>
                <Title style={styles.modalTitle}>{selectedEvent.name}</Title>
                <Text style={styles.modalText}>
                  {selectedEvent.description}
                </Text>
                <Text style={styles.modalText}>
                  🕒 {selectedEvent.hours?.start} - {selectedEvent.hours?.end}
                </Text>
                <Text style={styles.modalText}>
                  📍 {selectedEvent.address}, {selectedEvent.city},{" "}
                  {selectedEvent.state} {selectedEvent.zip_code}
                </Text>
                <Text style={styles.modalText}>💰 {selectedEvent.price}</Text>
              </>
            )}
            <Button
              mode="contained"
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
              labelStyle={{ color: buttonTextColor }}
            >
              Close
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: inputBackgroundColor,
  },
  eventImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 10,
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
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    backgroundColor: backgroundColor,
    color: textColorSecondary,
    paddingVertical: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "100%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: textColorSecondary,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
    color: textColorSecondary,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: primaryColor,
    borderRadius: 6,
  },
});
