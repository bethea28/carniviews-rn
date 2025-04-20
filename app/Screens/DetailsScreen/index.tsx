import React from "react";
import { Text } from "react-native-paper";
import {
  View,
  Pressable,
  ImageBackground,
  Image,
  ScrollView,
  StyleSheet,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import {
  useAddCompanyImagesMutation,
  useAddRecMutation,
} from "@/store/api/api";
import { Notifier, Easing, NotifierComponents } from "react-native-notifier";

// Define the color palette based on the image (same as other components)
const primaryColor = "#a349a4"; // Purple
const secondaryColor = "#FF8C00"; // Your new, more vibrant orange (replace with actual code)
const backgroundColor = "#FFB347"; // Example lighter orange (adjust as needed)
const textColorPrimary = "#ffffff"; // White
const textColorSecondary = "#333333"; // Dark Gray

const FullAddressDisplay = ({ compInfo }) => {
  if (!compInfo) return null;

  const {
    address_line1,
    address_line2,
    city,
    region,
    postal_code,
    country,
    website,
    contact,
  } = compInfo;
  console.log("city now ", city);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.descriptionDetailsHeader}>Location</Text>
        {address_line1 !== "null" ? (
          <Text style={styles.line}>{address_line1}</Text>
        ) : undefined}
        {address_line2 ? (
          <Text style={styles.line}>{address_line2}</Text>
        ) : null}
        {city === "null" ? undefined : <Text style={styles.line}>{city}</Text>}
        {region ? <Text style={styles.line}>{region}</Text> : null}
        {postal_code ? (
          <Text style={styles.line}>{postal_code}</Text>
        ) : undefined}
        {country ? <Text style={styles.line}>{country}</Text> : null}
      </View>
      <View style={styles.container}>
        <Text style={styles.descriptionDetailsHeader}>Contacts</Text>
        {contact !== null ? (
          <Text style={styles.line}>{contact}</Text>
        ) : undefined}
        {website !== null ? (
          <Text
            onPress={() => Linking.openURL(website)}
            style={[
              styles.line,
              { color: "blue", textDecorationLine: "underline" },
            ]}
          >
            {website}
          </Text>
        ) : undefined}
      </View>
    </>
  );
};

const ImageDetails = ({ companyInfo }) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.counter.userState);
  console.log("user now", user);
  return (
    <ImageBackground
      resizeMode="cover"
      source={{
        uri: "https://www.rollingstone.com/wp-content/uploads/2022/02/0001x.jpg?w=1581&h=1054&crop=1&s",
      }}
      style={styles.imageDetailsBackground}
    >
      {/* <Text style={styles.imageDetailsTitle}>{params?.businessName}</Text> */}
      <Pressable
        onPress={() => navigation.navigate("Photos")}
        style={styles.seePhotosButton}
      >
        <Text style={styles.seePhotosText}>See all Photos </Text>
      </Pressable>
    </ImageBackground>
  );
};

const BasicDetails = () => (
  <View style={styles.basicDetailsContainer}>
    <Image
      style={styles.basicDetailsImage}
      source={{
        uri: "https://www.rollingstone.com/wp-content/uploads/2022/02/0001x.jpg?w=1581&h=1054&crop=1&s",
      }}
    />
    <Text style={styles.basicDetailsDescription}>
      {/* {params?.companyInfo.description} */}
    </Text>
  </View>
);

const DescriptionDetails = ({ companyInfo }) => (
  <View style={styles.descriptionDetailsContainer}>
    <Text style={styles.descriptionDetailsHeader}>Company Details</Text>
    <Text style={styles.descriptionDetailsText}>
      {companyInfo.compInfo.description}
    </Text>
  </View>
);

const Actions = ({ camera, action, header, companyInfo, user }) => {
  const [image, setImage] = React.useState(null);
  const navigate = useNavigation();
  const [addCompImage] = useAddCompanyImagesMutation();
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

  return (
    <View style={styles.actionsContainer}>
      <Pressable
        onPress={
          camera ? pickImage : () => navigate.navigate(action, { companyInfo })
        }
        style={({ pressed }) => [
          styles.actionButton,
          { backgroundColor: pressed ? "green" : "transparent" },
        ]}
      >
        <Image
          style={styles.actionImage}
          source={{
            uri: "https://www.rollingstone.com/wp-content/uploads/2022/02/0001x.jpg?w=1581&h=1054&crop=1&s",
          }}
        />
        <Text style={styles.actionText}>{header}</Text>
      </Pressable>
    </View>
  );
};

