import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { useNavigation } from "expo-router";
import { useGetBandStoriesQuery, useAddClapsMutation } from "@/store/api/api";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// Color Scheme
const primaryColor = "#a349a4";
const primaryLightColor = "#d67bff";
const primaryDarkColor = "#751976";
const secondaryColor = "#f28e1c";
const backgroundColor = "#f7b767";
const textColorPrimary = "#ffffff";
const textColorSecondary = "#333333";
const errorColor = "#B00020";
const surfaceColor = "#FFFFFF";
const dividerColor = "#E0E0E0";

const StoryCard = ({ story, storyCardPress, handleClap, claps }) => {
  return (
    <View style={styles.storyCardContainer}>
      <TouchableOpacity
        style={styles.storyCard}
        onPress={() => storyCardPress(story)}
      >
        <Text style={styles.title}>{story.title}</Text>
        <Text style={styles.intro}>{story.intro}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.clapButton}
        onPress={() => handleClap(story.id)}
      >
        <Text style={styles.clapCount}>
          {claps[story.id] || story.claps || 0}
        </Text>
        <Icon color="red" size={30} name="hand-clap" />
      </TouchableOpacity>
    </View>
  );
};

export const BandStoriesScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [claps, setClaps] = useState({});

  const company = useSelector((state) => state.counter.companyInfo);
  const {
    data: bandStories,
    isLoading,
    isError,
    refetch,
  } = useGetBandStoriesQuery({ compId: company.companyId });
  const [addClaps] = useAddClapsMutation();
  const navigation = useNavigation();

  useEffect(() => {
    if (bandStories) {
      const initialClaps = bandStories.reduce((acc, story) => {
        acc[story.id] = story.claps || 0;
        return acc;
      }, {});
      setClaps(initialClaps);
    }
  }, [bandStories]);

  const openStoryModal = (story) => {
    setSelectedStory(story);
    setModalVisible(true);
  };

  const closeStoryModal = () => {
    setModalVisible(false);
    setSelectedStory(null);
  };

  const handleClap = async (storyId) => {
    setClaps((prevClaps) => ({
      ...prevClaps,
      [storyId]: (prevClaps[storyId] || 0) + 1,
    }));
    try {
      await addClaps({
        id: storyId,
        type: "story",
      });
    } catch (error) {
      console.error("Error adding clap:", error);
      // Optionally revert the local clap count on error
      setClaps((prevClaps) => ({
        ...prevClaps,
        [storyId]: Math.max((prevClaps[storyId] || 1) - 1, 0),
      }));
    }
  };

  if (isLoading)
    return <Text style={styles.loadingText}>Loading Band Stories...</Text>;
  if (isError)
    return <Text style={styles.errorText}>Error loading Band Stories.</Text>;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("BandStoryForm")}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>Add Band Story</Text>
        </TouchableOpacity>
      </View>

      {bandStories && bandStories.length > 0 ? (
        <FlatList
          data={bandStories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <StoryCard
              story={item}
              storyCardPress={openStoryModal}
              handleClap={handleClap}
              claps={claps}
            />
          )}
        />
      ) : (
        <Text style={styles.noStoriesText}>
          No band stories available for this company.
        </Text>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeStoryModal}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedStory?.title}</Text>
            <Text style={styles.modalText}>{selectedStory?.intro}</Text>
            <Text style={styles.modalText}>{selectedStory?.moments}</Text>
            <Text style={styles.modalText}>{selectedStory?.reflection}</Text>
            <Text style={styles.modalText}>{selectedStory?.vibe}</Text>
          </ScrollView>
          <TouchableOpacity
            onPress={() => selectedStory?.id && handleClap(selectedStory.id)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Clap</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={closeStoryModal}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: backgroundColor,
  },
  addButton: {
    backgroundColor: primaryColor,
    width: 160,
    height: 45,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  addButtonText: {
    color: textColorPrimary,
    fontWeight: "bold",
  },
  storyCardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: surfaceColor,
    padding: 16,
    marginBottom: 10,
    borderRadius: 6,
    borderColor: dividerColor,
    borderWidth: 1,
    elevation: 2,
    justifyContent: "space-between",
  },
  storyCard: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: primaryDarkColor,
    marginBottom: 8,
  },
  intro: {
    fontSize: 14,
    color: textColorSecondary,
  },
  clapButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  clapCount: {
    fontSize: 16,
    color: textColorSecondary,
    marginBottom: 5,
  },
  loadingText: {
    color: textColorSecondary,
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    color: errorColor,
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  noStoriesText: {
    color: textColorSecondary,
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: surfaceColor,
  },
  modalContent: {
    flexGrow: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: primaryDarkColor,
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 22,
    color: textColorSecondary,
  },
  closeButton: {
    backgroundColor: secondaryColor,
    padding: 14,
    alignItems: "center",
    borderRadius: 6,
    marginTop: 24,
  },
  closeButtonText: {
    color: textColorPrimary,
    fontWeight: "bold",
    fontSize: 16,
  },
});
