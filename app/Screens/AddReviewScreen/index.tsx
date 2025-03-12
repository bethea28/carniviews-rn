import React from "react";
import { Text, View, TextInput, Button, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useAddReviewMutation } from "@/store/api/api";
import StarRating from "react-native-star-rating-widget";

const StarRate = ({ changeRating, rating, styles }) => {
  console.log("rating now", rating);
  return <StarRating style={styles} rating={rating} onChange={changeRating} />;
};

export function AddReviewScreen() {
  const [addReview] = useAddReviewMutation();
  const [rating, setRating] = React.useState(0);
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
      console.log("handling now gppd", data);
      const final = { review: data.review, rating };
      addReview(final);
      // const req = await fetch("http://127.0.0.1:8000/bryan/bookPost/", {
      //   method: "POST",
      //   // headers: {
      //   //   "Content-Type": "application/json", // Important!
      //   // },
      //   body: JSON.stringify(data), // Convert data to JSON string
      // });

      // const resp = await req.json();
      // console.log("resp", resp);
    } catch (error) {
      console.log("error", error);
    } finally {
      reset();
    }
    console.log("data,data", data);
  };

  return (
    <>
      <View style={{ padding: 20 }}>
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
              //   style={[styles.input, { height: height }]} // Apply dynamic height
              style={{
                height: 300,
                backgroundColor: "yellow",
                borderRadius: 30,
                padding: 20,
              }} // Apply dynamic height
              multiline={true} // Enable multiline
              //   onContentSizeChange={handleContentSizeChange} // Track content size
            />
          )}
          name="review"
        />
        {errors.review && <Text>This is required.</Text>}
        <View style={{ alignItems: "center" }}>
          <StarRate
            styles={{ marginTop: 30 }}
            rating={rating}
            changeRating={setRating}
          />
          <Button
            // style={{ maringTop: 10 }}
            color="blue"
            title="Submit"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </>
  );
}
