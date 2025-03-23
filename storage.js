// import Reac

// export function BusinessHours({ closeView }) {
//     const navigation = useNavigation();
//     const [openTimePicker, setOpenTimePicker] = React.useState(false);
//     const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

//     const [days, setDays] = React.useState({
//       0: { day: "Mon", open: "", close: "" },
//       1: { day: "Tues", open: "", close: "" },
//       2: { day: "Wed", open: "", close: "" },
//       3: { day: "Thurs", open: "", close: "" },
//       4: { day: "Fri", open: "", close: "" },
//       5: { day: "Sat", open: "", close: "" },
//       6: { day: "Sun", open: "", close: "" },
//     });
//     const [bizState, setBizState] = useState({});
//     const handleTimeChange = (time) => {
//       console.log("time isn now", time.nativeEvent);
//     };

//     const dayKeys = Object.keys(days);

//     const handleOpenTimePicker = (event, index) => {
//       const text = event._dispatchInstances.memoizedProps.children;
//       console.log("event now", index, text);

//       setOpenTimePicker(true);
//     };

//     console.log("open time", openTimePicker);
//     const showDatePicker = (event, index) => {
//       console.warn("A date has been picked: ", index);
//       const finalBizState =
//         event?._dispatchInstances.memoizedProps.children?.toLowerCase();
//       console.log("fianl biz", finalBizState);
//       setBizState({ index, finalBizState });
//       setDatePickerVisibility(true);
//     };

//     const hideDatePicker = () => {
//       setDatePickerVisibility(false);
//     };

//     const handleConfirm = (time) => {
//       const finalDays = days;
//       console.log("time me out now", time);
//       finalDays[bizState?.index][bizState?.finalBizState] = time;
//       setDays({ ...finalDays });
//       hideDatePicker();
//     };

//     console.log("days final", days);
//     return (
//       <ScrollView style={{ padding: 20 }}>
//         {dayKeys.map((dayKey, key) => {
//           return (
//             <View
//               key={key}
//               style={{
//                 flexDirection: "row",
//                 backgroundColor: "red",
//                 marginTop: 10,
//                 padding: 20,
//               }}
//             >
//               <View style={{ flex: 1, backgroundColor: "blue" }}>
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     justifyContent: "space-between",
//                     alignSelf: "center",
//                   }}
//                 >
//                   <Text style={{ fontSize: 12, textAlign: "center" }}>
//                     {days[dayKey].day}
//                   </Text>
//                 </View>

//                 <View
//                   style={{
//                     flexDirection: "row",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <Text
//                     style={{ fontSize: 12 }}
//                     onPress={(event) => showDatePicker(event, key)}
//                   >
//                     Open
//                   </Text>
//                   <Text style={{ fontSize: 12 }}>
//                     {timeConvert(days[dayKey].open)}
//                   </Text>
//                 </View>
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <Text
//                     style={{ fontSize: 12 }}
//                     onPress={(event) => showDatePicker(event, key)}
//                   >
//                     Close
//                   </Text>
//                   <Text style={{ fontSize: 12 }}>
//                     {timeConvert(days[dayKey].close)}
//                   </Text>
//                 </View>
//               </View>

//               <DateTimePickerModal
//                 isVisible={isDatePickerVisible}
//                 mode="time"
//                 onConfirm={handleConfirm}
//                 onCancel={hideDatePicker}
//               />
//             </View>
//           );
//         })}
//         <Pressable
//           onPress={closeView}
//           style={{ backgroundColor: "blue", alignItems: "center" }}
//         >
//           <Text>Done</Text>
//         </Pressable>
//       </ScrollView>
//     );
//   }
