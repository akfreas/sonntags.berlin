import React, {Component} from "react";

import {
    Image,
    Button,
    Platform,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    WebView,
    PropTypes,
    StatusBar
} from "react-native";

import calendarDays from "../../assets/images/calendardays.png";
import Analytics from "react-native-firebase-analytics";
import NavigationBar from "react-native-navbar";
import styles from "../styles";

export default class NavWebView extends Component {


    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.title,
    });

    constructor(props) {
        super(props);
        Analytics.logEvent("open_web_view", {"url": props.uri});
    }

    rightButtonConfig() {
        return {
            title: "Close",
            handler: () => this.props.rightButtonPressed(),
          style: [{
          }],
        }
    }
    titleConfig() {
      return {
        title: this.props.title,
          style: {
              color: styles.primaryColor,
              fontFamily: "AGaramondPro-Bold",
          },
      }
    }

    render() {

        return(
            <View style={{flex: 1}}>
                 <StatusBar barStyle = "dark-content" hidden = {false}/>
                 <NavigationBar
                    rightButton={this.rightButtonConfig()}
                    title={this.titleConfig()}
                />
                <WebView
                    source={{uri: this.props.uri}}
                    style={{marginTop: 0, flex: 1}}
                />
            </View>
        )

    }

}


