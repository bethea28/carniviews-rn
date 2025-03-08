import { Text, Button } from "react-native-paper";
import {
  View,
  FlatList,
  Pressable,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { CompanyCard } from "@/app/Components/CardComponent";
import { companyObjects } from "@/mockData";
import { useNavigation } from "@react-navigation/native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
// import { CameraRoll } from "@react-native-camera-roll/camera-roll";

const options = {
  mediaType: "photo",
  includeBase64: false,
  maxHeight: 2000,
  maxWidth: 2000,
};

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
      {params.businessName}
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
const BasicDetails = () => (
  <View
    style={{
      backgroundColor: "red",
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 20,
    }}
  >
    <Text>Description</Text>
    <Image
      style={{ width: 75, height: 75, borderRadius: 100 }}
      source={{
        uri: "https://www.rollingstone.com/wp-content/uploads/2022/02/0001x.jpg?w=1581&h=1054&crop=1&s",
      }}
    />
  </View>
);
const DescriptionDetails = ({ params }) => (
  <View style={{ marginTop: 10 }}>
    <Text>Info Details</Text>
    <Text>{params.description}</Text>
  </View>
);

const Actions = ({ camera, action, header }) => {
  const navigate = useNavigation();
  console.log("action", action);

  const handleImageLibraryLaunch = async () => {
    // return;
    console.log("camer in here");
    const result = await launchImageLibrary();
    console.log("camer now", result);

    // await launchImageLibrary(options, (response) => {
    //   console.log("response", response);
    //   if (response.didCancel) {
    //     console.log("User cancelled image picker");
    //   } else if (response.error) {
    //     console.log("ImagePicker Error: ", response.error);
    //   } else {
    //     console.log("Response = ", response);
    //     // Handle the selected image
    //   }
    // });
  };
  return (
    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
      <Pressable
        onPress={
          camera ? handleImageLibraryLaunch : () => navigate.navigate(action)
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
      <Actions camera={false} header="Add Review" action="AddReviews" />
      <Actions camera={true} header="Add Photo" action="AddReviews" />
    </View>
  </View>
);

export function DetailsScreen({ route: { params } }) {
  const navigation = useNavigation();
  console.log("get moeny", params.businessName);
  return (
    <ScrollView style={{ padding: 20 }}>
      <ImageDetails params={params} />
      <DescriptionDetails params={params} />
      <BasicDetails params={params} />
      <Recommend params={params} />
    </ScrollView>
  );
}
