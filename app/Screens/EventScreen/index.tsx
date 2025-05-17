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
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGetAllEventsQuery, useAddClapsMutation } from "@/store/api/api";
import {
  Text,
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Divider,
} from "react-native-paper";
import { useSelector } from "react-redux";
import { timeConvert } from "@/app/customHooks";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { EmptyCardComponent } from "@/app/Components/EmptyCardComponent";
import { format } from "date-fns";
import { Dimensions } from "react-native";
const screenHeight = Dimensions.get("window").height;

const COLORS = {
  primary: "#a349a4",
  secondary: "#FF8C00",
  background: "#FFB347",
  textPrimary: "#ffffff",
  textSecondary: "#333333",
  error: "red",
  placeholder: "gray",
};

export const EventScreen = () => {
  const navigation = useNavigation();
  const country = useSelector((state) => state.counter.country);
  const userInfo = useSelector((state) => state.counter.userState);
  const {
    data: allEvents,
    isLoading,
    error,
    refetch,
  } = useGetAllEventsQuery(country);

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [addClap] = useAddClapsMutation();
  const [finalClaps, setFinalClaps] = useState({});

  useEffect(() => {
    if (allEvents?.events) {
      const initialClaps = allEvents.events.reduce((acc, event) => {
        acc[event.id] = event.claps || 0;
        return acc;
      }, {});
      setFinalClaps(initialClaps);
    }
  }, [allEvents]);

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

  const handleClap = (eventId) => {
    setFinalClaps((prev) => ({
      ...prev,
      [eventId]: (prev[eventId] || 0) + 1,
    }));
    addClap({ type: "events", id: eventId });
  };

  const renderModalContent = () => {
    if (!selectedEvent) return null;
    const isOwner =
      Number(selectedEvent?.user?.id) === Number(userInfo?.data?.user?.user_id);

    return (
      <ScrollView
        style={{ maxHeight: screenHeight - 10 }}
        contentContainerStyle={styles.modalScrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          {selectedEvent.photos?.[0] && (
            <Card.Cover
              source={{ uri: selectedEvent.photos[0] }}
              style={styles.coverImage}
              resizeMode="cover"
            />
          )}
          <Text style={styles.title}>{selectedEvent.name}</Text>
          <Divider style={styles.divider} />

          <Text style={styles.text}>${selectedEvent.price}</Text>
          <Divider style={styles.divider} />

          <Text style={styles.text}>
            {format(selectedEvent.date, "MM/dd/yyyy")}
          </Text>
          <Text style={styles.text}>
            🕒 {timeConvert(selectedEvent.start_time)} -{" "}
            {timeConvert(selectedEvent.end_time)}
          </Text>
          <Divider style={styles.divider} />

          <Text style={styles.text}>
            📍 {selectedEvent.addressLine1}
            {selectedEvent.city && `, ${selectedEvent.city}`}
            {selectedEvent.region && `, ${selectedEvent.region}`}
            {selectedEvent.postal && ` ${selectedEvent.postal}`}
          </Text>
          <Divider style={styles.divider} />

          <Text style={styles.description}>{selectedEvent.description}</Text>
          <Divider style={styles.divider} />

          {selectedEvent.ticket && (
            <Text
              onPress={() => Linking.openURL(selectedEvent.ticket)}
              style={styles.ticketText}
            >
              🎟️ {selectedEvent.ticket}
            </Text>
          )}
          <Divider style={styles.divider} />

          <View style={styles.clapRow}>
            <Text style={styles.clapText}>
              {finalClaps[selectedEvent.id] || 0}
            </Text>
            <TouchableOpacity onPress={() => handleClap(selectedEvent.id)}>
              <Icon color="red" size={30} name="hand-clap" />
            </TouchableOpacity>
          </View>

          {isOwner && (
            <Pressable
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("CompanyForms", {
                  operation: "edit",
                  eventId: selectedEvent.id,
                  eventType: "event",
                  item: selectedEvent,
                });
              }}
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: pressed ? COLORS.secondary : COLORS.primary,
                },
              ]}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </Pressable>
          )}

          <Button
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            Close
          </Button>
        </View>
      </ScrollView>
    );
  };

  const renderEventItem = ({ item }) => (
    <Card style={styles.card}>
      <TouchableOpacity
        onPress={() => {
          setSelectedEvent(item);
          setModalVisible(true);
        }}
      >
        {item.photos?.[0] && (
          <Card.Cover
            source={{ uri: item.photos[0] }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        )}
      </TouchableOpacity>
      <Card.Content>
        <View style={styles.headerRow}>
          <Title style={styles.title}>{item.name}</Title>
          <View style={styles.clapRow}>
            <Text style={styles.clapText}>{finalClaps[item.id] || 0}</Text>
            <TouchableOpacity onPress={() => handleClap(item.id)}>
              <Icon color="red" size={30} name="hand-clap" />
            </TouchableOpacity>
          </View>
        </View>
        <Title style={styles.title}>${item.price}</Title>
        <Text style={styles.text}>{format(item.date, "MM/dd/yyyy")}</Text>
        <Text style={styles.text}>
          🕒 {timeConvert(item.start_time)} - {timeConvert(item.end_time)}
        </Text>
        <Text style={styles.text}>
          📍 {item.addressLine1 || "N/A"}
          {item.city ? `, ${item.city}` : ""}
          {item.region ? `, ${item.region}` : ""}
          {item.postal ? ` ${item.postal}` : ""}
        </Text>
      </Card.Content>
    </Card>
  );

  const groupEventsAlphabetically = (events) => {
    if (!events) return [];
    const relevantEvents =
      events.filter((e) => e?.country === country?.country) || events;
    const grouped = relevantEvents.reduce((acc, event) => {
      const letter = event.name?.[0]?.toUpperCase() || "#";
      acc[letter] = acc[letter] || [];
      acc[letter].push(event);
      return acc;
    }, {});

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([title, data]) => ({
        title,
        data: data.sort((a, b) => a.name.localeCompare(b.name)),
      }));
  };

  if (isLoading) return <ActivityIndicator animating color={COLORS.primary} />;
  if (error) return <Text style={styles.errorText}>Error fetching events</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Button
          mode="contained"
          onPress={() =>
            navigation.navigate("Duplication", { eventType: "event" })
          }
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Add Event
        </Button>

        {!country ? (
          <EmptyCardComponent />
        ) : (
          <SectionList
            sections={groupEventsAlphabetically(allEvents?.events)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderEventItem}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionHeader}>{title}</Text>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
            stickySectionHeadersEnabled
            contentContainerStyle={{ paddingBottom: 32 }}
          />
        )}

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <SafeAreaView style={[styles.modalContainer, { flex: 1 }]}>
            {renderModalContent()}
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: 16 },
  card: { marginBottom: 16, backgroundColor: COLORS.textPrimary },
  coverImage: { width: "100%", height: 200, marginBottom: 10 },
  headerRow: { flexDirection: "row", justifyContent: "space-between" },
  title: { color: COLORS.textSecondary, fontSize: 18, fontWeight: "bold" },
  description: { color: COLORS.textSecondary, marginVertical: 8 },
  text: { color: COLORS.textSecondary, marginVertical: 2 },
  clapRow: { flexDirection: "row", alignItems: "center" },
  clapText: { color: "blue", fontSize: 16, marginRight: 4 },
  button: {
    backgroundColor: COLORS.primary,
    marginTop: 8,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: { color: COLORS.textPrimary, fontSize: 16 },
  buttonLabel: { color: COLORS.textPrimary, fontSize: 16 },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    backgroundColor: COLORS.background,
    color: COLORS.textSecondary,
    paddingVertical: 8,
  },
  ticketText: {
    color: "blue",
    textDecorationLine: "underline",
    fontSize: 16,
    marginVertical: 8,
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.textPrimary,
  },

  modalScrollContent: {
    paddingBottom: 40,
  },
  divider: {
    marginVertical: 10,
    height: 1,
  },
  closeButton: {
    marginTop: 16,
  },
});
