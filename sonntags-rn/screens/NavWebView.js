import React, {Component} from 'react';

import {
    Image,
    Button,
    Platform,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    WebView,
    PropTypes
} from 'react-native';

import calendarDays from '../assets/images/calendardays.png';
import Analytics from 'react-native-firebase-analytics';




export default class NavWebView extends Component {


    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.title,
    });

    constructor(props) {
        super(props);
        Analytics.logEvent('open_web_view', {'url': props.uri});
    }

    render() {

        return(
            <WebView
                source={{uri: this.props.uri}}
                style={{marginTop: 0}}
            />
        )

    }

}


