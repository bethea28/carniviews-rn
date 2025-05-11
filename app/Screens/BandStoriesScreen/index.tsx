import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BandStoryForm } from "@/app/Components/BandStoryForm";
import { useNavigation } from "expo-router";
export const BandStoriesScreen = () => {
  const handlePageChange = (pageIndex) => {
    console.log(`Current page: ${pageIndex}`);
  };

  const handleAllPagesFilled = (pages) => {
    Alert.alert("All Pages Filled!", JSON.stringify(pages, null, 2));
  };
  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.navigate("BandStoryForm")}
        style={{ width: 200, height: 100, backgroundColor: "purple" }}
      >
        <Text> Add Band Story</Text>
      </TouchableOpacity>
      {/* <BandStoryForm /> */}
    </View>
  );
};
