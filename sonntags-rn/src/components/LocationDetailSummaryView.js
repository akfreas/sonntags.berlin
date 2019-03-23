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
                            <Text style={[styles.locationListItemTitleText, {padding: 0}]}>
                                {/* <Icon name={this.props.location.iconName} size={24}/> */}
                                {""}{this.props.location.tags}
                            </Text>
                            {this.props.location.address ?
                                <Text style={styles.locationListItemTitleText}>{this.props.location.address}</Text> : <View/>
                            }
                            {this.props.location.description ? 
                                <Text style={styles.locationSummaryViewDescriptionText}>{this.props.location.description}</Text> : null
                            }
                                <Hyperlink linkStyle={{ color: "#2980b9"}} onPress={this.props.openWebsite.bind(this)}>
                                {distance ?
                                    <Text style={styles.locationSummaryViewDistanceText}>{distance} {I18n.t("distance")}</Text> : <Text/>
                                }
                                <Text style={styles.locationSummaryViewDescriptionTitle}>{this.props.location.websiteUrl}</Text>
                            </Hyperlink>
                            <Hyperlink linkStyle={{ color: "#2980b9"}} onPress={() => this.props.startPhoneCall()}>
                                <Text style={styles.locationSummaryViewDescriptionTitle}>{this.props.location.phoneNumber}</Text>
                            </Hyperlink>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
