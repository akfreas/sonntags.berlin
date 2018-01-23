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

import Analytics from 'react-native-firebase-analytics';

import arrow from '../../assets/images/map-annotation.png';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Hyperlink from 'react-native-hyperlink';
import LocationMapView from '../components/LocationMapView.js';
import {create_i18n} from '../utilities';

var I18n = create_i18n();
import { 
    pad,
    openExternalApp
} from '../utilities';
var styles = require('../styles');

export default class LocationDetailSummaryView extends Component {
    render() {
        let distance = this.props.distanceFromUser ? Math.round(this.props.distanceFromUser * 100) / 100 : null;
        return(
            <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 8, padding: 15, backgroundColor: 'white'}}>
                    <Text style={{fontFamily: 'Lato-Bold', fontSize: 24}}>{this.props.location.name}</Text>
                    <View style={styles.locationListItemTitleContainer}>
                        <Text style={[styles.locationListItemTitleText, {padding: 0}]}>
                            <Icon name={this.props.location.iconName} size={24}/>
                            {' '}{this.props.location.localizedCategory}
                        </Text>
                        {this.props.location.address ?
                            <Text style={styles.locationListItemTitleText}>{this.props.location.address}</Text> : <View/>
                        }
                        <Hyperlink linkStyle={{ color: '#2980b9'}} onPress={this.props.openWebsite.bind(this)}>
                            <Text style={styles.locationListItemDescriptionText}>{this.props.location.openingHoursString}</Text>
                            {distance ?
                                <Text style={styles.locationListItemDistanceText}>{distance} {I18n.t('distance')}</Text> : <Text/>
                            }
                            <Text style={styles.locationListItemDescriptionText}>{this.props.location.websiteUrl}</Text>
                        </Hyperlink>
                        <Hyperlink linkStyle={{ color: '#2980b9'}} onPress={() => this.props.startPhoneCall()}>
                            <Text style={styles.locationListItemDescriptionText}>{this.props.location.phoneNumber}</Text>
                        </Hyperlink>
                    </View>
                </View>
                {this.props.showChevron &&
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Icon
                        name={'chevron-up'}
                        size={32}
                        color={'black'}
                    />
                </View>
                }
            </View>
        )
    }
}
