import React from "react";
import { View, FlatList, Pressable, Image } from "react-native";
import { Text, Button } from "react-native-paper";
import { CompanyCard } from "@/app/Components/CardComponent";
import { companyObjects } from "@/mockData";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useGetReviewsQuery } from "@/store/api/api";
import { TabComponent } from "@/app/Components/TabComponent";

export function InfoScreen({ route: { params } }) {
  const navigation = useNavigation();
  const userData = useSelector((state) => state.counter.userData);
  const { data: allCompanyReviews } = useGetReviewsQuery({
    companyId: params.id,
  });

  return (
    <View style={{ flex: 1 }}>
      <TabComponent navIndex={params.navIndex} />
    </View>
  );
}
