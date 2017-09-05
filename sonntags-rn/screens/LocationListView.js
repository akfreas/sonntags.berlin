import React, {Component} from 'react';
import MapView from 'react-native-maps';
import moment from 'moment';
import {
    ScrollView,
    ListView,
    Dimensions,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    AnimatedValue,
    Animated,
    StyleSheet,
    Platform,
    Linking
} from 'react-native';

import {
    loadLocations
} from '../actions';

import Analytics from 'react-native-firebase-analytics';
import Icon from 'react-native-vector-icons/Entypo';
import LocationListItem from '../components/LocationListItem.js';
import LocationCallout from '../components/LocationCallout.js';
import arrow from '../assets/images/map-annotation.png';

var styles = StyleSheet.create({
    locationListItem: {
        padding: 10.0,
        height: 95.0,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff'//rgba(255,255,255,1)
    },
    locationListItemDistanceContainer: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'purple',
    },
    locationListItemTitleContainer: {
        flex: 1.0,
        alignItems: 'flex-start',
    },
    locationListItemDescriptionText: {
    },
    locationListItemTitleText: {
        color: 'black',
        fontWeight: 'bold',
        height: 25.0,
    },

    locationListItemSeparator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgb(233, 238, 255)',
    }
})

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}


export default class LocationListView extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.category.typeName,
    });
    constructor(props) {
        super(props);
        this.state = {
            locations: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        };
    }

    openExternalApp(url) {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log('Don\'t know how to open URI: ' + url);
        }
      });
    }

    locationSelected(location, source) {
        const { navigate } = this.props.navigation; 
        var userLocation = "undefined"
        if (this.state.userLocation) {
            let userLocation = this.state.userLocation;
            userLocation = JSON.stringify({'lat': userLocation.coords.latitude, 'lon': userLocation.coords.longitude});
        }
        Analytics.logEvent('location_selected', {
            'location_name': location.name, 
            'user_location': userLocation, 
            'source': source,
            'distance_from_user': this.distanceFromUser(location)
        });
        navigate('LocationDetail', {location: location, distanceFromUser: this.distanceFromUser(location)});
    }

    distanceFromUser(location) {

        let userLocation = this.state.userLocation;
        if (userLocation == undefined || userLocation.coords == undefined) { 
            return null
        }

        let distance = getDistanceFromLatLonInKm(
            userLocation.coords.latitude,  
            userLocation.coords.longitude,
            location.location.lat,
            location.location.lon)
        return distance
    }

    locationsSortedByDistance(locations) {
        
        let sortedLocations = locations.sort((a, b) => {
            let distanceA = this.distanceFromUser(a);
            let distanceB = this.distanceFromUser(b);
            let retVal = distanceA - distanceB;
            return retVal;
        });

        return sortedLocations;

    }

    renderRow(location) {
        return (
            <LocationListItem 
                location={location}
                userLocation={this.state.userLocation}
                distanceFromUser={this.distanceFromUser(location)}
                onLocationSelected={this.locationSelected.bind(this)}
            />
        )
    }


    componentDidMount() {
        loadLocations(this.props.category.id).then((locations) => {
            let ds = this.state.dataSource.cloneWithRows(locations);

            this.setState({
                locations: locations,
                dataSource: ds,
            })
        }).then(()=>{
            this._getLocationAsync();
        })
        /*
                */
    }

    componentDidUpdate() {
        let markers = this.state.locations.map((location) => {
            return location.id;
        })
        this.map.fitToSuppliedMarkers(markers, true);
    }

    _getLocationAsync() {
        console.log("getting location");
        navigator.geolocation.getCurrentPosition((position) => {
            console.log("position: " + position.latitude);
            var userLocation = position;
            this.setState({ 
                userLocation: userLocation,
            });
            let sorted = this.locationsSortedByDistance(this.state.locations)
            this.setState({
                locations: sorted
            });
        },(error) => {
        } ,
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );

        /*
     var us = this;
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      us.setState({lastPosition});
    });

        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          this.setState({
            errorMessage: 'Permission to access location was denied',
          });
        }
        let userLocation = await Location.getCurrentPositionAsync({});
        */
    };
    onCalloutPressed (index) {
        console.log("location pressed");
    }
    mapView() {
        return (
            <View ref="mainView" style={{position: 'absolute', top: 0, left: 0, right: 0, height: '100%', width: '100%'}}>
                <MapView
                    ref={ref=> {this.map = ref; }}
                  showsUserLocation={true}
                  showsCompass={false}
                  pitchEnabled={false}
                  rotateEnabled={false}

                  initialRegion={{
          latitude: 52.4944623,
          longitude: 13.4034689,
          latitudeDelta: 0.2922,
          longitudeDelta: 0.3421,
        }}
                  style={{flex: 1}}>
                  
                      {this.state.locations.map((location, index) => {
                        let latlong = {latitude: location.location.lat, longitude: location.location.lon};
                        let marker = <MapView.Marker
                            coordinate={latlong}
                            key={location.name}

                        ref={`callout-${index}`}
                        zIndex={this.state.selectedCalloutIndex === index ? 999 : 0}
                        image={arrow}
                        onCalloutPress={()=>this.locationSelected(location, 'map')}
                        identifier={location.id}
                        title={location.name.length > 20 ? location.name.split(" ")[0] : location.name}
                        description={location.location.formattedAddress}>
                        <MapView.Callout  style={{flex: 1, flexDirection: 'row', padding: 5}}>
                              <Text style={{fontFamily: 'Lato-Bold'}}>{location.name}</Text>
                              <Icon
                                  style={{textAlign: 'center', marginTop: -1}}
                                  name='chevron-small-right'
                                  size={20}
                              >
                              </Icon>
                        </MapView.Callout>

                         </MapView.Marker>
                    return marker
                })}
                </MapView>
            </View>
        )

    }

    renderHeader() {
        return (
            <View 
                style={[{backgroundColor: 'rgba(0,0,0,0)', height: Dimensions.get('window').height * 0.5}]}
            >
            {this.mapView()}
        </View>

            )
    }

    renderSeparator() {
        return (<View style={styles.locationListItemSeparator}/>)
    }

    render() {

        return (
        <View style={{flex: 1}}>
             <ListView
                renderHeader={this.renderHeader.bind(this)}
                renderSeparator={this.renderSeparator.bind(this)}
                contentContainerStyle={{justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0)'}}
                style={{backgroundColor: 'rgba(0,0,0,0)', flex: 1}}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
            />

        </View>
        );
    }

}

