import React from "react";

import { View } from "react-native";

var styles = require("../styles");

import { MonoText } from "../components/StyledText";

import LocationListItem from "../components/LocationListItem";
import CategorySelectionList from "../components/CategorySelectionList";
import { loadLocations } from "../actions";

var styles2 = require("../styles");

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: []
    };
  }

  UNSAFE_componentWillMount() {
    loadLocations().then(locations => {
      this.setState({
        locations: locations
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <CategorySelectionList />
      </View>
    );
  }
}
