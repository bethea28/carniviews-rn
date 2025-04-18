import {
  View,
  SectionList,
  Pressable,
  Text,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState, useMemo } from "react";
import { CompanyCard } from "@/app/Components/CardComponent";
import { useNavigation } from "@react-navigation/native";
import { useGetCompaniesQuery } from "@/store/api/api";
import { useAsyncStorage } from "@/app/customHooks";
import { useSelector } from "react-redux";
import { CountrySelect } from "@/app/Components/CountrySelect";
// Colors
const primaryColor = "#a349a4";
const primaryLightColor = "#d67bff";
const primaryDarkColor = "#751976";
const secondaryColor = "#f28e1c";
const backgroundColor = "#f7b767";
const textColorPrimary = "#ffffff";
const textColorSecondary = "#333333";
const errorColor = "#B00020";
const surfaceColor = "#FFFFFF";
const dividerColor = "#E0E0E0";

export function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const {
    data: allCompanies,
    isLoading,
    isError,
    refetch,
  } = useGetCompaniesQuery();
  const userData = useSelector((state) => state.counter.userState);
  const userName = userData?.data?.user?.name || "Guest";

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

  const sections = useMemo(() => {
    if (!allCompanies) return [];

    const grouped = allCompanies.reduce((acc, company) => {
      const name = company.companyInfo?.name || "";
      const firstLetter = name.charAt(0).toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(company);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort()
      .map((letter) => ({ title: letter, data: grouped[letter] }));
  }, [allCompanies]);

  const renderItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <CompanyCard
        wholeData={item}
        title={item.companyInfo.name}
        mainImage={item.mainImage}
        style={styles.companyCard}
      />
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text style={styles.loadingText}>Loading Companies...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading companies.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.greeting}>Hi {userName}!</Text>
          <Pressable
            onPress={() =>
              navigation.navigate("CompanyForms", { eventType: "company" })
            }
            style={[
              {
                // width: 150,
                padding: 20,
                marginRight: 10,
                borderRadius: 100,
                backgroundColor: "#a349a4",
              },
            ]}
          >
            <Text style={{ color: "white" }}>Add Company</Text>
          </Pressable>
        </View>
        <Text style={styles.title}>Welcome To TriniViews!</Text>
        <Text style={styles.title}>
          Let Us Help You Find Your Next Carnival Costume!
        </Text>
        <CountrySelect />
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item) =>
          item.companyInfo?.id?.toString() || Math.random().toString()
        }
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={primaryColor}
          />
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
    backgroundColor: backgroundColor,
  },
  header: {
    padding: 16,
    backgroundColor: secondaryColor,
    elevation: 8,
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
  sectionHeader: {
    backgroundColor: primaryDarkColor,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  sectionHeaderText: {
    color: textColorPrimary,
    fontWeight: "bold",
    fontSize: 16,
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
    elevation: 1,
    overflow: "hidden",
  },
  divider: {
    height: 1,
    backgroundColor: dividerColor,
    marginVertical: 8,
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
    color: errorColor,
  },
});
