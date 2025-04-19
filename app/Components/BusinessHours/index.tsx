import React, { useState } from "react";
import {
  Text,
  Pressable,
  View,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { timeConvert } from "@/app/customHooks";
import {
  setGlobalBusinessHours,
  setEventHours,
} from "@/store/globalState/globalState";
import { useDispatch, useSelector } from "react-redux";

// Define a Material Design inspired color palette
const primaryColor = "#a349a4"; // Purple 500 (approx.)
const primaryLightColor = "#d67bff"; // Purple 200 (approx.)
const primaryDarkColor = "#751976"; // Purple 700 (approx.)
const secondaryColor = "#FF8C00"; // Orange A200 (approx.)
const secondaryLightColor = "#ffc04f"; // Orange A100 (approx.)
const secondaryDarkColor = "#b95f00"; // Orange A400 (approx.)
const backgroundColor = "#f7b767"; // Light Orange 200 (approx.)
const textColorPrimary = "#ffffff"; // White
const textColorSecondary = "#333333"; // Dark Gray
const surfaceColor = "#FFFFFF"; // White
const shadowColor = "#000";
const dividerColor = "#E0E0E0"; // Grey 300
const errorColor = "#B00020"; // Red 600

export function BusinessHours({
  addCompany,
  staleHours,
  stale,
  referrer = "",
  eventType = "event",
}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [event, setEvent] = useState("open");
  const [datePickViz, setDatePickViz] = useState(false);
  const bizHour = useSelector((state) => state.counter.businessHours);
  const companyInfo = useSelector((state) => state.counter.companyInfo);
  const eventHours = useSelector((state) => state.counter.eventHours);

  const showDatePicker = (event, index) => {
    if (eventType === "company") {
      setSelectedDayIndex(index);
      setEvent(event);
      setDatePickViz(true);
    } else {
      setEvent(event);
      setDatePickViz(true);
    }
  };

  const hideDatePicker = () => {
    setDatePickViz(false);
  };

  const handleConfirm = (time) => {
    const finalTime = time.toISOString();
    if (eventType === "company") {
      if (selectedDayIndex !== null) {
        dispatch(
          setGlobalBusinessHours({
            index: selectedDayIndex,
            event,
            finalTime,
          })
        );
      }
    } else {
      dispatch(setEventHours({ event, finalTime }));
    }
    hideDatePicker();
  };

  const businessData = addCompany === true ? bizHour : companyInfo?.hoursData;
  const daysOfWeek = businessData ? Object.keys(businessData) : [];
  return eventType === "company" || referrer === "tabs" ? (
    <View style={[styles.container, { backgroundColor: secondaryColor }]}>
      <Text style={styles.businessHoursTitle}>Business Hours</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {daysOfWeek.map((dayKey, index) => (
          <View key={dayKey} style={styles.dayContainer}>
            <Text style={styles.dayText}>{businessData[dayKey]?.day}</Text>

            <View style={styles.buttonsContainer}>
              <Pressable
                disabled={!addCompany}
                onPress={() => showDatePicker("open", index)}
                style={({ pressed }) => [
                  styles.timeButton,
                  styles.openButton,
                  Platform.OS === "ios" && pressed && styles.buttonPressedIOS,
                ]}
                android_ripple={{ color: secondaryDarkColor }}
              >
                <Text style={styles.buttonText}>Open</Text>
                <Text style={styles.buttonTime}>
                  {timeConvert(businessData[dayKey]?.open)}
                </Text>
              </Pressable>

              <View style={styles.buttonSpacer} />

              <Pressable
                disabled={!addCompany}
                onPress={() => showDatePicker("close", index)}
                style={({ pressed }) => [
                  styles.timeButton,
                  styles.closeButton,
                  Platform.OS === "ios" && pressed && styles.buttonPressedIOS,
                ]}
                android_ripple={{ color: primaryDarkColor }}
              >
                <Text style={styles.buttonText}>Close</Text>
                <Text style={styles.buttonTime}>
                  {timeConvert(businessData[dayKey]?.close)}
                </Text>
              </Pressable>
            </View>

            <DateTimePickerModal
              isVisible={datePickViz && selectedDayIndex === index}
              mode="time"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              themeVariant="light" // Or "dark" based on your app's theme
            />
          </View>
        ))}
      </ScrollView>
    </View>
  ) : (
    <View>
      {["start", "end"].map((event, key) => {
        return (
          <View
            key={event}
            style={{ flexDirection: "row", marginTop: 10, marginRight: 20 }}
          >
            <View style={styles.buttonsContainer}>
              <Pressable
                disabled={!addCompany}
                onPress={() => showDatePicker(event)}
                style={({ pressed }) => [
                  styles.timeButton,
                  styles.openButton,
                  Platform.OS === "ios" && pressed && styles.buttonPressedIOS,
                ]}
                android_ripple={{ color: secondaryDarkColor }}
              >
                <Text style={styles.buttonText}>
                  {event.toLocaleUpperCase()}
                </Text>
                <Text style={styles.buttonTime}>
                  {event === "start"
                    ? timeConvert(eventHours?.start)
                    : timeConvert(eventHours?.end)}
                </Text>
              </Pressable>
            </View>

            <DateTimePickerModal
              isVisible={datePickViz}
              mode="time"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              themeVariant="light" // Or "dark" based on your app's theme
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollViewContent: {
    paddingBottom: 16,
  },
  businessHoursTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: textColorSecondary,
    marginBottom: 16,
    textAlign: "center",
  },
  dayContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: surfaceColor,
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    justifyContent: "space-between",
    elevation: 1, // Subtle shadow for the day container (card-like)
  },
  dayText: {
    fontSize: 16,
    color: textColorSecondary,
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    marginLeft: 16,
    flex: 1.5,
    alignItems: "center",
    justifyContent: "space-around",
  },
  timeButton: {
    borderRadius: 4,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    elevation: 1, // Subtle shadow for the time buttons
  },
  openButton: {
    backgroundColor: secondaryColor,
  },
  closeButton: {
    backgroundColor: primaryColor,
  },
  buttonPressedIOS: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 14,
    color: textColorPrimary,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 2,
  },
  buttonTime: {
    fontSize: 14,
    color: textColorPrimary,
    textAlign: "center",
  },
  buttonSpacer: {
    width: 8,
  },
});
