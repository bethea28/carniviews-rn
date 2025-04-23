import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  SectionList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Modal,
  Linking,
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
import { useSelector } from "react-redux";
import { timeConvert } from "@/app/customHooks";
// import { Icon } from "react-native-vector-icons/Icon";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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
  const country = useSelector((state) => state.counter.country);

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
      {item.images?.[0]?.uri ? (
        <Card.Cover
          style={styles.eventImage}
          source={{ uri: item.images[0].uri }}
        />
      ) : null}
      <Card.Content>
        <Title style={styles.title}>{item.name}</Title>
        <Title style={styles.title}>${item.price}</Title>
        <Paragraph style={styles.paragraph} numberOfLines={2}>
          {item.description}
        </Paragraph>
        <Text style={styles.text}>
          🕒 {timeConvert(item.start_time)} - {timeConvert(item.end_time)}
        </Text>
        <Text style={styles.text}>
          📍 {item.addressLine1 || "N/A"}
          {item.city ? `, ${item.city}` : ""}
          {item.region ? `, ${item.region}` : ""}
          {item.postal ? ` ${item.postal}` : ""}
        </Text>
        {item.ticket && (
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}
          >
            <Icon name="ticket" style={{ marginLeft: 4, marginRight: 12 }} />
            <Text
              onPress={() => Linking.openURL(item.ticket)}
              style={[
                styles.text,
                { color: "blue", textDecorationLine: "underline" },
              ]}
            >
              {item.ticket}
            </Text>
          </View>
        )}
        <Pressable
          onPress={() =>
            navigation.navigate("CompanyForms", {
              eventType: "event",
              item,
            })
          }
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed ? secondaryColor : primaryColor,
            },
          ]}
          android_ripple={{ color: primaryColor }}
        >
          <Text style={styles.button}>Edit</Text>
        </Pressable>
      </Card.Content>
    </Card>
  );

  const groupEventsAlphabetically = (events) => {
    if (!events) return [];
    const filteredComp = events.filter(
      (item) => item?.country === country?.country
    );
    const parsedCompanies = filteredComp.length === 0 ? events : filteredComp;
    const grouped = parsedCompanies.reduce((acc, event) => {
      const name = event.name || "";
      const firstLetter = name[0]?.toUpperCase() || "#";
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
  console.log("EVENTS IN YO HOOD", allEvents);
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Button
          // disabled={!country}
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
            stickySectionHeadersEnabled={true}
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
                  🕒 {timeConvert(selectedEvent.start_time)} -{" "}
                  {timeConvert(selectedEvent.end_time)}
                </Text>
                <Text style={styles.modalText}>
                  📍 {selectedEvent.addressLine1 || "N/A"}
                  {selectedEvent.city ? `, ${selectedEvent.city}` : ""}
                  {selectedEvent.region ? `, ${selectedEvent.region}` : ""}
                  {selectedEvent.postal ? ` ${selectedEvent.postal}` : ""}
                </Text>
                <Text style={styles.modalText}>💰 ${selectedEvent.price}</Text>
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
