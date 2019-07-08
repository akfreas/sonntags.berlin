import React, {Component, PropTypes} from "react";
import {
  Text,
  View,
  Image
} from "react-native";

import Analytics from "react-native-firebase-analytics";

import arrow from "../../assets/images/map-annotation.png";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Hyperlink from "react-native-hyperlink";
import LocationMapView from "../components/LocationMapView.js";
import {create_i18n} from "../utilities";

var I18n = create_i18n();
import { 
    pad,
    openExternalApp
} from "../utilities";
var styles = require("../styles");

export default class LocationDetailSummaryView extends Component {
    render() {
        let distance = this.props.distanceFromUser ? Math.round(this.props.distanceFromUser * 100) / 100 : null;
        return(
            <View style={{flex: 1, flexDirection: "row"}}>
                
                <View style={{flex: 8, padding: 0, backgroundColor: "white"}}>
                {this.props.location.imageUrl ? 
                    <Image 
                        style={{flex:1, height: 100}}
                        source={{uri: this.props.location.imageUrl}}/>
                    : null}
                    <View style={{flex: 8, padding: 14, backgroundColor: "white"}}>
                        <Text style={styles.locationSummaryViewTitle}>{this.props.location.name}</Text>
                        <View style={styles.locationListItemTitleContainer}>
                            
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
