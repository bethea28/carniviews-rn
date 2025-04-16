import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useGetCompanyImagesQuery } from "@/store/api/api";
import { useSelector } from "react-redux";
import { useAddCompanyImagesMutation } from "@/store/api/api";
import { Notifier, Easing, NotifierComponents } from "react-native-notifier";
import * as ImagePicker from "expo-image-picker";

// Material Design-inspired color palette
const primaryColor = "#a349a4";
const primaryLightColor = "#d67bff";
const primaryDarkColor = "#751976";
const secondaryColor = "#f28e1c";
const secondaryLightColor = "#ffc04f";
const secondaryDarkColor = "#b95f00";
const backgroundColor = "#f7b767";
const textColorPrimary = "#ffffff";
const textColorSecondary = "#333333";
const errorColor = "#B00020";
const surfaceColor = "#FFFFFF";
const shadowColor = "#000";
const dividerColor = "#E0E0E0";

const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth / 2 - 24;

export const Photos = () => {
  const companyId = useSelector((state) => state.counter.companyInfo.companyId);
  const companyInfo = useSelector((state) => state.counter.companyInfo);
  const user = useSelector((state) => state.counter.userState);
  const [image, setImage] = React.useState(null);

  const {
    data: allCompanyImages,
    refetch,
    isFetching,
  } = useGetCompanyImagesQuery({ companyId });
  const [addCompImage] = useAddCompanyImagesMutation();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const parseImageUri = (image_url) => {
    try {
      const parsed = JSON.parse(image_url);
      return parsed?.uri || null;
    } catch (err) {
      return image_url;
    }
  };

  const renderItem = ({ item }) => {
    const uri = parseImageUri(item.image_url);
    return (
      <View style={styles.imageWrapper}>
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      </View>
    );
  };
  const pickImage = async () => {
    console.log("adding");

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (result.canceled) {
        Notifier.showNotification({
          title: "No Image Selected",
          description: "You did not select any image.",
          Component: NotifierComponents.Alert,
          componentProps: { alertType: "warn" },
          duration: 3000,
        });
        return;
      }

      const final = { result, user, companyInfo };
      const addImages = await addCompImage(final);

      if (addImages?.data) {
        Notifier.showNotification({
          title: "Upload Successful",
          description: "Your image(s) were uploaded successfully.",
          Component: NotifierComponents.Alert,
          componentProps: { alertType: "success" },
          duration: 3000,
        });

        setImage(result.assets);
      } else {
        throw new Error("Failed to upload images");
      }
    } catch (error) {
      console.log("Image upload error:", error);

      Notifier.showNotification({
        title: "Upload Failed",
        description: "There was a problem uploading your image(s).",
        Component: NotifierComponents.Alert,
        componentProps: { alertType: "error" },
        duration: 3000,
      });
    }
  };
  const renderHeader = () => (
    <TouchableOpacity style={styles.addButton} onPress={pickImage}>
      <Text style={styles.addButtonText}>+ Add Photos</Text>
    </TouchableOpacity>
  );

  if (!allCompanyImages?.images?.length) {
    return (
      <View style={styles.center}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => console.log("Add Photo Pressed")}
        >
          <Text style={styles.addButtonText}>+ Add Photo</Text>
        </TouchableOpacity>
        <Text style={styles.emptyText}>No photos available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={allCompanyImages.images}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl
          refreshing={refreshing || isFetching}
          onRefresh={onRefresh}
          colors={[primaryColor]}
          tintColor={primaryDarkColor}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 12,
    backgroundColor: backgroundColor,
  },
  imageWrapper: {
    flex: 1,
    margin: 6,
    borderRadius: 10,
    backgroundColor: surfaceColor,
    elevation: 3,
    shadowColor: shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: imageSize,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: backgroundColor,
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: primaryDarkColor,
    fontWeight: "bold",
    marginTop: 16,
  },
  addButton: {
    backgroundColor: primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  addButtonText: {
    color: textColorPrimary,
    fontWeight: "bold",
    fontSize: 16,
  },
});
