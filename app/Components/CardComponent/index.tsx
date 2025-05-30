import * as React from "react";
import { Avatar } from "react-native-paper";
import { Pressable, View, StyleSheet, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { setCompanyInfo } from "@/store/globalState/globalState";
import { useDispatch } from "react-redux";
import StarRatingDisplay from "react-native-star-rating-widget";
import { useGetReviewsQuery } from "@/store/api/api";
import { useSelector } from "react-redux";
// Define a Material Design inspired color palette (using the provided colors)
const primaryColor = "#a349a4"; // Purple 500 (approx.)
const primaryLightColor = "#d67bff"; // Purple 200 (approx.)
const primaryDarkColor = "#751976"; // Purple 700 (approx.)
const secondaryColor = "#f28e1c"; // Orange A200 (approx.)
const secondaryLightColor = "#ffc04f"; // Orange A100 (approx.)
const secondaryDarkColor = "#b95f00"; // Orange A400 (approx.)
const backgroundColor = "#f7b767"; // Light Orange 200 (approx.)
const textColorPrimary = "#ffffff"; // White
const textColorSecondary = "#333333"; // Dark Gray
const surfaceColor = "#FFFFFF"; // White (for cards)
const shadowColor = "#000";
const disabledColor = "#E0E0E0"; // Grey 300

const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />;

export const CompanyCard = ({ title, mainImage, wholeData }) => {
  const {
    data: allCompanyReviews,
    isLoading,
    isError,
  } = useGetReviewsQuery({
    companyId: wholeData.id,
  });
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleNavigate = (navIndex) => {
    dispatch(setCompanyInfo(wholeData));
    navigation.navigate("Info", { wholeData, navIndex });
  };

  const StarRate = ({  rating, styles }) => {
    return (
      <StarRatingDisplay
        starSize={25}
        style={{ marginRight: 20 }}
        rating={rating}
        starStyle={{ width: 10 }}
        onChange={() => {}}
      />
    );
  };
  const allRatings = null;
  const ratings = React.useMemo(() => {
    if (!allCompanyReviews?.reviews) return [];
    const length = allCompanyReviews.reviews.length;
    const rating = allCompanyReviews?.reviews?.reduce((a, b) => {
      return a + b.rating;
    }, 0);
    return rating / length;
  }, [isLoading]);
  const compData = useSelector((state) => state.counter);
  console.log("what is compData", wholeData.companyInfo.overall_avg);
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{title}</Text>
        {/* <StarRate styles={{ width: 100 }} rating={5} /> */}
      </View>
      <Image
        style={styles.cover}
        source={{
          uri:
            mainImage ||
            "https://carnivaltribe.com/wp-content/uploads/2024/07/Tribe25-Group-Hero-02.jpg",
        }}
        onError={(err) => console.log("what is image error", err)}
      />
      <View style={styles.actions}>
        <View style={styles.actionsContainer}>
          
          <View style={{ marginRight: 48 }}>
              <Text style={{ marginLeft: 10 }}>
                {wholeData.companyInfo.overall_avg} Overall Experience
              </Text>
              <StarRate  styles={{ width: 100 }} rating={wholeData.companyInfo.overall_avg} />
               <View style={{ flexDirection: "row", alignItems: "center" }}>
            </View>
            {/* {ratings ? <StarRate rating={ratings} /> : <StarRate rating={0} />} */}
            <Text style={{ marginLeft: 10 }}>
              {allCompanyReviews?.reviews?.length} Reviews
            </Text>
            <Text style={{ marginLeft: 10 }}>
              {wholeData.companyInfo.bandStories} Band Stories
            </Text>
         
          </View>
          <Pressable
            onPress={() => handleNavigate(0)}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: pressed ? secondaryLightColor : primaryColor , marginRight: undefined},
            ]}
            android_ripple={{ color: primaryDarkColor }}
          >
            <Text style={styles.buttonText}>Details</Text>
          </Pressable>
          <Pressable
            onPress={() => handleNavigate(1)}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: pressed ? secondaryLightColor : primaryColor },
            ]}
            android_ripple={{ color: primaryDarkColor }}
          >
            <Text style={styles.buttonText}>Reviews</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    // marginTop: 16,
    backgroundColor: surfaceColor,
    borderRadius: 4,
    elevation: 2, // Subtle shadow
    // marginHorizontal: 16,
    overflow: "hidden", // Clip content for rounded corners
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: textColorSecondary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: textColorSecondary,
  },
  cover: {
    height: 200,
    width: "100%",
  },
  actions: {
    padding: 8,
    // flexDirection: "row",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    alignItems: "center",
  },
  button: {
    backgroundColor: primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
    elevation: 1, // Subtle button shadow
  },
  buttonText: {
    color: textColorPrimary,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
