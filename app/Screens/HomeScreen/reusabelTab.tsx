import * as React from "react";
import { View, useWindowDimensions, Text } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
const FirstRoute = () => <Text>firt</Text>;
const SecondRoute = () => <Text>second</Text>;
const ThirdRoute = () => <Text>thrird</Text>;

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third: ThirdRoute,
});

export function ReusableTab({ views }) {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const routes = views.reduce((acc, curr) => {
    return [...acc, { key: curr.key, title: curr.title }];
  }, []);

  const scene = views.reduce((acc, curr) => {
    return { ...acc, [curr.key]: curr.route };
  }, {});
  const renderScene = SceneMap(scene);
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}
