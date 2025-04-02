import React from "react";
import { View, FlatList, Pressable, Image } from "react-native";
import { Text, Button } from "react-native-paper";
import { CompanyCard } from "@/app/Components/CardComponent";
import { companyObjects } from "@/mockData";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useGetReviewsQuery } from "@/store/api/api";
import { TabComponent } from "@/app/Components/TabComponent";

export function ReviewScreen({ route: { params } }) {
  const navigation = useNavigation();
  const userData = useSelector((state) => state.counter.userData);
  const { data: allCompanyReviews } = useGetReviewsQuery({
    companyId: params.id,
  });
  console.log("USER DATA", userData);
  console.log("PARAMS NOW ", allCompanyReviews);
  React.useEffect(() => {
    const getReviews = async () => {
      try {
        // const req = await getCompanyReviews({ companyId });
      } catch (err) {
        console.log("err", err);
      }
    };
    getReviews();
  }, []);
  return (
    <View style={{ padding: 20 }}>
      <TabComponent />
      <Text>review screen</Text>
      <Pressable
        onPress={() => navigation.navigate("AddReviews")}
        style={({ pressed }) => [
          { backgroundColor: pressed ? "red" : "green" },
        ]}
      >
        <Text> Add Review</Text>
      </Pressable>
      {allCompanyReviews?.reviews.map((review) => {
        return (
          <View style={{ marginTop: 10, backgroundColor: "yellow" }}>
            <Text>Review: {review.review}</Text>
            <Text>Rating: {review.rating}</Text>
            <Text>Display Name: {review.displayName}</Text>
          </View>
        );
      })}
    </View>
  );
}
