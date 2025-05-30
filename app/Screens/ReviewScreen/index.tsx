import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { Text } from "react-native-paper";
import { useSelector } from "react-redux";
import { useGetReviewsQuery } from "@/store/api/api";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import Icon from "react-native-vector-icons/EvilIcons";
import { useAddReviewAgreementMutation } from "@/store/api/api";
const primaryColor = "#a349a4";
const secondaryColor = "#FF8C00";
const backgroundColor = "#FFB347";
const textColorPrimary = "#ffffff";
const textColorSecondary = "#333333";

export function ReviewScreen() {
  const companyInfo = useSelector((state) => state.counter.companyInfo);
  const userData = useSelector((state) => state.counter.userState);
  const [addRevAgreem] = useAddReviewAgreementMutation();
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
  const handleAgreement = async (agreem, item) => {
    console.log("agreement handle", item.id);
    const addAgreem = await addRevAgreem({
      agreem,
      reviewId: item.id,
      userId: userData.data.user.user_id,
    });
  };
  const renderItem = ({ item, index }) => {
    console.log("tewst index", index);

    return (
      <View style={styles.reviewContainer}>
        <ScrollView style={{ maxHeight: 300 }}>
          <Text style={styles.reviewText}>Review: {item.review}</Text>
        </ScrollView>
        <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
          <Text
            style={[
              styles.ratingText,
              { alignSelf: "center", marginBottom: 8 },
            ]}
          >
            Ratings {item.rating}
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Amenities:</Text>
            <StarRatingDisplay rating={item.amenities} starSize={20} />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Food/Drinks:</Text>
            <StarRatingDisplay rating={item.food} starSize={20} />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Music:</Text>
            <StarRatingDisplay rating={item.music} starSize={20} />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Costume Pickup:</Text>
            <StarRatingDisplay rating={item.pickup} starSize={20} />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Vibes/Energy:</Text>
            <StarRatingDisplay rating={item.vibes} starSize={20} />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Price:</Text>
            <StarRatingDisplay rating={item.price} starSize={20} />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Customer Service:</Text>
            <StarRatingDisplay rating={item.service} starSize={20} />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Value for Money:</Text>
            <StarRatingDisplay rating={item.value} starSize={20} />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Costume Quality:</Text>
            <StarRatingDisplay rating={item.costume} starSize={20} />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Overall Experience:</Text>
            <StarRatingDisplay rating={item.overall} starSize={20} />
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={styles.displayNameText}>
              Reviewer: {item.displayName}
            </Text>
            <Text style={styles.displayNameText}>
              Review Date: {format(new Date(item.review_date), "MM/dd/yy")}
            </Text>
          </View>
        </View>
        <Text style={{ alignSelf: "center", marginTop: 8 }}>
          Agree With Review
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 16,
            paddingHorizontal: 120,
          }}
        >
          <Pressable onPress={() => handleAgreement("like", item)}>
            <Icon size={30} name="like" color="green" />
          </Pressable>

          <Pressable
            onPress={() => handleAgreement("dislike", item)}
            style={{ transform: [{ rotate: "180deg" }] }}
          >
            <Icon color="red" size={30} name="like" />
          </Pressable>
        </View>
      </View>
    );
  };

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
  console.log("all REVIEWS user data", allCompanyReviews.overallAvg);
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
    backgroundColor: "red",
    fontSize: 16,
    color: textColorSecondary,
    marginBottom: 5,
    // maxHeight: 300,
    // overflowY: "scroll",
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
