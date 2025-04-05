import * as React from "react";
import { View, useWindowDimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { ReviewScreen } from "@/app/Screens/ReviewScreen";
import { DetailsScreen } from "@/app/Screens/DetailsScreen";
import { BusinessHours } from "@/app/Screens/BusinessHours";
// import {}
const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#ff4081" }} />
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#673ab7" }} />
);
const ThirdRoute = () => (
  <View style={{ flex: 1, backgroundColor: "yellow" }} />
);

const renderScene = SceneMap({
  first: DetailsScreen,
  second: ReviewScreen,
  third: BusinessHours,
});

const routes = [
  { key: "first", title: "Details" },
  { key: "second", title: "Reviews" },
  { key: "third", title: "Hours" },
];

export const TabComponent = ({ navIndex }) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(navIndex);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
};
