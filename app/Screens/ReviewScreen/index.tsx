import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native-paper";
import { useSelector } from "react-redux";
import { useGetReviewsQuery } from "@/store/api/api";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";

const primaryColor = "#a349a4";
const secondaryColor = "#FF8C00";
const backgroundColor = "#FFB347";
const textColorPrimary = "#ffffff";
const textColorSecondary = "#333333";

export function ReviewScreen() {
  const companyInfo = useSelector((state) => state.counter.companyInfo);
  const navigation = useNavigation();
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
      <Text style={styles.displayNameText}>Reviewer: {item.displayName}</Text>
      <Text style={styles.displayNameText}>
        Review Date: {format(new Date(item.review_date), "MM/dd/yy")}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <TouchableOpacity
      style={styles.addButton}
      onPress={() => navigation.navigate("AddReviews", { companyInfo })}
    >
      <Text style={styles.addButtonText}>+ Add Review</Text>
    </TouchableOpacity>
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
        ListHeaderComponent={renderHeader}
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
