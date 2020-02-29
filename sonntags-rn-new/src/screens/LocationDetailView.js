import React, { Component, PropTypes } from "react";
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ListView
} from "react-native";
import moment from "moment";

import Analytics from "react-native-firebase-analytics";

import arrow from "../../assets/images/map-annotation.png";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Hyperlink from "react-native-hyperlink";
import LocationMapView from "../components/LocationMapView";
import LocationDetailSummaryView from "../components/LocationDetailSummaryView";

import { pad, openExternalApp } from "../utilities";
var styles = require("../styles");

export default class LocationDetailView extends Component {
  openWebsite() {
    const { navigate } = this.props.navigation;
    navigate("NavWebView", {
      title: this.props.location.name,
      uri: this.props.location.websiteUrl
    });
  }

  render() {
    let location = this.props.location;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <LocationDetailSummaryView
            location={this.props.location}
            openWebsite={this.openWebsite.bind(this)}
            style={{ flex: 0.5 }}
          />
          <LocationMapView
            locations={[location]}
            initialZoomLevel={11}
            style={{ flex: 1 }}
            centerCoordinate={{
              latitude: this.props.location.location.lat,
              longitude: this.props.location.location.lon
            }}
          />
        </View>
      </View>
    );
  }

  openInMaps() {
    Analytics.logEvent("open_maps", {
      location_name: this.props.location.name
    });
    var url =
      "https://www.google.com/maps/search/?api=1&query=" +
      this.props.location.address;
    openExternalApp(url);
  }

  componentDidMount() {}

  componentDidUpdate() {
    console.log("location: " + this.props.location.name);
  }
}
