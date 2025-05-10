import storage from "@react-native-firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { Notifier, Easing, NotifierComponents } from "react-native-notifier";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

// export const useImagePicker = () => {
//   const [allImages, setAllImages] = useState([]);
//   const [error, setError] = useState(null);

//   const pickImages = async () => {
//     try {
//       let result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ["images", "videos"],
//         aspect: [4, 3],
//         quality: 1,
//         allowsMultipleSelection: true,
//       });

//       if (!result.canceled && result.assets && result.assets.length > 0) {
//         setAllImages(result.assets);
//       }
//     } catch (err) {
//       setError(err);
//       console.error("Image picking error:", err);
//     }
//   };

//   return { pickImages, allImages, error };
// };

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

// import { useState } from "react";
// import * as ImagePicker from "expo-image-picker";
// import { Notifier, NotifierComponents } from "react-native-notifier";

export const uploadToFirebase = async (uri) => {
  try {
    const reference = storage().ref(
      `company_images/${Date.now()}_${uri.split("/").pop()}`
    );
    const pathToFile = `file://${uri}`;
    await reference.putFile(pathToFile);
    return await reference.getDownloadURL();
  } catch (error) {
    console.error("Firebase upload error:", error);
    Notifier.showNotification({
      title: "Upload Failed",
      description: "There was an error uploading your image.",
      Component: NotifierComponents.Alert,
      componentProps: { alertType: "error" },
      duration: 3000,
    });
    return null;
  }
};

export const useImagePickerUploader = ({ user, companyInfo, addCompImage }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const pickAndUploadImages = async () => {
    console.log("add press hook");
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: true,
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

      const selected = result.assets;

      // Confirm with the user before uploading
      Alert.alert(
        "Confirm Upload",
        `You selected ${selected.length} image(s). Do you want to upload them?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Submit",
            onPress: async () => {
              setUploading(true);

              const uploadPromises = selected.map((asset) =>
                uploadToFirebase(asset.uri)
              );
              const downloadURLs = await Promise.all(uploadPromises);
              const validURLs = downloadURLs.filter((url) => url !== null);

              if (validURLs.length > 0) {
                const finalPayload = {
                  imageUrls: validURLs,
                  user,
                  companyInfo,
                };

                const response = await addCompImage(finalPayload);

                if (response?.data) {
                  Notifier.showNotification({
                    title: "Upload Successful",
                    description: "Your image(s) were uploaded successfully.",
                    Component: NotifierComponents.Alert,
                    componentProps: { alertType: "success" },
                    duration: 3000,
                  });
                  setSelectedImages(selected);
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

              setUploading(false);
            },
          },
        ]
      );
    } catch (error) {
      console.error("pickAndUploadImages error:", error);
      Notifier.showNotification({
        title: "Upload Failed",
        description: "There was a problem uploading your image(s).",
        Component: NotifierComponents.Alert,
        componentProps: { alertType: "error" },
        duration: 3000,
      });
      setUploading(false);
    }
  };

  return {
    pickAndUploadImages,
    selectedImages,
    uploading,
  };
};

// export const useImagePickerLoaderWithSubmit = () => {
//   const [images, setImages] = useState([]);
//   const [finalImages, setFinalImages] = useState([]);
//   const [validURLs, setValidURLs] = useState([]);
//   const [uploading, setUploading] = useState(false);

//   const pickAndUploadImages = async ({ user, companyInfo, addCompImage }) => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ["images"],
//         allowsMultipleSelection: true,
//         quality: 1,
//         aspect: [4, 3],
//       });

//       if (result.canceled || !result.assets?.length) {
//         Notifier.showNotification({
//           title: "No Image Selected",
//           description: "You did not select any image.",
//           Component: NotifierComponents.Alert,
//           componentProps: { alertType: "warn" },
//           duration: 3000,
//         });
//         return [];
//       }

//       const selectedImages = result.assets;
//       setImages(selectedImages);

//       setUploading(true);
//       console.log("modeling", selectedImages);
//       // return;
//       // Replace this with your actual upload logic
//       const valid = await uploadToServer(selectedImages, {
//         user,
//         companyInfo,
//         addCompImage,
//       });
//       console.log("POST IRLS burner", valid);
//       return;
//       setValidURLs(valid);
//       setFinalImages(valid);

//       return valid;
//     } catch (error) {
//       console.error("Image Picker or Upload Error:", error);
//       Notifier.showNotification({
//         title: "Error",
//         description: "There was an error selecting or uploading images.",
//         Component: NotifierComponents.Alert,
//         componentProps: { alertType: "error" },
//         duration: 3000,
//       });
//       return [];
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Dummy upload function placeholder
//   const uploadToServer = async (
//     images,
//     { user, companyInfo, addCompImage }
//   ) => {
//     try {
//       const uploadPromises = images.map((img) => uploadToFirebase(img.uri));
//       const downloadURLs = await Promise.all(uploadPromises);
//       const validURLs = downloadURLs.filter((url) => url !== null);

//       // Optionally submit each valid URL to the backend
//       if (addCompImage && validURLs.length) {
//         for (const url of validURLs) {
//           await addCompImage({
//             variables: {
//               imageUrl: url,
//               userId: user?.id,
//               companyId: companyInfo?.id,
//             },
//           });
//         }
//       }

//       return validURLs;
//     } catch (error) {
//       console.error("Upload to server failed:", error);
//       return [];
//     }
//   };

//   return {
//     pickAndUploadImages,
//     finalImages,
//     validURLs,
//     images,
//     uploading,
//   };
// };

// import { useState } from "react";
// import * as ImagePicker from "expo-image-picker";
// import { Notifier, NotifierComponents } from "react-native-notifier";

export const useImagePickerLoaderWithSubmit = () => {
  const [selectedImage, setSelectedImage] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsMultipleSelection: false,
        quality: 1,
        aspect: [4, 3],
      });
      if (!result.canceled && result.assets?.length) {
        console.log("set select holly", result);
        setSelectedImage(result?.assets);
      } else {
        Notifier.showNotification({
          title: "No Image Selected",
          description: "You did not select any image.",
          Component: NotifierComponents.Alert,
          componentProps: { alertType: "warn" },
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Image Picker Error:", error);
      Notifier.showNotification({
        title: "Error",
        description: "There was an error selecting images.",
        Component: NotifierComponents.Alert,
        componentProps: { alertType: "error" },
        duration: 3000,
      });
    }
  };

  // return;
  console.log("RESULTS NOW select damn ", selectedImage);
  // return;
  const uploadImage = async (image) => {
    if (!image?.uri) return null;
    console.log("moeny");
    setUploading(true);
    try {
      const url = await uploadToFirebase(image.uri);
      console.log("dirty bitch", url);
      setUploadedUrl(url);
      return url;
    } catch (error) {
      console.error("Upload Error:", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setUploadedUrl(null);
    setUploading(false);
  };
  // console.log("BRYAN BETHEA", selectedImage, uploadedUrl, uploadImage);
  return {
    selectedImage,
    uploadedUrl,
    // uploading,
    pickImage,
    uploadImage,
    // reset,
  };
};
