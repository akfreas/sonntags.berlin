import React, {Component} from 'react';
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


var styles = require('../assets/styles');

function pad(num, size){ return ('000000000' + num).substr(-size); }
export default class LocationListItem extends Component {


    render() {

        let closingTimeString = pad(this.props.location.closingTime, 4)
        let openingTimeString = pad(this.props.location.openingTime, 4)
        let closingTime = moment(closingTimeString, "HHmm").format("HH:mm")
        let openingTime = moment(openingTimeString, "HHmm").format("HH:mm")
        let distance = this.props.distanceFromUser.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        return (
            <TouchableOpacity onPress={() => this.props.onLocationSelected(this.props.location)}>
                    <View style={[styles.locationListItem]}>
                        <View style={styles.locationListItemTitleContainer}>
                            <Text style={styles.locationListItemTitleText}>{this.props.location.name}</Text>
                            <Text style={styles.locationListItemDescriptionText}>{openingTime} - {closingTime}</Text>
                            <Text style={styles.locationListItemDistanceText}>{distance} km</Text>
                            <Text></Text>
                        </View>
                    </View>
                </TouchableOpacity>

        )
    }
}


