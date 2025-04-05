import React, { useState } from "react";
import { Text, Pressable, View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { timeConvert } from "@/app/customHooks";
import { setGlobalBusinessHours } from "@/store/globalState/globalState";
import { useDispatch, useSelector } from "react-redux";

// Define the color palette based on the image (same as other components)
const primaryColor = "#a349a4"; // Purple
const secondaryColor = "#FF8C00"; // Orange
const backgroundColor = "#FFB347"; // Light Orange
const textColorPrimary = "#ffffff"; // White
const textColorSecondary = "#333333"; // Dark Gray

export function BusinessHours({ addCompany, staleHours, stale }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [event, setEvent] = useState("open");
  const [datePickViz, setDatePickViz] = useState(false);
  const bizHour = useSelector((state) => state.counter.businessHours);
  const companyInfo = useSelector((state) => state.counter.companyInfo);

  const showDatePicker = (event, index) => {
    setSelectedDayIndex(index);
    setEvent(event);
    setDatePickViz(true);
  };

  const hideDatePicker = () => {
    setDatePickViz(false);
  };

  const handleConfirm = (time) => {
    if (selectedDayIndex !== null) {
      const finalTime = timeConvert(new Date(time).toISOString());
      dispatch(
        setGlobalBusinessHours({
          index: selectedDayIndex,
          event,
          finalTime,
        })
      );
    }
    hideDatePicker();
  };

  const businessData = addCompany === true ? bizHour : companyInfo?.hoursData;
  const daysOfWeek = businessData ? Object.keys(businessData) : [];

  return (
    <View style={styles.container}>
      <Text style={styles.businessHoursTitle}>Business Hours</Text>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        style={styles.container}
      >
        {daysOfWeek.map((dayKey, index) => (
          <View key={dayKey} style={styles.dayContainer}>
            <Text style={styles.dayText}>{businessData[dayKey]?.day}</Text>

            <View style={styles.buttonsContainer}>
              <Pressable
                disabled={!addCompany}
                onPress={() => showDatePicker("open", index)}
                style={[styles.timeButton, styles.openButton]}
              >
                <Text style={styles.buttonText}>Open</Text>
                <Text style={styles.buttonTime}>
                  {businessData[dayKey]?.open}
                </Text>
              </Pressable>

              <View style={styles.buttonSpacer} />

              <Pressable
                disabled={!addCompany}
                onPress={() => showDatePicker("close", index)}
                style={[styles.timeButton, styles.closeButton]}
              >
                <Text style={styles.buttonText}>Close</Text>
                <Text style={styles.buttonTime}>
                  {businessData[dayKey]?.close}
                </Text>
              </Pressable>
            </View>

            <DateTimePickerModal
              isVisible={datePickViz && selectedDayIndex === index}
              mode="time"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: backgroundColor,
  },
  businessHoursTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: textColorSecondary,
    // marginBottom: 20,
    textAlign: "center",
  },
  dayContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: textColorPrimary,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  dayText: {
    fontSize: 16,
    color: textColorSecondary,
    flex: 0.6,
  },
  buttonsContainer: {
    flexDirection: "row",
    marginLeft: 10,
    flex: 1.8,
    alignItems: "center",
    justifyContent: "space-around",
  },
  timeButton: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 0.45,
  },
  openButton: {
    backgroundColor: secondaryColor,
  },
  closeButton: {
    backgroundColor: primaryColor,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 14,
    color: textColorPrimary,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonTime: {
    fontSize: 14,
    color: textColorPrimary,
    textAlign: "center",
  },
  buttonSpacer: {
    width: 10,
  },
});
