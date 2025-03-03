import React from "react";
import { TextInput, View, Pressable, SafeAreaView, Text } from "react-native";

export const StoryScreen = () => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  console.log("home screen", description);
  const handleStoryFinish = () => {
    console.log("story fins");
  };
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "red", justifyContent: "center" }}
    >
      <TextInput
        onChangeText={setTitle}
        placeholder="story title"
        placeholderTextColor="blue"
        style={{
          borderWidth: 2,
          height: 50,
          marginTop: 100,
          textAlign: "center",
          fontSize: 20,
          color: "green",
        }}
        value={title}
      />
      <Text
        style={{
          textAlign: "center",
          fontSize: 20,
          color: "blue",
          marginTop: 20,
        }}
      >
        Tell Your Side
      </Text>
      <TextInput
        onChangeText={setDescription}
        placeholderTextColor="blue"
        placeholder="description"
        style={{
          textAlign: "center",
          backgroundColor: "orange",
          height: 350,
          fontSize: 20,
        }}
        value={description}
      />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          backgroundColor: "green",
          justifyContent: "flex-end",
        }}
      >
        <Pressable
          onPress={handleStoryFinish}
          style={({ pressed }) => [
            {
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: pressed ? "green" : "magenta",
              padding: 20,
              borderRadius: 10,
            },
          ]}
        >
          <Text>Finsih Story</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