const Recommend = ({ companyInfo, user, handleRec }) => (
  <View style={styles.recommendContainer}>
    <Text style={styles.recommendQuestion}>Do you recommend this Band?</Text>
    <View style={styles.recommendButtons}>
      <Pressable
        onPress={() => handleRec("yes")}
        style={({ pressed }) => [
          styles.recommendButton,
          { backgroundColor: pressed ? secondaryColor : primaryColor },
        ]}
      >
        <Text style={styles.recommendButtonText}>Yes</Text>
      </Pressable>
      <Pressable
        onPress={() => handleRec("no")}
        style={({ pressed }) => [
          styles.recommendButton,
          styles.recommendButtonMargin,
          { backgroundColor: pressed ? secondaryColor : primaryColor },
        ]}
      >
        <Text style={styles.recommendButtonText}>No</Text>
      </Pressable>
      {/* <Pressable
        style={({ pressed }) => [
          styles.recommendButton,
          styles.recommendButtonMargin,
          { backgroundColor: pressed ? secondaryColor : primaryColor },
        ]}
      >
        <Text style={styles.recommendButtonText}>Maybe</Text>
      </Pressable> */}
    </View>
    <View style={styles.recommendActions}>
      <Actions
        companyInfo={companyInfo}
        camera={false}
        header="Add Review"
        action="AddReviews"
        user={user}
      />
      <Actions
        user={user}
        companyInfo={companyInfo}
        camera={true}
        header="Add Photo"
        action="AddPhotos"
      />
    </View>
  </View>
);

export function DetailsScreen() {
  const companyInfo = useSelector((state) => state.counter.companyInfo);
  const user = useSelector((state) => state.counter.userState);
  const [addRec] = useAddRecMutation();
  console.log("all company info bryanb", companyInfo);
  const handleRec = (rec) => {
    console.log("rec company id rec", companyInfo.companyId);
    const giveRec = addRec({
      userId: user.data.user.user_id,
      rec,
      companyId: companyInfo.companyId,
    });
  };
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 50 }}
      style={styles.scrollView}
    >
      <ImageDetails companyInfo={companyInfo} />
      <DescriptionDetails companyInfo={companyInfo} />
      <FullAddressDisplay compInfo={companyInfo.compInfo} />
      {/* <BasicDetails params={params} /> */}
      {/* <BusinessHours staleHours={params?.hoursData} stale={true} /> */}
      <Recommend handleRec={handleRec} companyInfo={companyInfo} user={user} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 20,
    backgroundColor: backgroundColor,
  },
  imageDetailsBackground: {
    height: 150,
    backgroundColor: "red", // Fallback color
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  imageDetailsTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: textColorPrimary,
  },
  seePhotosButton: {
    backgroundColor: secondaryColor,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    width: 150,
  },
  seePhotosText: {
    color: textColorPrimary,
  },
  basicDetailsContainer: {
    backgroundColor: textColorPrimary,
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  basicDetailsImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  basicDetailsDescription: {
    textAlign: "center",
    color: textColorSecondary,
  },
  descriptionDetailsContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: textColorPrimary,
    borderRadius: 8,
  },
  descriptionDetailsHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: textColorSecondary,
    marginBottom: 5,
  },
  descriptionDetailsText: {
    color: textColorSecondary,
  },
  actionsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  actionButton: {
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
  },
  actionImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  actionText: {
    padding: 15,
    color: textColorSecondary,
  },
  recommendContainer: {
    marginTop: 20,
    alignItems: "center",
    padding: 15,
    backgroundColor: textColorPrimary,
    borderRadius: 8,
  },
  recommendQuestion: {
    fontSize: 16,
    fontWeight: "bold",
    color: textColorSecondary,
    marginBottom: 10,
  },
  recommendButtons: {
    flexDirection: "row",
    marginBottom: 15,
  },
  recommendButton: {
    borderWidth: 2,
    borderColor: primaryColor,
    backgroundColor: textColorPrimary,
    borderRadius: 8,
  },
  recommendButtonText: {
    fontSize: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: textColorSecondary,
  },
  recommendButtonMargin: {
    marginLeft: 10,
  },
  recommendActions: {
    flexDirection: "row",
    marginTop: 20,
  },
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    marginVertical: 10,
  },
  line: {
    fontSize: 16,
    color: "#333",
    marginBottom: 2,
  },
});
