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
import { Notifier, NotifierComponents } from "react-native-notifier";
import * as ImagePicker from "expo-image-picker";
import storage from "@react-native-firebase/storage"; // Firebase storage
import RNFS from "react-native-fs"; // For file system access

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

  const uploadToFirebase = async (uri) => {
    try {
      const reference = storage().ref(
        `company_images/${Date.now()}_${uri.split("/").pop()}`
      );
      const pathToFile = `file://${uri}`;

      await reference.putFile(pathToFile);
      console.log("File uploaded to Firebase Storage!");
      const downloadURL = await reference.getDownloadURL();
      console.log("DOWN LOAD URL JOSH", downloadURL);
      return downloadURL; // Return the download URL
    } catch (error) {
      console.error("Firebase upload error:", error);
      Notifier.showNotification({
        title: "Upload Failed",
        description: "There was an error uploading your image.",
        Component: NotifierComponents.Alert,
        componentProps: { alertType: "error" },
        duration: 3000,
      });
      return null; // Indicate upload failure
    }
  };

  const pickImage = async () => {
    console.log("adding multiple images");
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: true, // Allow multiple selection
      });

      if (result.canceled || !result.assets) {
        Notifier.showNotification({
          title: "No Image Selected",
          description: "You did not select any image.",
          Component: NotifierComponents.Alert,
          componentProps: { alertType: "warn" },
          duration: 3000,
        });
        return;
      }

      const selectedImages = result?.assets;
      console.log("ASSETS Selected", selectedImages);
      const uploadPromises = selectedImages.map(async (asset) => {
        return await uploadToFirebase(asset.uri);
      });

      const downloadURLs = await Promise.all(uploadPromises);
      const validDownloadURLs = downloadURLs.filter((url) => url !== null); // Filter out failed uploads
      console.log("VALID UROS", validDownloadURLs);
      if (validDownloadURLs.length > 0) {
        const final = { imageUrls: validDownloadURLs, user, companyInfo }; // Send array of URLs
        const addImages = await addCompImage(final);
        return;
        if (addImages?.data) {
          Notifier.showNotification({
            title: "Upload Successful",
            description: "Your image(s) were uploaded successfully.",
            Component: NotifierComponents.Alert,
            componentProps: { alertType: "success" },
            duration: 3000,
          });
          setImage(selectedImages); // Update local state with selected images
        } else {
          throw new Error("Failed to upload images to backend");
        }
      } else {
        Notifier.showNotification({
          title: "Upload Failed",
          description: "No images were successfully uploaded.",
          Component: NotifierComponents.Alert,
          componentProps: { alertType: "error" },
          duration: 3000,
        });
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
          onPress={pickImage} // Use the updated pickImage function
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
