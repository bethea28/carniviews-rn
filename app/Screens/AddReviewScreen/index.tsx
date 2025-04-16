import React from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useAddReviewMutation } from "@/store/api/api";
import StarRating from "react-native-star-rating-widget";
import { useSelector } from "react-redux";
import { useNavigation, StackActions } from "@react-navigation/native";
import { Notifier, Easing, NotifierComponents } from "react-native-notifier";

// Color scheme
const primaryColor = "#a349a4";
const primaryLightColor = "#d67bff";
const primaryDarkColor = "#751976";
const secondaryColor = "#f28e1c";
const backgroundColor = "#f7b767";
const textColorPrimary = "#ffffff";
const textColorSecondary = "#333333";
const errorColor = "#B00020";
const surfaceColor = "#FFFFFF";
const dividerColor = "#E0E0E0";

const StarRate = ({ changeRating, rating, styles }) => {
  return <StarRating style={styles} rating={rating} onChange={changeRating} />;
};

export function AddReviewScreen({ route }) {
  const [addReview] = useAddReviewMutation();
  const [rating, setRating] = React.useState(0);
  const navigation = useNavigation();
  const userData = useSelector((state) => state.counter.userState);

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
        userId: userData?.data?.user?.user_id,
        companyId: route.params?.companyInfo?.companyId,
      };

      const sendReview = await addReview(final);

      if (sendReview?.data) {
        Notifier.showNotification({
          title: "Success!",
          description: "Review added successfully!",
          Component: NotifierComponents.Alert,
          componentProps: { alertType: "success" },
          duration: 3000,
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
        Component: NotifierComponents.Alert,
        componentProps: { alertType: "error" },
        duration: 3000,
      });
    } finally {
      reset();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: backgroundColor }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Add a review!"
              placeholderTextColor={dividerColor}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.textInput}
              multiline
              textAlignVertical="top"
            />
          )}
          name="review"
        />
        {errors.review && (
          <Text style={styles.errorText}>This field is required.</Text>
        )}

        <View style={styles.ratingAndButtonContainer}>
          <StarRate
            styles={styles.starRating}
            rating={rating}
            changeRating={setRating}
          />
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.85}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
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
    // height: 300,
    flex: 1,
    backgroundColor: surfaceColor,
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    color: textColorSecondary,
    borderColor: dividerColor,
    borderWidth: 1,
  },
  ratingAndButtonContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  starRating: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: primaryColor,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: primaryDarkColor,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: textColorPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: errorColor,
    marginTop: 8,
    fontSize: 14,
  },
});
