import React from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useAddReviewMutation } from "@/store/api/api";
import StarRating from "react-native-star-rating-widget";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { StackActions } from "@react-navigation/native";
import { Notifier, Easing } from "react-native-notifier";
const StarRate = ({ changeRating, rating, styles }) => {
  return <StarRating style={styles} rating={rating} onChange={changeRating} />;
};

export function AddReviewScreen({ route }) {
  const [addReview] = useAddReviewMutation();
  const [rating, setRating] = React.useState(0);
  const navigation = useNavigation();
  const userData = useSelector((state) => state.counter.userState);
  console.log("SHOW ME ROUTES", route);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      review: "",
    },
  });
  const onSubmit = async (data) => {
    try {
      const final = {
        review: data.review,
        rating,
        userId: userData.data.user.user_id,
        companyId: route.params?.companyInfo.companyId,
      };

      const sendReview = await addReview(final);

      // Check if request was successful
      if (sendReview?.data) {
        Notifier.showNotification({
          title: "Success!",
          description: "Review added successfully!",
          duration: 4000,
          showAnimationDuration: 800,
          showEasing: Easing.ease,
          hideOnPress: true,
        });

        navigation.dispatch(StackActions.pop());
      } else {
        throw new Error("Failed to submit review");
      }
    } catch (error) {
      console.log("Error submitting review:", error);
      Notifier.showNotification({
        title: "Error",
        description: "There was a problem submitting your review.",
        duration: 4000,
        showAnimationDuration: 800,
        showEasing: Easing.ease,
        hideOnPress: true,
      });
    } finally {
      reset();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Add a review!"
              placeholderTextColor="black"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.textInput}
              multiline={true}
              textAlignVertical="top"
            />
          )}
          name="review"
        />
        {errors.review && <Text>This is required.</Text>}
        <View style={styles.ratingAndButtonContainer}>
          <StarRate
            styles={styles.starRating}
            rating={rating}
            changeRating={setRating}
          />
          <Button
            color="blue"
            title="Submit"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  textInput: {
    height: 300,
    backgroundColor: "yellow",
    borderRadius: 30,
    padding: 20,
  },
  ratingAndButtonContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  starRating: {
    marginTop: 30,
  },
});
