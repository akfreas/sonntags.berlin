import React, { Component } from "react";
import { FlatList, View, Text, StyleSheet, Switch } from "react-native";

import moment from "moment";
import Hyperlink from "react-native-hyperlink";
import { loadOpenSundays } from "../actions";

import { create_i18n } from "../utilities";

var I18n = create_i18n();

class OpeningDayItem extends Component {
  render() {
    let dateMoment = moment(this.props.openDay.date);
    let day = dateMoment.format("DD");
    let month = dateMoment.format("MMM");
    return (
      <View style={{ height: 70.0, flex: 1 }}>
        <View style={{ flexDirection: "row", height: "100%" }}>
          <View
            style={{ height: "100%", width: 60.0, justifyContent: "center" }}
          >
            <View style={{ width: "70%", height: "70%", margin: "15%" }}>
              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: 14,
                  fontFamily: "AGaramondPro-Bold"
                }}
              >
                {month}
              </Text>
              <Text
                style={{
                  flex: 2,
                  fontSize: 22,
                  textAlign: "center",
                  fontFamily: "AGaramondPro-Bold"
                }}
              >
                {day}
              </Text>
            </View>
          </View>
          <View style={{ height: "100%", width: "80%", margin: 15 }}>
            <Text
              numberOfLines={2}
              style={{
                flex: 1,
                fontFamily: "AGaramondPro-Regular",
                fontSize: 16
              }}
            >
              {this.props.openDay.dayName}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default class OpeningDaysList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationsOn: false,
      days: []
    };
  }

  UNSAFE_componentWillMount() {
    loadOpenSundays().then(days => {
      let sorted = days.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      this.setState({
        days: sorted
      });
    });
  }

  renderRow(day) {
    return <OpeningDayItem openDay={day} />;
  }

  renderSeparator() {
    return <View style={{ height: StyleSheet.hairlineWidth }} />;
  }

  switchChanged(value) {
    this.setState({
      notificationsOn: value
    });
  }

  openWebsite() {
    const { navigate } = this.props.navigation;
    navigate("NavWebView", {
      title: "berlin.de",
      uri: "http://bit.ly/sonntags-berlin"
    });
  }

  renderHeader() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, margin: 10 }}>
          <Hyperlink
            linkStyle={{ color: "#2980b9" }}
            onPress={this.openWebsite.bind(this)}
          >
            <Text>
              <Text style={{ fontFamily: "AGaramondPro-Bold", fontSize: 16 }}>
                {I18n.t("opening_days_bold")}
                {"\n"}
              </Text>
              <Text
                style={{ fontFamily: "AGaramondPro-Regular", fontSize: 16 }}
              >
                {I18n.t("opening_days_text")}
              </Text>
              <Text
                style={{ fontFamily: "AGaramondPro-Regular", fontSize: 16 }}
              >
                {"\n\n"}
                {I18n.t("more_info")}
              </Text>
            </Text>
          </Hyperlink>
        </View>
        <View style={{ flex: 1, margin: 10 }}>
          <View style={{ flexDirection: "row" }}>
            {/*
                        <View style={{flex: 4}}>
                            <Text style={{fontFamily: "AGaramondPro-Bold"}}>Notify me when shops are open on Sundays.</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Switch style={{}} 
                                onValueChange={this.switchChanged.bind(this)}
                                value={this.state.notificationsOn}
                            />
                        </View>
                        */}
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <FlatList
        ItemSeparatorComponent={this.renderSeparator.bind(this)}
        ListHeaderComponent={this.renderHeader.bind(this)}
        data={this.state.days}
        keyExtractor={(item, index) => item.date || String(index)}
        renderItem={({ item }) => this.renderRow(item)}
        style={{ backgroundColor: "white" }}
      />
    );
  }
}
