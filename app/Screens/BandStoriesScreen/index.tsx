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
import { TextInput } from "react-native-paper";
import { Dimensions } from "react-native";

const screenHeight = Dimensions.get("window").height;

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
        <Text numberOfLines={5} style={styles.intro} ellipsizeMode="tail">
          {story.intro}
        </Text>
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
          <ScrollView
            style={{ maxHeight: screenHeight - 140 }} // adjust based on footer/header
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
          >
            {selectedStory &&
              [
                { label: "Title", content: selectedStory.title },
                { label: "Intro", content: selectedStory.intro },
                { label: "Vibe", content: selectedStory.vibe },
                { label: "Costume", content: selectedStory.costume },
                { label: "Moments", content: selectedStory.moments },
                { label: "Reflection", content: selectedStory.reflection },
              ].map(
                ({ label, content }) =>
                  content && (
                    <View key={label} style={styles.modalSection}>
                      <Text style={styles.modalSectionHeader}>{label}:</Text>
                      <Text style={styles.modalSectionText}>{content}</Text>
                    </View>
                  )
              )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              onPress={() => selectedStory?.id && handleClap(selectedStory.id)}
              style={[styles.footerButton, { backgroundColor: primaryColor }]}
            >
              <Text style={styles.footerButtonText}>
                👏 Clap ({claps[selectedStory?.id] || selectedStory?.claps || 0}
                )
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={closeStoryModal}
              style={[styles.footerButton, { backgroundColor: secondaryColor }]}
            >
              <Text style={styles.footerButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: primaryDarkColor,
    marginBottom: 12,
    textAlign: "center",
  },

  modalSection: {
    marginBottom: 20,
  },
  modalSectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: primaryDarkColor,
    marginBottom: 4,
  },
  modalSectionText: {
    fontSize: 16,
    lineHeight: 22,
    color: textColorSecondary,
  },

  modalFooter: {
    position: "absolute", // Make sure footer is at the bottom
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: surfaceColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: dividerColor,
  },
  footerButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
  },
  footerButtonText: {
    color: textColorPrimary,
    fontWeight: "bold",
    fontSize: 16,
  },

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
    backgroundColor: "transparent",
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
    backgroundColor: surfaceColor,
  },

  modalContent: {
    padding: 20,
    paddingBottom: 80, // Space for footer.  Adjust as needed.
  },

  // modalSection: {
  //   marginBottom: 20,
  // },
  // modalSectionHeader: {
  //   fontSize: 18,
  //   fontWeight: "bold",
  //   color: primaryDarkColor,
  //   marginBottom: 4,
  // },
  // modalSectionText: {
  //   fontSize: 16,
  //   lineHeight: 22,
  //   color: textColorSecondary,
  // },
});
