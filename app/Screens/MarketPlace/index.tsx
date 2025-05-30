import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  SectionList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Modal,
  Linking,
  Pressable,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGetBusinessesQuery, useAddClapsMutation } from "@/store/api/api";
import {
  Text,
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
} from "react-native-paper";
import { useSelector } from "react-redux";
import { timeConvert } from "@/app/customHooks";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const COLORS = {
  primary: "#a349a4",
  secondary: "#FF8C00",
  background: "#FFB347",
  textPrimary: "#ffffff",
  textSecondary: "#333333",
  inputBackground: "#ffffff",
  buttonBackground: "#a349a4",
  buttonText: "#ffffff",
  errorText: "red",
  link: "blue",
  placeholder: "gray",
};

export const MarketPlaceScreen = () => {
  const navigation = useNavigation();
  const country = useSelector((state) => state.counter.country);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [claps, setClaps] = useState({});
  const [addClap] = useAddClapsMutation();
  const {
    data: allBusinesses,
    error,
    isLoading,
    refetch,
  } = useGetBusinessesQuery(country);

  useEffect(() => {
    if (allBusinesses) {
      const initialClaps = allBusinesses.reduce((acc, biz) => {
        acc[biz.id] = biz.companyInfo.claps || 0;
        return acc;
      }, {});
      setClaps(initialClaps);
    }
  }, [allBusinesses]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (err) {
      console.error("Refresh failed", err);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleClap = async (businessId) => {
    setClaps((prev) => ({
      ...prev,
      [businessId]: (prev[businessId] || 0) + 1,
    }));
    await addClap({ type: "business", id: businessId });
  };

  const handleBusinessDetails = (biz) => {
    setSelectedBusiness(biz);
    setModalVisible(true);
  };

  const groupBusinesses = (businesses) => {
    if (!businesses) return [];
    const filtered = businesses.filter(
      (item) => item?.country === country?.country
    );
    const grouped = (filtered.length ? filtered : businesses).reduce(
      (acc, biz) => {
        const letter = biz.companyInfo.name?.[0]?.toUpperCase() || "#";
        acc[letter] = acc[letter] || [];
        acc[letter].push(biz);
        return acc;
      },
      {}
    );
    return Object.keys(grouped)
      .sort()
      .map((title) => ({
        title,
        data: grouped[title].sort((a, b) =>
          a.companyInfo.name.localeCompare(b.companyInfo.name)
        ),
      }));
  };

  const renderLink = (label, url) => (
    <Text style={[styles.link]} onPress={() => Linking.openURL(url)}>
      {label}
    </Text>
  );

  const renderBusinessItem = ({ item }) => (
    <Card style={styles.card}>
      {item.companyInfo?.photos?.[0] && (
        <Image
          // style={styles.eventImage}
          style={{
            width: 400,
            height: 400,
            // resizeMode: "stretch", // Fit inside without cropping
            backgroundColor: "transparent", // Optional: remove gray background
          }}
          source={{ uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDidkUP1Kcd8pXAgbOQ51JdAmA1-b5dOkYKg&s" }}
          // source={{ uri: item.companyInfo?.photos[0] }}
        />
      )}
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={styles.title}>{item.companyInfo.name}</Title>
          <Title style={styles.title}>{item.companyInfo.company_type}</Title>
          <View style={styles.clapRow}>
            <Text>{claps[item.id]}</Text>
            <TouchableOpacity onPress={() => handleClap(item.id)}>
              <Icon color="red" size={30} name="hand-clap" />
            </TouchableOpacity>
          </View>
        </View>
        {item.companyInfo.website &&
          renderLink(
            `🌐 ${item.companyInfo.website}`,
            item.companyInfo.website
          )}
        {item.companyInfo.contact && (
          <Text style={styles.text}>📞 {item.companyInfo.contact}</Text>
        )}
        {item.companyInfo.phone && (
          <Text style={styles.text}>📱 {item.companyInfo.phone}</Text>
        )}
        {item.companyInfo.email && (
          <Text style={styles.text}>✉️ {item.companyInfo.email}</Text>
        )}
        <Paragraph numberOfLines={2} style={styles.paragraph}>
          {item.companyInfo.description || "No description available"}
        </Paragraph>
        {item.start_time && item.end_time && (
          <Text style={styles.text}>
            🕒 {timeConvert(item.start_time)} - {timeConvert(item.end_time)}
          </Text>
        )}
        {item.companyInfo.address_line1 && (
          <Text style={styles.text}>
            📍 {item.companyInfo.address_line1}
            {item.companyInfo.address_line2 &&
              `, ${item.companyInfo.address_line2}`}
            {item.companyInfo.city && `, ${item.companyInfo.city}`}
            {item.companyInfo.region && `, ${item.companyInfo.region}`}
            {item.companyInfo.postal_code && ` ${item.companyInfo.postal_code}`}
          </Text>
        )}
        {item.companyInfo.country && (
          <Text style={styles.text}>🌎 {item.companyInfo.country}</Text>
        )}
        {item.companyInfo.facebook &&
          renderLink("👍 Facebook", item.companyInfo.facebook)}
        {item.companyInfo.instagram &&
          renderLink("📸 Instagram", item.companyInfo.instagram)}
        {item.companyInfo.twitter &&
          renderLink("🐦 Twitter", item.companyInfo.twitter)}

        {item.ticket && (
          <View style={styles.ticketRow}>
            <Icon name="ticket" style={styles.ticketIcon} />
            {renderLink(item.ticket, item.ticket)}
          </View>
        )}

        <Pressable
          onPress={() =>
            navigation.navigate("SuggestEdit", {
              eventType: "business",
              item,
              operation: "edit",
              eventId: item.id,
            })
          }
          style={({ pressed }) => [
            styles.suggestEditButton,
            { backgroundColor: pressed ? COLORS.secondary : COLORS.primary },
          ]}
        >
          <Text style={styles.buttonLabel}>Suggest Edit</Text>
        </Pressable>
      </Card.Content>
    </Card>
  );

  if (isLoading && !refreshing) {
    return <ActivityIndicator animating color={COLORS.primary} />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error fetching businesses</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Button
          mode="contained"
          onPress={() =>
            navigation.navigate("Duplication", { eventType: "business" })
          }
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Add Business
        </Button>
        <SectionList
          sections={groupBusinesses(allBusinesses)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBusinessItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          stickySectionHeadersEnabled
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: 16 },
  card: { marginBottom: 16, backgroundColor: COLORS.inputBackground },
  // eventImage: { resizeMode: "stretch" },
  title: { color: COLORS.textSecondary, fontSize: 18, fontWeight: "bold" },
  paragraph: { color: COLORS.textSecondary, marginBottom: 6 },
  text: { color: COLORS.textSecondary },
  link: { color: COLORS.link, textDecorationLine: "underline" },
  clapRow: { flexDirection: "row", alignItems: "center" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  ticketRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  ticketIcon: { marginLeft: 4, marginRight: 12 },
  button: {
    backgroundColor: COLORS.buttonBackground,
    marginBottom: 20,
    borderRadius: 6,
  },
  buttonLabel: {
    color: COLORS.buttonText,
    fontSize: 16,
  },
  suggestEditButton: {
    marginTop: 10,
    borderRadius: 6,
    padding: 8,
    alignItems: "center",
  },
  errorText: {
    color: COLORS.errorText,
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    backgroundColor: COLORS.background,
    color: COLORS.textSecondary,
    paddingVertical: 8,
  },
});
