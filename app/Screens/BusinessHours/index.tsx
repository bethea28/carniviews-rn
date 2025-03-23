import React, { useState } from "react";
import { Text, Button } from "react-native-paper";
import { View, FlatList, Pressable, Image, ScrollView } from "react-native";
import { CompanyCard } from "@/app/Components/CardComponent";
import { companyObjects } from "@/mockData";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useBusinessHours, timeConvert } from "@/app/customHooks";

export function BusinessHours({ closeView }) {
  const navigation = useNavigation();
  const {
    allDays,
    businessState,
    setBusinessState,
    setAllDays,
    datePickerVis,
    setDatePickerVis,
  } = useBusinessHours();

  const [bizState, setBizState] = useState({});

  const dayKeys = Object.keys(allDays);

  const showDatePicker = (event, index) => {
    console.log("A date has been picked: ", index);
    const finalBizState =
      event?._dispatchInstances.memoizedProps.children?.toLowerCase();
    // console.log("fianl biz", finalBizState);
    setBusinessState({ index, finalBizState });
    // setBizState({ index, finalBizState });
    setDatePickerVis(true);
  };

  const hideDatePicker = () => {
    setDatePickerVis(false);
  };

  const handleConfirm = (time) => {
    const finalDays = allDays;
    finalDays[businessState?.index][businessState?.finalBizState] = time;
    setAllDays({ ...finalDays });
    hideDatePicker();
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      {dayKeys.map((dayKey, key) => {
        return (
          <View
            key={key}
            style={{
              flexDirection: "row",
              backgroundColor: "red",
              marginTop: 10,
              padding: 20,
            }}
          >
            <View style={{ flex: 1, backgroundColor: "blue" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignSelf: "center",
                }}
              >
                <Text style={{ fontSize: 12, textAlign: "center" }}>
                  {allDays[dayKey].day}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{ fontSize: 12 }}
                  onPress={(event) => showDatePicker(event, key)}
                >
                  Open
                </Text>
                <Text style={{ fontSize: 12 }}>
                  {timeConvert(allDays[dayKey].open)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{ fontSize: 12 }}
                  onPress={(event) => showDatePicker(event, key)}
                >
                  Close
                </Text>
                <Text style={{ fontSize: 12 }}>
                  {timeConvert(allDays[dayKey].close)}
                </Text>
              </View>
            </View>

            <DateTimePickerModal
              isVisible={datePickerVis}
              mode="time"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
        );
      })}
      <Pressable
        onPress={() => closeView(allDays)}
        style={{ backgroundColor: "blue", alignItems: "center" }}
      >
        <Text>Done</Text>
      </Pressable>
    </ScrollView>
  );
}
