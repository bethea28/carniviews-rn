import React, { useRef } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.75;
const CARD_HEIGHT = 450;

const colors = [
  "#B0604D",
  "#899F9C",
  //   "#B3C680",
  "#5C6265",
  //   "#F5D399",
  //   "#F1F1F1",
  "#D1A6A6",
  "#7EB6B8",
];

export const StoryCarousel = () => {
  const ref = useRef(null);

  const renderItem = ({ item, index, animationValue }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const rotate = interpolate(
        animationValue.value,
        [index - 1, index, index + 1],
        [-5, 0, 5],
        Extrapolate.CLAMP
      );

      return {
        transform: [{ rotate: `${rotate}deg` }],
      };
    });

    return (
      <Animated.View
        style={[styles.card, { backgroundColor: item }, animatedStyle]}
      >
        <Text style={styles.text}>Card {index + 1}</Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        ref={ref}
        data={colors}
        renderItem={renderItem}
        width={400}
        // height={500}
        loop
        mode="horizontal-stack"
        pagingEnabled
        snapEnabled
        defaultIndex={1}
        modeConfig={
          {
            //   snapDirection: "left",
            //   stackInterval: 30,
            //   scaleInterval: 0.05,
            //   //   rotateZDeg: 0,
            //   showLength: 5,
          }
        }
        customConfig={() => ({
          type: "positive",
          viewCount: 5,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 370,
    // height: 200,
    borderRadius: 16,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  text: {
    fontSize: 22,
    color: "#fff",
  },
});
