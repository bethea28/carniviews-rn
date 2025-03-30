import { Text, Button } from "react-native-paper";
import { View, FlatList, Pressable, Image } from "react-native";
import { CompanyCard } from "@/app/Components/CardComponent";
import { companyObjects } from "@/mockData";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
export function ReviewScreen({ route: { params } }) {
  const navigation = useNavigation();
  const userData = useSelector((state) => state.counter.userData);
  console.log("USER DATA", userData);
  return (
    <View style={{ padding: 20 }}>
      <Text>review screen</Text>
      <Pressable
        onPress={() => navigation.navigate("AddReviews")}
        style={({ pressed }) => [
          { backgroundColor: pressed ? "red" : "green" },
        ]}
      >
        <Text> Add Review</Text>
      </Pressable>
    </View>
  );
}
