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

import AppIntro from 'react-native-app-intro';


export default class IntroScreen extends Component {

    render() {
        const pageArray = [{
            title: 'Sonntags in Berlin',
            description: 'How to find what\'s open on Sundays in Berlin',

        }];
        return (
            <AppIntro
                pageArray={pageArray}/>
        )
    }

}
