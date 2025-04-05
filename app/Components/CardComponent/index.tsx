import * as React from "react";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { Pressable, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { setCompanyInfo } from "@/store/globalState/globalState";
import { useDispatch, useSelector } from "react-redux";

// Define the color palette based on the image (same as HomeScreen)
const primaryColor = "#a349a4"; // Purple
const secondaryColor = "#f28e1c"; // Orange
const backgroundColor = "#f7b767"; // Light Orange
const textColorPrimary = "#ffffff"; // White
const textColorSecondary = "#333333"; // Dark Gray (for contrast on light orange)
const buttonColor = "green"; // Initial button color

const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />;

export const CompanyCard = ({ title, mainImage, wholeData }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleNavigate = (navIndex) => {
    console.log("nav index now", navIndex);
    dispatch(setCompanyInfo(wholeData));
    navigation.navigate("Info", { wholeData, navIndex });
  };
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Text style={styles.title} variant="bodyMedium">
          {title}
        </Text>
        <Text style={styles.stars} variant="bodyMedium">
          Stars counter/456
        </Text>
      </Card.Content>
      <Card.Cover
        style={styles.cover}
        source={{
          uri:
            mainImage ||
            "https://www.rollingstone.com/wp-content/uploads/2022/02/0001x.jpg?w=1581&h=1054&crop=1&s",
        }}
        onError={(err) => console.log("what is image error", err)}
      />
      <Card.Actions style={styles.actions}>
        <View style={styles.actionsContainer}>
          <Pressable
            onPress={() => handleNavigate(0)}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: pressed ? secondaryColor : primaryColor },
            ]}
          >
            <Text style={styles.buttonText}>Details</Text>
          </Pressable>
          <Pressable
            onPress={() => handleNavigate(1)}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: pressed ? secondaryColor : primaryColor },
            ]}
          >
            <Text style={styles.buttonText}>Reviews</Text>
          </Pressable>
        </View>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    backgroundColor: textColorPrimary, // Assuming cards are white
    borderRadius: 8,
    elevation: 2, // Add a subtle shadow
    // marginHorizontal: 15,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: textColorSecondary,
  },
  stars: {
    fontSize: 16,
    color: textColorSecondary,
  },
  cover: {
    height: 200, // Adjust as needed
  },
  actions: {
    padding: 15,
  },
  actionsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    elevation: 1, // Subtle shadow for buttons
  },
  buttonText: {
    fontSize: 16,
    color: textColorPrimary,
    fontWeight: "bold",
  },
});
