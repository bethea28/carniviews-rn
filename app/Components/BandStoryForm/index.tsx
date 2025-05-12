import React, { useState } from "react";
import { StoryCarousel } from "../StoryCarousel";
import {
  View,
  TextInput,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

const { width, height } = Dimensions.get("window");

const storyPlaceholders = {
  Title:
    "Tell us your band story good or bad. First start with a catching title to prepare us for the story that we are about to read",
  introduction:
    "Start your story! Briefly introduce the band and the event (e.g., specific Carnival year, fete, or parade). What was your initial impression or expectation?",
  vibe: "Describe the atmosphere and energy. What was the music like? How did the band's presentation make you feel? What were the people around you like?",
  costumePresentation:
    "Focus on the visual aspects. Describe your costume or the overall presentation of the band. How did it contribute to your experience?",
  memorableMoments:
    "Share one or two specific moments that stood out. Was there a particular song, interaction, or event that made the experience special or significant? Did your feelings about the band change over time?",
  reflection:
    "Conclude your story. What is your overall impression of the band and your experience? What's the most important thing you'll remember about it? Would you recommend this band to others?",
};

export function BandStoryForm() {
  const formattedStoryPlaceholders = Object.entries(storyPlaceholders);
  const [pages, setPages] = useState(
    Array(formattedStoryPlaceholders.length).fill("")
  );

  const handleChangeText = (text: string, index: number) => {
    const updated = [...pages];
    updated[index] = text;
    setPages(updated);
  };

  return (
    <>
      {/* <FlatList
        contentContainerStyle={styles.listContainer}
        data={formattedStoryPlaceholders}
        keyExtractor={(_, i) => i.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={styles.page}>
            <Text style={styles.label}>{item[0]}</Text>
            <TextInput
              style={styles.input}
              multiline
              value={pages[index]}
              onChangeText={(text) => handleChangeText(text, index)}
              placeholder={item[1]}
              textAlignVertical="top"
            />
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        }
      /> */}
      <StoryCarousel />
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 120,
  },
  page: {
    width: width,
    padding: 16,
    marginBottom: 20,
    backgroundColor: "yellow",
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    minHeight: 150,
    fontSize: 16,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  submitButton: {
    margin: 20,
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
  },
});
