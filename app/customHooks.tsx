import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useImagePicker = () => {
  const [allImages, setAllImages] = useState([]);
  const [error, setError] = useState(null);

  const pickImages = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAllImages(result.assets);
      }
    } catch (err) {
      setError(err);
      console.error("Image picking error:", err);
    }
  };

  return { pickImages, allImages, error };
};

export const useBusinessHours = () => {
  const [allDays, setAllDays] = React.useState({
    0: { day: "Mon", open: "", close: "" },
    1: { day: "Tues", open: "", close: "" },
    2: { day: "Wed", open: "", close: "" },
    3: { day: "Thurs", open: "", close: "" },
    4: { day: "Fri", open: "", close: "" },
    5: { day: "Sat", open: "", close: "" },
    6: { day: "Sun", open: "", close: "" },
  });
  const [businessState, setBusinessState] = useState({});
  const [datePickerVis, setDatePickerVis] = useState(false);

  return {
    allDays,
    businessState,
    setBusinessState,
    setAllDays,
    datePickerVis,
    setDatePickerVis,
  };
};

export const timeConvert = (isoString) => {
  // 9:30 ex
  if (!isoString) return "";
  const formattedTime = new Date(isoString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  console.log(formattedTime); // Output: "6:15 PM"
  return formattedTime;
};
export const useAsyncStorage = () => {
  const storeData = async (key, value) => {
    console.log("storeData called with key:", key, "value:", value); // Debugging log
    try {
      const finalVal = JSON.stringify(value);
      await AsyncStorage.setItem(key, finalVal);
    } catch (e) {
      console.log("store erorr", e);
    }
  };
  const getData = async (key) => {
    console.log("getData called with key:", key); // Debugging log
    try {
      const value = await AsyncStorage.getItem(key);
      const parsed = JSON.parse(value);
      console.log("parsed value: ", parsed);
      return parsed;
    } catch (e) {
      console.log("get erorr", e);
      console.log("e", e);
      return null;
    }
  };
  return [storeData, getData];
};
