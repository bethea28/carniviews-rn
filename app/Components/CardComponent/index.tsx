import * as React from "react";
import { Avatar } from "react-native-paper";
import { Pressable, View, StyleSheet, Text, Image, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { setCompanyInfo } from "@/store/globalState/globalState";
import { useDispatch, useSelector } from "react-redux";
import StarRatingDisplay from "react-native-star-rating-widget";
import { useGetReviewsQuery } from "@/store/api/api";

const colors = {
  primary: "#a349a4",
  primaryLight: "#d67bff",
  primaryDark: "#751976",
  secondary: "#f28e1c",
  secondaryLight: "#ffc04f",
  background: "#f7b767",
  textPrimary: "#ffffff",
  textSecondary: "#333333",
  surface: "#FFFFFF",
  disabled: "#E0E0E0",
};

export const CompanyCard = ({ title, mainImage, wholeData }) => {
  const { data: allCompanyReviews } = useGetReviewsQuery({ companyId: wholeData.id });
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();

  const handleNavigate = (navIndex) => {
    dispatch(setCompanyInfo(wholeData));
    navigation.navigate("Info", { wholeData, navIndex });
  };

  const overallAvg = wholeData.companyInfo.overall_avg || 0;
  const bandStories = wholeData.companyInfo.bandStories || 0;
  const reviewCount = allCompanyReviews?.reviews?.length || 0;

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <Image
        style={styles.cover}
        source={{
          uri: mainImage || "https://carnivaltribe.com/wp-content/uploads/2024/07/Tribe25-Group-Hero-02.jpg",
        }}
        onError={(err) => console.log("Image load error:", err)}
      />

      <View style={styles.ratingSection}>
        <Text style={styles.ratingText}>{overallAvg.toFixed(1)} Overall Experience</Text>
        <StarRatingDisplay rating={overallAvg} starSize={20} starStyle={{ marginHorizontal: 1 }} />
        <Text style={styles.subInfo}>{reviewCount} Reviews • {bandStories} Band Stories</Text>
      </View>

      <View style={[styles.actionsContainer, width < 400 && { flexDirection: "column" }]}>
        <CustomButton label="Details" onPress={() => handleNavigate(0)} />
        <CustomButton label={`Reviews`} onPress={() => handleNavigate(1)} />
        <CustomButton label={`Band Stories`} onPress={() => handleNavigate(2)} />
      </View>
    </View>
  );
};

const CustomButton = ({ label, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.button,
      { backgroundColor: pressed ? colors.secondaryLight : colors.primary },
    ]}
    android_ripple={{ color: colors.primaryDark }}
  >
    <Text style={styles.buttonText}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    elevation: 3,
    overflow: "hidden",
    marginBottom: 16,
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textSecondary,
  },
  cover: {
    height: 180,
    width: "100%",
  },
  ratingSection: {
    padding: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 4,
  },
  subInfo: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    minWidth: 100,
    alignItems: "center",
    marginVertical: 4,
  },
  buttonText: {
    color: colors.textPrimary,
    fontWeight: "bold",
    fontSize: 14,
  },
});
