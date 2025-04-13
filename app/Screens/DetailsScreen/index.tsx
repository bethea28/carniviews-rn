import React from "react";
import { Text } from "react-native-paper";
import {
  View,
  Pressable,
  ImageBackground,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";

// Define the color palette based on the image (same as other components)
const primaryColor = "#a349a4"; // Purple
const secondaryColor = "#FF8C00"; // Your new, more vibrant orange (replace with actual code)
const backgroundColor = "#FFB347"; // Example lighter orange (adjust as needed)
const textColorPrimary = "#ffffff"; // White
const textColorSecondary = "#333333"; // Dark Gray

const ImageDetails = ({ params }) => {
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
      <Text style={styles.imageDetailsTitle}>{params?.businessName}</Text>
      <Pressable
        onPress={() => navigation.navigate("Photos")}
        style={styles.seePhotosButton}
      >
        <Text style={styles.seePhotosText}>See all Photos </Text>
      </Pressable>
    </ImageBackground>
  );
};

const BasicDetails = ({ params }) => (
  <View style={styles.basicDetailsContainer}>
    <Image
      style={styles.basicDetailsImage}
      source={{
        uri: "https://www.rollingstone.com/wp-content/uploads/2022/02/0001x.jpg?w=1581&h=1054&crop=1&s",
      }}
    />
    <Text style={styles.basicDetailsDescription}>
      {params?.companyInfo.description}
    </Text>
  </View>
);

const DescriptionDetails = ({ companyInfo }) => (
  <View style={styles.descriptionDetailsContainer}>
    <Text style={styles.descriptionDetailsHeader}>Info Details</Text>
    <Text style={styles.descriptionDetailsText}>
      {companyInfo.companyDescription}
    </Text>
  </View>
);

const Actions = ({ camera, action, header, params }) => {
  const [image, setImage] = React.useState(null);
  const navigate = useNavigation();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets) {
      setImage(result.assets);
    }
  };

  return (
    <View style={styles.actionsContainer}>
      <Pressable
        onPress={
          camera
            ? pickImage
            : () => navigate.navigate(action, { companyData: params })
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

const Recommend = ({ params }) => (
  <View style={styles.recommendContainer}>
    <Text style={styles.recommendQuestion}>
      Do you recommend this business?
    </Text>
    <View style={styles.recommendButtons}>
      <Pressable
        style={({ pressed }) => [
          styles.recommendButton,
          { backgroundColor: pressed ? "red" : "green" },
        ]}
      >
        <Text style={styles.recommendButtonText}>Yes</Text>
      </Pressable>
      <Pressable style={[styles.recommendButton, styles.recommendButtonMargin]}>
        <Text style={styles.recommendButtonText}>No</Text>
      </Pressable>
      <Pressable style={[styles.recommendButton, styles.recommendButtonMargin]}>
        <Text style={styles.recommendButtonText}>Maybe</Text>
      </Pressable>
    </View>
    <View style={styles.recommendActions}>
      <Actions
        params={params}
        camera={false}
        header="Add Review"
        action="AddReviews"
      />
      <Actions
        params={params}
        camera={true}
        header="Add Photo"
        action="AddPhotos"
      />
    </View>
  </View>
);

export function DetailsScreen({ route: { params } }) {
  const companyInfo = useSelector((state) => state.counter.companyInfo);

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 50 }}
      style={styles.scrollView}
    >
      <ImageDetails params={params} />
      <DescriptionDetails companyInfo={companyInfo} />
      {/* <BasicDetails params={params} /> */}
      {/* <BusinessHours staleHours={params?.hoursData} stale={true} /> */}
      <Recommend params={params} />
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
});
