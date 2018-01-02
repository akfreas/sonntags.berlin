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
import { pad } from '../utilities';


var styles = require('../styles');

export default class LocationListItem extends Component {


    constructor(props) {
        super(props);
    }

    render() {

        let closingTimeString = pad(this.props.location.closingTime, 4)
        let openingTimeString = pad(this.props.location.openingTime, 4)
        let closingTime = moment(closingTimeString, "HHmm").format("HH:mm")
        let openingTime = moment(openingTimeString, "HHmm").format("HH:mm")
        let distance = null;
        if (this.props.distanceFromUser) {
            distance = Math.round(this.props.distanceFromUser * 100) / 100;
        }
        return (
            <TouchableOpacity onPress={() => this.props.onLocationSelected(this.props.location,'list')}>
                    <View style={[styles.locationListItem]}>
                        <View style={styles.locationListItemTitleContainer}>
                            <Text style={styles.locationListItemTitleText}>{this.props.location.name}</Text>
                            <Text style={styles.locationListItemDescriptionText}>{openingTime} - {closingTime}</Text>
                            {distance &&
                                <Text style={styles.locationListItemDistanceText}>{distance} km</Text>
                            }
                        </View>
                    </View>
                </TouchableOpacity>

        )
    }
}

