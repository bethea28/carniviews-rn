import React from "react";
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import { Text } from "react-native-paper";
import { useSelector } from "react-redux";
import { useGetReviewsQuery } from "@/store/api/api";

const primaryColor = "#a349a4";
const secondaryColor = "#FF8C00";
const backgroundColor = "#FFB347";
const textColorPrimary = "#ffffff";
const textColorSecondary = "#333333";

export function ReviewScreen() {
  const companyInfo = useSelector((state) => state.counter.companyInfo);

  const {
    data: allCompanyReviews,
    isLoading,
    isError,
    refetch,
    isFetching,
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

  if (isLoading && !isFetching) {
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
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={primaryColor}
            colors={[primaryColor]}
          />
        }
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
    paddingBottom: 20,
  },
  reviewContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: textColorPrimary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  reviewText: {
    fontSize: 16,
    color: textColorSecondary,
    marginBottom: 5,
  },
  ratingText: {
    fontSize: 14,
    color: primaryColor,
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
