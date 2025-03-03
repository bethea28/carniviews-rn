import React from "react";
import {
  Text,
  View,
  Pressable,
  SafeAreaView,
  Image,
  FlatList,
} from "react-native";
import {
  createStaticNavigation,
  useNavigation,
} from "@react-navigation/native";
export const ProfileScreen = () => {
  console.log("Profile screen");
  const navigation = useNavigation();
  const renderItem = () => {
    return (
      <View style={{ marginLeft: 10 }}>
        <>
          <Image
            style={{ width: 150, height: 150 }}
            source={{
              uri: "https://www.rollingstone.com/wp-content/uploads/2022/02/0001x.jpg?w=1581&h=1054&crop=1&s",
            }}
          />
        </>
      </View>
    );
  };
  return (
    <SafeAreaView>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Image
          style={{ width: 200, height: 200, borderRadius: 100 }} // Increased size, added resizeMode
          source={{
            uri: "https://www.rollingstone.com/wp-content/uploads/2022/02/0001x.jpg?w=1581&h=1054&crop=1&s",
          }}
          onError={(e) =>
            console.error("Image loading error:", e.nativeEvent.error)
          } // Added error handling
        />
        <View style={{ justifyContent: "center" }}>
          <Pressable
            onPress={() => navigation.navigate("CreateStory")}
            style={({ pressed }) => [
              {
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: pressed ? "green" : "blue",
                width: 100,
                height: 100,
                borderRadius: 100,
              },
            ]}
          >
            <Text style={{ color: "white" }}>Create Story</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              {
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: pressed ? "blue" : "green",
                width: 100,
                height: 100,
                borderRadius: 100,
              },
            ]}
          >
            <Text style={{ color: "white" }}>Create Story</Text>
          </Pressable>
        </View>
      </View>
      <View style={{ marginTop: 30, alignItems: "center" }}>
        <Text style={{ fontSize: 20 }}>Top Stories</Text>

        <FlatList
          style={{ marginTop: 20 }}
          horizontal
          data={[1, 2, 3, 4, 5]}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
};
