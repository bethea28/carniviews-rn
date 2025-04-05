import React from "react";
import { Text, Button } from "react-native-paper";
import {
  View,
  Pressable,
  ImageBackground,
  Image,
  ScrollView,
} from "react-native";
import { CompanyCard } from "@/app/Components/CardComponent";
import { companyObjects } from "@/mockData";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { BusinessHours } from "../BusinessHours";
import { useSelector } from "react-redux";

const ImageDetails = ({ params }) => (
  <ImageBackground
    resizeMode="cover"
    source={{
      uri: "https://www.rollingstone.com/wp-content/uploads/2022/02/0001x.jpg?w=1581&h=1054&crop=1&s",
    }}
    style={{
      height: 150,
      backgroundColor: "red",
      justifyContent: "flex-end",
    }}
  >
    <Text style={{ fontSize: 20, marginBottom: 20 }}>
      {params?.businessName}
    </Text>
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "green" : "orange",
          height: 30,
          borderRadius: 20,
        },
      ]}
    >
      <Text>See all Photos </Text>
    </Pressable>
  </ImageBackground>
);
const BasicDetails = ({ params }) => (
  <View
    style={{
      backgroundColor: "red",
      // flexDirection: "row",
      // justifyContent: "space-around",
      marginTop: 20,
    }}
  >
    <Image
      style={{ borderRadius: 100 }}
      source={{
        uri: "https://www.rollingstone.com/wp-content/uploads/2022/02/0001x.jpg?w=1581&h=1054&crop=1&s",
      }}
    />
    <Text>{params?.companyInfo.description}</Text>
  </View>
);
const DescriptionDetails = ({ companyInfo }) => (
  <View style={{ marginTop: 10 }}>
    <Text>Info Details</Text>
    <Text>{companyInfo.companyDescription}</Text>
  </View>
);

const Actions = ({ camera, action, header, params }) => {
  const [image, setImage] = React.useState<string | null>(null);

  const navigate = useNavigation();
  console.log("action", action);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    console.log("THESE ARE MY IMAGES", result.assets?.length);

    if (!result.canceled) {
      setImage(result.assets);
    }
  };

  // console.log("show me the image now", params);
  return (
    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
      <Pressable
        onPress={
          camera
            ? pickImage
            : () => navigate.navigate(action, { companyData: params })
        }
        style={({ pressed }) => [
          {
            borderRadius: 100,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: pressed ? "green" : "translucent",
            marginLeft: 10,
          },
        ]}
      >
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 100,
          }}
          source={{
            uri: "https://www.rollingstone.com/wp-content/uploads/2022/02/0001x.jpg?w=1581&h=1054&crop=1&s",
          }}
        />
        <Text style={{ padding: 15 }}>{header}</Text>
      </Pressable>
    </View>
  );
};
const Recommend = ({ params }) => (
  <View style={{ marginTop: 10, alignItems: "center" }}>
    <Text>Do you recommend this business?</Text>
    <View style={{ flexDirection: "row" }}>
      <Pressable
        style={({ pressed }) => [
          {
            borderWidth: 2,
            backgroundColor: pressed ? "green" : "white",
          },
        ]}
      >
        <Text style={{ fontSize: 20, padding: 20 }}>Yes</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          {
            borderWidth: 2,
            backgroundColor: pressed ? "green" : "white",
            marginLeft: 10,
          },
        ]}
      >
        <Text style={{ fontSize: 20, padding: 20 }}>No</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          {
            borderWidth: 2,
            backgroundColor: pressed ? "green" : "white",
            marginLeft: 10,
          },
        ]}
      >
        <Text style={{ fontSize: 20, padding: 20 }}>Maybe</Text>
      </Pressable>
    </View>
    <View
      style={{
        flexDirection: "row",
        marginTop: 20,
      }}
    >
      <Actions
        params={params}
        camera={false}
        header="Add Review"
        action="AddReviews"
      />
      <Actions
        params={params}
        camera={true}
        header="Add Photo"
        action="AddPhotos"
      />
    </View>
  </View>
);

export function DetailsScreen({ route: { params } }) {
  const navigation = useNavigation();
  // console.log("COMPANY DETAILS INFO", params);
  // console.log("hours", params.hoursData);
  const companyInfo = useSelector((state) => state.counter.companyInfo);
  console.log("this is company info", companyInfo);
  return (
    <ScrollView style={{ padding: 20 }}>
      <ImageDetails params={params} />
      <DescriptionDetails companyInfo={companyInfo} />
      <BasicDetails />
      {/* <BusinessHours staleHours={params?.hoursData} stale={true} /> */}
      <Recommend params={params} />
    </ScrollView>
  );
}
