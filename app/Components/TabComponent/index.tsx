import * as React from "react";
import { View, useWindowDimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { ReviewScreen } from "@/app/Screens/ReviewScreen";
import { DetailsScreen } from "@/app/Screens/DetailsScreen";
import { BusinessHours } from "../BusinessHours";
import { BandStoriesScreen } from "@/app/Screens/BandStoriesScreen";

export const TabComponent = ({ params, navIndex }) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(navIndex);

  const renderScene = SceneMap({
    first: () => <DetailsScreen />,
    second: () => <ReviewScreen />,
    third: () => <BandStoriesScreen />,
    // third: () => <BusinessHours referrer="tabs" />,
  });

  const routes = [
    { key: "first", title: "Details" },
    { key: "second", title: "Reviews" },
    { key: "third", title: "Band Stories" },
  ];

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
};
