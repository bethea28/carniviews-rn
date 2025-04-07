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
import { useAsyncStorage } from "@/app/customHooks";
import { useSelector } from "react-redux";

// Define a Material Design inspired color palette
const primaryColor = "#a349a4"; // Purple 500 (approx.)
const primaryLightColor = "#d67bff"; // Purple 200 (approx.)
const primaryDarkColor = "#751976"; // Purple 700 (approx.)
const secondaryColor = "#f28e1c"; // Orange A200 (approx.)
const secondaryLightColor = "#ffc04f"; // Orange A100 (approx.)
const secondaryDarkColor = "#b95f00"; // Orange A400 (approx.)
const backgroundColor = "#f7b767"; // Light Orange 200 (approx.)
const textColorPrimary = "#ffffff"; // White
const textColorSecondary = "#333333"; // Dark Gray
const errorColor = "#B00020"; // Red 600
const surfaceColor = "#FFFFFF"; // White (for cards, buttons)
const shadowColor = "#000";
const dividerColor = "#E0E0E0"; // Grey 300

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
  const userData = useSelector((state) => state.counter.userState);
  const userName = userData?.data?.user?.name || "Guest"; // Handle potential undefined user

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
      <View style={styles.cardWrapper}>
        <CompanyCard
          wholeData={item}
          title={item.companyInfo.name}
          mainImage={item.mainImage}
          style={styles.companyCard}
        />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: backgroundColor }]}
      >
        <ActivityIndicator size="large" color={primaryColor} />
        <Text style={[styles.loadingText, { color: textColorSecondary }]}>
          Loading Companies...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={[styles.errorContainer, { backgroundColor: backgroundColor }]}
      >
        <Text style={[styles.errorText, { color: errorColor }]}>
          Error loading companies.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: secondaryColor }]}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi {userName}!</Text>
        <Text style={styles.title}>Welcome To TriniViews!</Text>
        <Text style={styles.title}>
          Let Us Help You Find Your Next Carnival Costume!
        </Text>
      </View>
      {/* <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => navigation.navigate("AddCompany")}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? primaryLightColor : primaryColor },
          ]}
          android_ripple={{ color: primaryDarkColor }}
        >
          <Text style={[styles.buttonText, { color: textColorPrimary }]}>
            Add Company
          </Text>
        </Pressable>
      </View> */}
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
        keyExtractor={(item) =>
          item?.companyInfo?.id?.toString() || Math.random().toString()
        }
        contentContainerStyle={styles.listContentContainer}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: secondaryColor,
    elevation: 8, // Subtle shadow for the header
    marginBottom: 8,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: textColorPrimary,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    color: textColorSecondary,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: "flex-end", // Align button to the right
  },
  button: {
    backgroundColor: primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4, // Slightly rounded corners for Material Design
    elevation: 2, // Subtle shadow for the button
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: textColorPrimary,
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  companyCard: {
    backgroundColor: surfaceColor,
    borderRadius: 4,
    elevation: 1, // Subtle shadow for the card
    overflow: "hidden", // Clip content within rounded borders
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: backgroundColor,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 8,
    color: textColorSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: backgroundColor,
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: dividerColor,
    marginVertical: 8,
  },
});
