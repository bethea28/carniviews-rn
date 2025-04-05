import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useSelector } from "react-redux";
import { useGetReviewsQuery } from "@/store/api/api";
// Define the color palette based on the image (updated orange)
const primaryColor = "#a349a4"; // Purple (remains the same unless you want to change it)
const secondaryColor = "#FF8C00"; // Your new, more vibrant orange
const backgroundColor = "#FFB347"; // An example of a lighter shade of your new orange
const textColorPrimary = "#ffffff"; // White
const textColorSecondary = "#333333"; // Dark Gray
export function ReviewScreen({ route: { params } }) {
  const companyInfo = useSelector((state) => state.counter.companyInfo);
  const {
    data: allCompanyReviews,
    isLoading,
    isError,
  } = useGetReviewsQuery({
    companyId: companyInfo?.companyId,
  });

  const renderItem = ({ item }) => (
    <View style={styles.reviewContainer}>
      <Text style={styles.reviewText}>Review: {item.review}</Text>
      <Text style={styles.ratingText}>Rating: {item.rating}</Text>
      <Text style={styles.displayNameText}>
        Display Name: {item.displayName}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading Reviews...</Text>
      </View>
    );
  }

  if (isError || !allCompanyReviews?.reviews) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Failed to load reviews.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={allCompanyReviews.reviews}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: backgroundColor,
  },
  flatListContent: {
    paddingBottom: 20, // Optional: Add some padding at the end of the list
  },
  reviewContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: textColorPrimary, // Assuming review cards are white
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd", // Light gray border
  },
  reviewText: {
    fontSize: 16,
    color: textColorSecondary,
    marginBottom: 5,
  },
  ratingText: {
    fontSize: 14,
    color: primaryColor, // Highlight the rating
    fontWeight: "bold",
    marginBottom: 3,
  },
  displayNameText: {
    fontSize: 12,
    color: "gray",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: textColorSecondary,
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});
