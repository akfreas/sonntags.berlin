import React from "react";
import { ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import styles from "../styles";
import OpeningDays from "../screens/OpeningDays";
import LocationDetailView from "../screens/LocationDetailView.js";
import NavWebView from "../screens/NavWebView.js";
import MainLocationMap from "../screens/MainLocationMap";
import AppInfoPage from "../screens/AppInfoPage";
import { create_i18n } from "../utilities";

var I18n = create_i18n();

const paramsToProps = SomeComponent => {
  // turns route.params into props.<x>, same as the old v4 wrapper did
  return class extends React.Component {
    render() {
      const { route } = this.props;
      return <SomeComponent {...this.props} {...(route.params || {})} />;
    }
  };
};

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: styles.constants.primaryColor
  },
  headerBackTitle: "",
  headerTitleStyle: styles.headerTitleStyle,
  headerTintColor: "black"
};

const Stack = createStackNavigator();

export function RootStackNavigator() {
  return (
    <Stack.Navigator screenOptions={defaultNavOptions}>
      <Stack.Screen
        name="Main"
        component={paramsToProps(MainLocationMap)}
        options={({ route }) => ({
          title: "STIL IN BERLIN",
          headerRight: () => (
            <ActivityIndicator
              style={{ padding: 5 }}
              size="small"
              color="#000"
              animating={(route.params && route.params.isLoading) || false}
            />
          )
        })}
      />
      <Stack.Screen
        name="OpenSundays"
        component={paramsToProps(OpeningDays)}
        options={{ title: I18n.t("special_opening_days_title") }}
      />
      <Stack.Screen
        name="NavWebView"
        component={paramsToProps(NavWebView)}
        options={({ route }) => ({
          title: (route.params && route.params.title) || ""
        })}
      />
      <Stack.Screen
        name="LocationDetail"
        component={paramsToProps(LocationDetailView)}
      />
      <Stack.Screen
        name="AppInfoPage"
        component={paramsToProps(AppInfoPage)}
        options={{ title: I18n.t("about_screen_title") }}
      />
    </Stack.Navigator>
  );
}
