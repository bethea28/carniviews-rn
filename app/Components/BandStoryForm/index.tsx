import React, { useState } from "react";
import {
  View,
  TextInput,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  SafeAreaView,
} from "react-native";
import { useAddBandStoryMutation } from "@/store/api/api";
import { useNavigation } from "expo-router";
import { useSelector } from "react-redux";
const { width } = Dimensions.get("window");

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
  const [addBandStory] = useAddBandStoryMutation();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [modalText, setModalText] = useState("");
  const user = useSelector((state) => state.counter.userState);
  const company = useSelector((state) => state.counter.companyInfo);
  const navigation = useNavigation();
  const openModal = (index: number) => {
    setCurrentIndex(index);
    setModalText(pages[index]);
    setModalVisible(true);
  };

  const saveModalText = () => {
    if (currentIndex !== null) {
      const updated = [...pages];
      updated[currentIndex] = modalText;
      setPages(updated);
    }
    setModalVisible(false);
  };
  console.log("index now", pages);

  const handlePress = async () => {
    console.log("handle press", pages);
    const final = {
      pages,
      userId: user.data.user.user_id,
      companyId: company.companyId,
    };
    const addingBandStory = await addBandStory(final);
    navigation.goBack();
    // setPages(["", "", "", "", "", ""]);
  };

  console.log("comapny store", company.companyId);
  return (
    <SafeAreaView>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={formattedStoryPlaceholders}
        keyExtractor={(_, i) => i.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={styles.page}>
              <Text style={styles.label}>{item[0]}</Text>
              <TouchableOpacity onPress={() => openModal(index)}>
                <View style={styles.fakeInput}>
                  <Text style={{ color: pages[index] ? "#000" : "#999" }}>
                    {pages[index] || item[1]}
                  </Text>
                </View>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        )}
        ListFooterComponent={
          <TouchableOpacity onPress={handlePress} style={styles.submitButton}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        }
      />

      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          {currentIndex !== null && (
            <>
              <Text style={styles.modalTitle}>
                {formattedStoryPlaceholders[currentIndex][0]}
              </Text>
              <TextInput
                style={styles.modalInput}
                multiline
                placeholder={formattedStoryPlaceholders[currentIndex][1] || ""}
                value={modalText}
                onChangeText={setModalText}
                textAlignVertical="top"
                maxLength={currentIndex === 0 ? 140 : undefined} // <-- limits to 500 characters
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={saveModalText}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
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
  fakeInput: {
    minHeight: 150,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    justifyContent: "flex-start",
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
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    elevation: 2,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  modalButton: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
