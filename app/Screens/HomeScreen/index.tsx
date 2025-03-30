import {
  View,
  FlatList,
  Pressable,
  Text,
  RefreshControl,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { CompanyCard } from "@/app/Components/CardComponent";
import { useNavigation } from "@react-navigation/native";
import { useGetCompaniesQuery } from "@/store/api/api";
import { SocialLoginScreen } from "../SocialLoginScreen";
import { useAsyncStorage } from "@/app/customHooks";
import { useSelector } from "react-redux";

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
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error...</Text>;
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
          style={styles.button}
        >
          <Text style={styles.buttonText}>Add Token</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("AddCompany")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Add Company</Text>
        </Pressable>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          data={allCompanies}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  buttonContainer: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "magenta",
    width: 150,
    padding: 20,
    borderRadius: 10,
  },
  buttonText: { textAlign: "center", fontSize: 15 },
  listContainer: { marginBottom: 270 },
});
