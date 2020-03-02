import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import styles from "../styles";
import CategorySelectionList from "../screens/CategorySelectionList";
import OpeningDays from "../screens/OpeningDays";
import LocationDetailView from "../screens/LocationDetailView.js";
import NavWebView from "../screens/NavWebView.js";
import MainLocationMap from "../screens/MainLocationMap";
import AppInfoPage from "../screens/AppInfoPage";
import { NavigationContainer } from "@react-navigation/native";

class TestComponent extends React.Component {
  render() {
    return <div>hi</div>;
  }
}

const paramsToProps = SomeComponent => {
  // turns this.props.navigation.state.params into this.params.<x>
  return class extends React.Component {
    static navigationOptions = SomeComponent.navigationOptions;
    // everything else, call as SomeComponent
    render() {
      const { navigation, ...otherProps } = this.props;
      const {
        state: { params }
      } = navigation;
      console.log(navigation);
      return <SomeComponent {...this.props} {...params} />;
    }
  };
};
const defaultNavOptions = {
  headerStyle: {
    backgroundColor: styles.constants.primaryColor
  },
  headerBackTitle: null,
  headerTitleStyle: styles.headerTitleStyle,
  headerTintColor: "white"
};

const Stack = createStackNavigator();

export function RootStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainLocationMap} />
    </Stack.Navigator>
  );
}

// {
//     Main: {
//       screen: paramsToProps(MainLocationMap),
//       navigationOptions: defaultNavOptions
//     },
//     OpenSundays: {
//       screen: paramsToProps(OpeningDays),
//       navigationOptions: defaultNavOptions
//     },
//     NavWebView: {
//       screen: paramsToProps(NavWebView),
//       navigationOptions: defaultNavOptions
//     },
//     LocationDetail: {
//       screen: paramsToProps(LocationDetailView),
//       navigationOptions: defaultNavOptions
//     },
//     AppInfoPage: {
//       screen: paramsToProps(AppInfoPage),
//       navigationOptions: defaultNavOptions
//     }
//   });
