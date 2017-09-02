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



export default class NavWebView extends Component {


    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.title,
    });

    render() {

        return(
            <WebView
                source={{uri: this.props.uri}}
                style={{marginTop: 0}}
            />
        )

    }

}


