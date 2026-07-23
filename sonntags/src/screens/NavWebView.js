import React, { Component } from "react";

import { Text, TouchableOpacity, View, StatusBar } from "react-native";
import { WebView } from "react-native-webview";

import Analytics from "../utilities/analytics";
import styles from "../styles";

export default class NavWebView extends Component {
  constructor(props) {
    super(props);
    Analytics.logEvent("open_web_view", { url: props.uri });
  }

  // ponytail: react-native-navbar is dead; plain View header covers the modal case.
  // When shown as a nav screen the stack header renders the title instead.
  header() {
    if (!this.props.rightButtonPressed) {
      return null;
    }
    return (
      <View
        style={{
          height: 44,
          marginTop: 44,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white"
        }}
      >
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            color: styles.primaryColor,
            fontFamily: "AGaramondPro-Bold",
            fontSize: 17
          }}
          numberOfLines={1}
        >
          {this.props.title}
        </Text>
        <TouchableOpacity
          onPress={() => this.props.rightButtonPressed()}
          style={{ position: "absolute", right: 10, padding: 8 }}
        >
          <Text style={{ fontSize: 17 }}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" hidden={false} />
        {this.header()}
        <WebView
          source={{ uri: this.props.uri }}
          style={{ marginTop: 0, flex: 1 }}
        />
      </View>
    );
  }
}
