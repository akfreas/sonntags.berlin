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

import arrow from '../assets/images/map-annotation.png';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Hyperlink from 'react-native-hyperlink';

import { 
    pad,
    openExternalApp
} from '../utilities';
var styles = require('../assets/styles');

export default class LocationDetailView extends Component {

    openWebsite() {
        const { navigate } = this.props.navigation;
        navigate('NavWebView', {title: this.props.location.name, uri: this.props.location.websiteUrl});
    }

    render() {
        let closingTimeString = pad(this.props.location.closingTime, 4)
        let openingTimeString = pad(this.props.location.openingTime, 4)
        let closingTime = moment(closingTimeString, "HHmm").format("HH:mm")
        let openingTime = moment(openingTimeString, "HHmm").format("HH:mm")
        let distance = Math.round(this.props.distanceFromUser * 100) / 100;
 
        let location = this.props.location;
        return(
            <View style={{position: 'absolute', top: 0, left: 0, right: 0, height: '100%', width: '100%'}}>
          <View style={{flex: 3}}>
            <MapView
                ref={ref=> {this.map = ref; }}
              showsUserLocation={true}
              initialRegion={{
                  latitude: 52.4944623,
                  longitude: 13.4034689,
                  latitudeDelta: 0.2922,
                  longitudeDelta: 0.3421,
                }}
              showsCompass={false}
              pitchEnabled={false}
              rotateEnabled={false}
              style={{flex: 3}}>
              <MapView.Marker coordinate={{
                      latitude: location.location.lat, 
                      longitude: location.location.lon
              }}
                  key={location.name}
                  image={arrow}
              />
          </MapView>
              <View style={{flex: 2, padding: 10, backgroundColor: 'white'}}>
                  <Text style={{fontFamily: 'Lato-Bold', fontSize: 24}}>{this.props.location.name}</Text>
                        <View style={styles.locationListItemTitleContainer}>
                            <Text style={styles.locationListItemTitleText}>{this.props.location.address}</Text>
                            <Hyperlink linkStyle={{ color: '#2980b9'}} onPress={this.openWebsite.bind(this)}>
                            <Text style={styles.locationListItemDescriptionText}>Open Sundays, {openingTime} - {closingTime}</Text>
                            <Text style={styles.locationListItemDistanceText}>{distance} km away</Text>
                                <Text style={styles.locationListItemDescriptionText}>{this.props.location.websiteUrl}</Text>
                            </Hyperlink>
                            <Text style={styles.locationListItemDescriptionText}>{this.props.location.phoneNumber}</Text>
                        </View>

              </View>
              <View style={{flex: 2, padding: 20, backgroundColor: 'white', flexDirection: 'row'}}>
                  <TouchableOpacity onPress={this.openInMaps.bind(this)}>
                      <Icon
                          style={{textAlign: 'center'}}
                          name='google-maps'
                          size={60}
                      >
                      </Icon>
                      <Text style={{fontFamily: 'Lato-Regular', textAlign: 'center'}}>Open in Maps</Text>
                  </TouchableOpacity>
              </View>
          </View> 
      </View>
        )
    }

    openInMaps() {
        Analytics.logEvent('open_maps', {'location_name': this.props.location.name});
        var url = 'https://www.google.com/maps/search/?api=1&query=' + this.props.location.address;
        openExternalApp(url)
    }

    componentDidMount() {

        if (Platform.OS === 'ios') {
            this.map.animateToRegion(
            {
              latitude: this.props.location.location.lat,
              longitude: this.props.location.location.lon,
              latitudeDelta: 0.015,
              longitudeDelta: 0.015,
            })
        }

    }
    
    componentDidUpdate() {

        console.log("location: " + this.props.location.name);
    }
}
