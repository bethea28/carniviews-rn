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
  ImageBackground,
  TouchableOpacity,
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
// Color Scheme
const primaryColor = "#a349a4";
const secondaryColor = "#FF8C00";
const backgroundColor = "#FFB347";
const textColorPrimary = "#ffffff";
const textColorSecondary = "#333333";
const inputBackgroundColor = textColorPrimary;
const buttonBackgroundColor = primaryColor;
const buttonTextColor = textColorPrimary;
const errorTextColor = "red";
const placeholderTextColor = "gray";

export const MarketPlaceScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const country = useSelector((state) => state.counter.country);
  const [addClap] = useAddClapsMutation();
  const [claps, setClaps] = useState({}); // State to hold claps for each business
  const {
    data: allBusineses,
    error,
    isLoading,
    refetch,
  } = useGetBusinessesQuery(country);

  useEffect(() => {
    if (allBusineses) {
      const initialClaps = allBusineses.reduce((acc, business) => {
        console.log("business clappings", business);
        acc[business.id] = business.companyInfo.claps || 0;
        return acc;
      }, {});

      console.log("initial claps now daren", initialClaps);
      setClaps(initialClaps);
    }
  }, [allBusineses]);

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

  const handleBusinessDetails = (business) => {
    setSelectedBusiness(business);
    setModalVisible(true);
  };

  const handleClap = async (businessId) => {
    setClaps((prevClaps) => ({
      ...prevClaps,
      [businessId]: (prevClaps[businessId] || 0) + 1,
    }));
    // Assuming you have a mutation to add claps for businesses
    const addingClaps = await addClap({ type: "business", id: businessId });
    console.log(`Clapped for business BRYAN`, businessId);
    // You'll need to implement the actual API call for adding claps
  };

  const renderBusinessItem = ({ item, index }) =>
    console.log("index works", index, claps) || (
      <Card style={styles.card}>
        {/* <TouchableOpacity onPress={() => handleBusinessDetails(item)}> */}
        <TouchableOpacity>
          {item.images?.[0]?.uri ? (
            <Card.Cover
              style={styles.eventImage}
              source={{ uri: item.images[0].uri }}
            />
          ) : null}
          <ImageBackground
            resizeMode="cover"
            source={{
              uri:
                typeof item?.companyInfo?.photos?.[0] === "string"
                  ? item?.companyInfo?.photos[0]
                  : "",
            }}
            style={styles.imageDetailsBackground}
          >
            <Card.Content>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Title style={styles.title}>{item.companyInfo.name}</Title>
                <Title style={styles.title}>
                  {item.companyInfo.company_type}
                </Title>
                <View style={{ flexDirection: "row" }}>
                  <Text>{claps[index + 1]}</Text>
                  <TouchableOpacity onPress={() => handleClap(item.id)}>
                    <Icon color="red" size={30} name="hand-clap" />
                  </TouchableOpacity>
                </View>
              </View>

              {item.companyInfo.website ? (
                <Text
                  style={[
                    styles.text,
                    { color: "blue", textDecorationLine: "underline" },
                  ]}
                  onPress={() => Linking.openURL(item.companyInfo.website)}
                >
                  🌐 {item.companyInfo.website}
                </Text>
              ) : null}

              {item.companyInfo.contact && (
                <Text style={styles.text}>📞 {item.companyInfo.contact}</Text>
              )}
              {item.companyInfo.phone && (
                <Text style={styles.text}>📱 {item.companyInfo.phone}</Text>
              )}
              {item.companyInfo.email && (
                <Text style={styles.text}>✉️ {item.companyInfo.email}</Text>
              )}

              <Paragraph style={styles.paragraph} numberOfLines={2}>
                {item.companyInfo.description || "No description available"}
              </Paragraph>

              {item.start_time && item.end_time && (
                <Text style={styles.text}>
                  🕒 {timeConvert(item.start_time)} -{" "}
                  {timeConvert(item.end_time)}
                </Text>
              )}

              {item.companyInfo.address_line1 && (
                <Text style={styles.text}>
                  📍 {item.companyInfo.address_line1 || "N/A"}
                  {item.companyInfo.address_line2
                    ? `, ${item.companyInfo.address_line2}`
                    : ""}
                  {item.companyInfo.city ? `, ${item.companyInfo.city}` : ""}
                  {item.companyInfo.region
                    ? `, ${item.companyInfo.region}`
                    : ""}
                  {item.companyInfo.postal_code
                    ? ` ${item.companyInfo.postal_code}`
                    : ""}
                </Text>
              )}

              {item.companyInfo.country && (
                <Text style={styles.text}>🌎 {item.companyInfo.country}</Text>
              )}

              {/* Social links */}
              {item.companyInfo.facebook && (
                <Text
                  style={[
                    styles.text,
                    { color: "blue", textDecorationLine: "underline" },
                  ]}
                  onPress={() => Linking.openURL(item.companyInfo.facebook)}
                >
                  👍 Facebook
                </Text>
              )}
              {item.companyInfo.instagram && (
                <Text
                  style={[
                    styles.text,
                    { color: "blue", textDecorationLine: "underline" },
                  ]}
                  onPress={() => Linking.openURL(item.companyInfo.instagram)}
                >
                  📸 Instagram
                </Text>
              )}
              {item.companyInfo.twitter && (
                <Text
                  style={[
                    styles.text,
                    { color: "blue", textDecorationLine: "underline" },
                  ]}
                  onPress={() => Linking.openURL(item.companyInfo.twitter)}
                >
                  🐦 Twitter
                </Text>
              )}

              {/* Ticket */}
              {item.ticket && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 2,
                  }}
                >
                  <Icon
                    name="ticket"
                    style={{ marginLeft: 4, marginRight: 12 }}
                  />
                  <Text
                    onPress={() => Linking.openURL(item.ticket)}
                    style={[
                      styles.text,
                      { color: "blue", textDecorationLine: "underline" },
                    ]}
                  >
                    {item.ticket}
                  </Text>
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
                  {
                    backgroundColor: pressed ? secondaryColor : primaryColor,
                  },
                ]}
                android_ripple={{ color: primaryColor }}
              >
                <Text style={styles.button}>Suggest Edit</Text>
              </Pressable>
            </Card.Content>
          </ImageBackground>
        </TouchableOpacity>
      </Card>
    );

  const groupEventsAlphabetically = (businesses) => {
    if (!businesses) return [];
    const filteredComp = businesses.filter(
      (item) => item?.country === country?.country
    );
    const parsedCompanies =
      filteredComp.length === 0 ? businesses : filteredComp;
    const grouped = parsedCompanies.reduce((acc, business) => {
      const name = business.companyInfo.name || "";
      const firstLetter = name[0]?.toUpperCase() || "#";
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(business);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort()
      .map((letter) => ({
        title: letter,
        data: grouped[letter].sort((a, b) =>
          (a?.companyInfo?.name || "").localeCompare(b?.companyInfo?.name || "")
        ),
      }));
  };

  if (isLoading && !refreshing) {
    return <ActivityIndicator animating={true} color={primaryColor} />;
  }
  if (error) {
    console.log("what is error", error);
    return <Text style={styles.errorText}>Error fetching businesses</Text>;
  }
  // console.log("clapping me now", claps);
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
          sections={groupEventsAlphabetically(allBusineses || [])}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBusinessItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[primaryColor]}
              tintColor={primaryColor}
            />
          }
          stickySectionHeadersEnabled={true}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      </View>

      {/* Business Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedBusiness && (
              <>
                <Title style={styles.modalTitle}>
                  {selectedBusiness.companyInfo.name}
                </Title>
                <Text style={styles.modalText}>
                  {selectedBusiness.companyInfo.description ||
                    "No description available"}
                </Text>
                {selectedBusiness.start_time && selectedBusiness.end_time && (
                  <Text style={styles.modalText}>
                    🕒 {timeConvert(selectedBusiness.start_time)} -{" "}
                    {timeConvert(selectedBusiness.end_time)}
                  </Text>
                )}
                {selectedBusiness.companyInfo.address_line1 && (
                  <Text style={styles.modalText}>
                    📍 {selectedBusiness.companyInfo.address_line1 || "N/A"}
                    {selectedBusiness.companyInfo.address_line2
                      ? `, ${selectedBusiness.companyInfo.address_line2}`
                      : ""}
                    {selectedBusiness.companyInfo.city
                      ? `, ${selectedBusiness.companyInfo.city}`
                      : ""}
                    {selectedBusiness.companyInfo.region
                      ? `, ${selectedBusiness.companyInfo.region}`
                      : ""}
                    {selectedBusiness.companyInfo.postal_code
                      ? ` ${selectedBusiness.companyInfo.postal_code}`
                      : ""}
                  </Text>
                )}
                {selectedBusiness.companyInfo.contact && (
                  <Text style={styles.modalText}>
                    📞 {selectedBusiness.companyInfo.contact}
                  </Text>
                )}
                {selectedBusiness.companyInfo.phone && (
                  <Text style={styles.modalText}>
                    📱 {selectedBusiness.companyInfo.phone}
                  </Text>
                )}
                {selectedBusiness.companyInfo.email && (
                  <Text style={styles.modalText}>
                    ✉️ {selectedBusiness.companyInfo.email}
                  </Text>
                )}
                {selectedBusiness.companyInfo.website && (
                  <Text
                    style={[
                      styles.modalText,
                      { color: "blue", textDecorationLine: "underline" },
                    ]}
                    onPress={() =>
                      Linking.openURL(selectedBusiness.companyInfo.website)
                    }
                  >
                    🌐 {selectedBusiness.companyInfo.website}
                  </Text>
                )}
                {selectedBusiness.companyInfo.facebook && (
                  <Text
                    style={[
                      styles.modalText,
                      { color: "blue", textDecorationLine: "underline" },
                    ]}
                    onPress={() =>
                      Linking.openURL(selectedBusiness.companyInfo.facebook)
                    }
                  >
                    👍 Facebook
                  </Text>
                )}
                {selectedBusiness.companyInfo.instagram && (
                  <Text
                    style={[
                      styles.modalText,
                      { color: "blue", textDecorationLine: "underline" },
                    ]}
                    onPress={() =>
                      Linking.openURL(selectedBusiness.companyInfo.instagram)
                    }
                  >
                    📸 Instagram
                  </Text>
                )}
                {selectedBusiness.companyInfo.twitter && (
                  <Text
                    style={[
                      styles.modalText,
                      { color: "blue", textDecorationLine: "underline" },
                    ]}
                    onPress={() =>
                      Linking.openURL(selectedBusiness.companyInfo.twitter)
                    }
                  >
                    🐦 Twitter
                  </Text>
                )}
              </>
            )}
            <Button
              mode="contained"
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
              labelStyle={{ color: buttonTextColor }}
            >
              Close
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: inputBackgroundColor,
  },
  eventImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 10,
  },
  title: {
    color: textColorSecondary,
    fontSize: 18,
    fontWeight: "bold",
  },
  paragraph: {
    color: textColorSecondary,
    marginBottom: 6,
  },
  text: {
    color: textColorSecondary,
  },
  button: {
    backgroundColor: buttonBackgroundColor,
    marginBottom: 20,
    borderRadius: 6,
  },
  suggestEditButton: {
    backgroundColor: buttonBackgroundColor,
    marginBottom: 20,
    borderRadius: 6,
    width: 100,
    alignSelf: "center",
  },
  buttonLabel: {
    color: buttonTextColor,
    fontSize: 16,
  },
  errorText: {
    color: errorTextColor,
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    backgroundColor: backgroundColor,
    color: textColorSecondary,
    paddingVertical: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "100%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: textColorSecondary,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
  },
  imageDetailsBackground: {
    padding: 10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: "hidden",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: buttonBackgroundColor,
  },
});
