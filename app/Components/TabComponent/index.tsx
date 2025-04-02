import * as React from "react";
import { View, useWindowDimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";

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
  first: FirstRoute,
  second: SecondRoute,
  third: ThirdRoute,
});

const routes = [
  { key: "first", title: "First" },
  { key: "second", title: "Second" },
  { key: "third", title: "Third" },
];

export const TabComponent = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  console.log("test this now");
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
};
