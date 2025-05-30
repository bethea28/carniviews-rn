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
import { TabComponent } from "@/app/Components/TabComponent";
import { EmptyCardComponent } from "../EmptyCardComponent";
import { StoryCarousel } from "../StoryCarousel";
import { BandStoryForm } from "../BandStoryForm";
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

const FirstRoute = () => <Text>firt</Text>;
const SecondRoute = () => <Text>second</Text>;
const ThirdRoute = () => <Text>thrird</Text>;

export function BandsList() {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const country = useSelector((state) => state.counter.country);
  const {
    data: allCompanies,
    isLoading,
    isError,
    refetch,
  } = useGetCompaniesQuery(country);
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

    const filteredComp = allCompanies.filter(
      (item) => item?.companyInfo?.country === country?.country
    );
    const parsedCompanies =
      filteredComp.length === 0 ? allCompanies : filteredComp;

    const grouped = parsedCompanies.reduce((acc, company) => {
      const name = company.companyInfo?.name || "";
      const firstLetter = name.charAt(0).toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(company);
      return acc;
    }, {});

    const finalGroup = Object.keys(grouped)
      .sort()
      .map((letter) => ({ title: letter, data: grouped[letter] }));
    return finalGroup;
  }, [allCompanies, country?.country]);

  const renderItem = ({ item }) => console.log('THE BIZ',item)|| (
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
  console.log("all companies now", allCompanies);
  return (
    <View style={styles.container}>
      {/* {!country ? (
        <EmptyCardComponent />
      ) : (
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
        )} */}
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
      {/* <StoryCarousel /> */}
      {/* <BandStoryForm /> */}
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
    // paddingHorizontal: 16,
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
