import React, { useState } from "react";
import { Text, Button } from "react-native-paper";
import { View, FlatList, Pressable, Image, ScrollView } from "react-native";
import { CompanyCard } from "@/app/Components/CardComponent";
import { companyObjects } from "@/mockData";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useBusinessHours, timeConvert } from "@/app/customHooks";
import { setGlobalBusinessHours } from "@/store/globalState/globalState";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
export function BusinessHours({
  hoursData = {},
  closeView,
  stale,
  defaultBusinessHours = {
    0: { day: "Mon", open: "", close: "" },
    1: { day: "Tues", open: "", close: "" },
    2: { day: "Wed", open: "", close: "" },
    3: { day: "Thurs", open: "", close: "" },
    4: { day: "Fri", open: "", close: "" },
    5: { day: "Sat", open: "", close: "" },
    6: { day: "Sun", open: "", close: "" },
  },
}) {
  const navigation = useNavigation();
  const {
    allDays,
    businessState,
    setBusinessState,
    setAllDays,
    datePickerVis,
    setDatePickerVis,
  } = useBusinessHours();
  const dispatch = useDispatch();
  const [bizState, setBizState] = useState({});
  const [indexy, setIndexy] = React.useState(0);
  const [eventy, setEventy] = React.useState("open");
  const [datePickViz, setDatePickViz] = React.useState(false);
  const [businessHours, setBusinessHours] = React.useState({
    0: { day: "Mon", open: "", close: "" },
    1: { day: "Tues", open: "", close: "" },
    2: { day: "Wed", open: "", close: "" },
    3: { day: "Thurs", open: "", close: "" },
    4: { day: "Fri", open: "", close: "" },
    5: { day: "Sat", open: "", close: "" },
    6: { day: "Sun", open: "", close: "" },
  });
  // const businessHours = useSelector((state) => state.counter.businessHours); // Assuming your slice is named 'userSlice'
  console.log("HOURS DATAA NOW", Object.keys(hoursData).length > 0);
  // const dayKeys = Object.keys(businessHours);
  const finalHoursData =
    Object.keys(hoursData).length > 0 ? hoursData : businessHours;
  const dayKeys = Object.keys(finalHoursData);
  console.log("ALL DEFAULT DOORS", defaultBusinessHours);
  const showDatePicker = (event, index) => {
    // const finalBizState =
    //   event?._dispatchInstances.memoizedProps.children?.toLowerCase();
    console.log("OPEN PICKER");
    // setBusinessState({ index, event });
    setIndexy(index);
    setEventy(event);
    // setBizState({ index, finalBizState });
    setDatePickViz(true);
  };

  const hideDatePicker = () => {
    setDatePickViz(false);
  };

  const handleConfirm = (time) => {
    // const finalDays = allDays;
    // finalDays[businessState?.index][businessState?.event] = time;
    console.log("DONE BUSINESS HORUS");
    // const bizState = {
    //   index: businessState?.index,
    //   event: businessState?.event,
    //   time: new Date(time).toISOString(),
    // };
    // setAllDays({ ...finalDays });
    const hours = { ...businessHours };
    hours[indexy][eventy] = timeConvert(new Date(time).toISOString());
    // dispatch(setBusinessHours(hours));
    setBusinessHours(hours);
    hideDatePicker();
  };
  console.log("day keys now", businessHours);
  // const closeView = () => {
  //   setDatePickViz(false);
  // };
  // React.useEffect(() => {
  //   console.log("horu data changed", hoursData);
  //   setBusinessHours(defaultBusinessHours);
  // }, []);
  console.log("FINAL DAY KEYS", dayKeys);
  return (
    <ScrollView style={{ padding: 20 }}>
      {dayKeys.map((dayKey, key, all) => {
        console.log("all day keysn now", all);
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
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, textAlign: "center" }}>
                {finalHoursData[dayKey]?.day}
              </Text>

              <Pressable
                disabled={stale}
                onPress={() => showDatePicker("open", key)}
                // onPress={(event) => showDatePicker(event, key)}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? "blue" : "yellow",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  },
                ]}
              >
                <Text style={{ fontSize: 12 }}>Open</Text>
                <Text style={{ fontSize: 12 }}>
                  {finalHoursData[dayKey]?.open}
                </Text>
              </Pressable>
              <Pressable
                disabled={stale}
                onPress={() => showDatePicker("close", key)}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? "yellow" : "pink",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  },
                ]}
              >
                <Text style={{ fontSize: 12 }}>Close</Text>
                <Text style={{ fontSize: 12 }}>
                  {finalHoursData[dayKey]?.close}
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
        );
      })}
      <Pressable
        // onPress={closeView}
        onPress={() => closeView(businessHours)}
        style={{ backgroundColor: "yellow", alignItems: "center", height: 40 }}
      >
        <Text>Done</Text>
      </Pressable>
    </ScrollView>
  );
}
