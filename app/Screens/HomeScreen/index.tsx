import {
  View,
  FlatList,
  Pressable,
  Text,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { CompanyCard } from "@/app/Components/CardComponent";
import { useNavigation } from "@react-navigation/native";
import { useGetCompaniesQuery } from "@/store/api/api";
import { SocialLoginScreen } from "../SocialLoginScreen";
import { useAsyncStorage } from "@/app/customHooks";
import { useSelector } from "react-redux";

// Define the color palette based on the image
const primaryColor = "#a349a4"; // Purple
const secondaryColor = "#f28e1c"; // Orange
const backgroundColor = "#f7b767"; // Light Orange
const textColorPrimary = "#ffffff"; // White
const textColorSecondary = "#333333"; // Dark Gray (for contrast on light orange)

export function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const {
    data: allCompanies,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCompaniesQuery();
  const [getData] = useAsyncStorage();
  const userData = useSelector((state) => state.counter.userData);
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (err) {
      console.error("Error refreshing data:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <CompanyCard
        wholeData={item}
        title={item.companyInfo.name}
        mainImage={item.mainImage}
      />
    );
  };

  if (isLoading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (isError) {
    return <Text style={styles.errorText}>Error...</Text>;
  }
  const test = async () => {
    const final = await getData("tokens");
    console.log("my tokens", final);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => navigation.navigate("AddCompany")}
          style={[styles.button, { backgroundColor: primaryColor }]}
        >
          <Text style={[styles.buttonText, { color: textColorPrimary }]}>
            Add Company
          </Text>
        </Pressable>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={primaryColor}
            />
          }
          data={allCompanies}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: backgroundColor,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    // marginBottom: 5,
  },
  button: {
    width: "45%",
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 3, // Add shadow for better visual appeal
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    flex: 1,
  },
  loadingText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 18,
    color: textColorSecondary,
    backgroundColor: backgroundColor,
    textAlign: "center",
    paddingTop: 20,
  },
  errorText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 18,
    color: "red",
    backgroundColor: backgroundColor,
    textAlign: "center",
    paddingTop: 20,
  },
});
