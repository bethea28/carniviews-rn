import React from "react";
import { Text, View, Pressable, SafeAreaView, Image } from "react-native";

export const HomeScreen = () => {
  console.log("home screen");

  return (
    <SafeAreaView>
      <Text>homfdae df</Text>
      <Image
        style={{ width: 50, height: 50 }}
        source={{
          uri: "https://i.guim.co.uk/img/media/43585997f860c0d3eefce7a34480e55e53f6c574/0_0_2400_3045/master/2400.jpg?width=465&dpr=1&s=none&crop=none",
        }}
      />
      <Text style={{ width: 100 }}></Text>
    </SafeAreaView>
  );
};
