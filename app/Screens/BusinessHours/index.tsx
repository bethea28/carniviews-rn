import React, { useState } from "react";
import { Text, Pressable, ScrollView, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { timeConvert } from "@/app/customHooks";
import { setGlobalBusinessHours } from "@/store/globalState/globalState";
import { useDispatch, useSelector } from "react-redux";

export function BusinessHours({ addCompany, staleHours, stale }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [event, setEvent] = useState("open");
  const [datePickViz, setDatePickViz] = useState(false);
  const bizHour = useSelector((state) => state.counter.businessHours);
  const companyInfo = useSelector((state) => state.counter.companyInfo);

  const showDatePicker = (event, index) => {
    setIndex(index);
    setEvent(event);
    setDatePickViz(true);
  };

  const hideDatePicker = () => {
    setDatePickViz(false);
  };

  const handleConfirm = (time) => {
    const finalTime = timeConvert(new Date(time).toISOString());
    dispatch(setGlobalBusinessHours({ index, event, finalTime }));
    hideDatePicker();
  };
  const businessData = addCompany === true ? bizHour : companyInfo.hoursData;
  // const isHoursEmpty = Object.keys(companyInfo.hoursData).length === 0;

  console.log("BusinessHours NOW", companyInfo.hoursData);
  return (
    <ScrollView style={{ padding: 20 }}>
      {businessData &&
        Object.keys(businessData).map((dayKey, key) => (
          <View
            key={key}
            style={{
              flexDirection: "row",
              backgroundColor: "red",
              marginTop: 10,
              padding: 20,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, textAlign: "center" }}>
                {businessData[dayKey]?.day}
              </Text>

              <Pressable
                disabled={!addCompany}
                onPress={() => showDatePicker("open", key)}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? "blue" : "yellow",
                  flexDirection: "row",
                  justifyContent: "space-between",
                })}
              >
                <Text style={{ fontSize: 12 }}>Open</Text>
                <Text style={{ fontSize: 12 }}>
                  {businessData[dayKey]?.open}
                </Text>
              </Pressable>

              <Pressable
                disabled={!addCompany}
                onPress={() => showDatePicker("close", key)}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? "yellow" : "pink",
                  flexDirection: "row",
                  justifyContent: "space-between",
                })}
              >
                <Text style={{ fontSize: 12 }}>Close</Text>
                <Text style={{ fontSize: 12 }}>
                  {businessData[dayKey]?.close}
                </Text>
              </Pressable>
            </View>

            <DateTimePickerModal
              isVisible={datePickViz}
              mode="time"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
        ))}
    </ScrollView>
  );
}
