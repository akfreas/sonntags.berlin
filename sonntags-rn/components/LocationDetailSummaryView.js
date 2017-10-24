import React, {Component, PropTypes} from 'react';
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
} from 'react-native';
import moment from 'moment';

import Analytics from 'react-native-firebase-analytics';

import arrow from '../assets/images/map-annotation.png';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Hyperlink from 'react-native-hyperlink';
import LocationMapView from '../components/LocationMapView.js';

import { 
    pad,
    openExternalApp
} from '../utilities';
var styles = require('../assets/styles');

export default class LocationDetailSummaryView extends Component {
    render() {
        let closingTimeString = pad(this.props.location.closingTime, 4)
        let openingTimeString = pad(this.props.location.openingTime, 4)
        let closingTime = moment(closingTimeString, "HHmm").format("HH:mm")
        let openingTime = moment(openingTimeString, "HHmm").format("HH:mm")
        let distance = this.props.distanceFromUser ? Math.round(this.props.distanceFromUser * 100) / 100 : null;
 
        return(
            <View style={{flex: 1, padding: 10, backgroundColor: 'white'}}>
                <Text style={{fontFamily: 'Lato-Bold', fontSize: 24}}>{this.props.location.name}</Text>
                <View style={styles.locationListItemTitleContainer}>
                    <Text style={styles.locationListItemTitleText}>{this.props.location.address}</Text>
                    <Hyperlink linkStyle={{ color: '#2980b9'}} onPress={this.props.openWebsite.bind(this)}>
                        <Text style={styles.locationListItemDescriptionText}>Open Sundays, {openingTime} - {closingTime}</Text>
                        {distance ?
                            <Text style={styles.locationListItemDistanceText}>{distance} km away</Text> : <Text/>
                        }
                        <Text style={styles.locationListItemDescriptionText}>{this.props.location.websiteUrl}</Text>
                    </Hyperlink>
                    <Text style={styles.locationListItemDescriptionText}>{this.props.location.phoneNumber}</Text>
                </View>
            </View>
        )
    }
}
