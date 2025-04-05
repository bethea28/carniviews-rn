import * as React from "react";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { setCompanyInfo } from "@/store/globalState/globalState";
import { useDispatch, useSelector } from "react-redux";

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
    <Card style={{ marginTop: 20 }}>
      <Card.Content
        style={{ flexDirection: "row", justifyContent: "space-around" }}
      >
        <Text style={{ fontSize: 18 }} variant="bodyMedium">
          {title}
        </Text>
        <Text style={{ fontSize: 18 }} variant="bodyMedium">
          Stars counter/456
        </Text>
      </Card.Content>
      <Card.Cover
        source={{
          uri: "https://www.rollingstone.com/wp-content/uploads/2022/02/0001x.jpg?w=1581&h=1054&crop=1&s",
        }}
        onError={(err) => console.log("what is image error", err)}
      />
      <Card.Actions>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Pressable
            onPress={() => handleNavigate(0)}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "orange" : "green",
                padding: 10,
                borderRadius: 20,
              },
            ]}
          >
            <Text style={{ fontSize: 30 }}>Details</Text>
          </Pressable>
          <Pressable
            onPress={() => handleNavigate(1)}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "orange" : "green",
                padding: 10,
                borderRadius: 20,
              },
            ]}
          >
            <Text style={{ fontSize: 30 }}>Reviews</Text>
          </Pressable>
        </View>
      </Card.Actions>
    </Card>
  );
};
