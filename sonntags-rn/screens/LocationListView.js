import React, {Component} from 'react';
import MapView from 'react-native-maps';
import moment from 'moment';
import {
    ScrollView,
    ListView,
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
function pad(num, size){ return ('000000000' + num).substr(-size); }

class LocationListItem extends Component {


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
                            <Text style={styles.locationListItemDescriptionText}>Open {openingTime} - {closingTime}</Text>
                            <Text style={styles.locationListItemDescriptionText}>{distance} km</Text>
                            <Text></Text>
                        </View>
                    </View>
                </TouchableOpacity>

        )
    }
}


export default class LocationListView extends Component {

    static navigationOptions = {
        title: "Category"
    };

    constructor(props) {
        super(props);
        this.state = {
            locations: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        };
    }

    openMaps(location) {
        console.log(location);
        var url = 'https://www.google.com/maps/search/?api=1&query=' + location.address;
        this.openExternalApp(url)
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

    locationSelected(location) {
        this.openMaps(location);
    }

    distanceFromUser(location) {

        let userLocation = this.state.userLocation;
        if (userLocation == undefined || userLocation.coords == undefined) { 
            return 0.0
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

    componentWillMount() {
        
        loadLocations(this.props.category.id).then((locations) => {
            let sorted = this.locationsSortedByDistance(locations)
            let ds = this.state.dataSource.cloneWithRows(sorted);

            console.log("sorted: ", sorted);
            this.setState({
                locations: sorted,
                dataSource: ds,
            })
        })

        if (Platform.OS === 'android') {
          this.setState({
            errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
          });
        } else {
          this._getLocationAsync();
        }
    }

    _getLocationAsync = async () => {

        /*
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          this.setState({
            errorMessage: 'Permission to access location was denied',
          });
        }
        let userLocation = await Location.getCurrentPositionAsync({});
        let sorted = this.locationsSortedByDistance(this.state.locations)
        console.log("sorted: ", sorted);
        this.setState({ 
            userLocation: userLocation,
            locations: sorted
        });
        */
    };

    mapView() {
        return (
            <View style={{position: 'absolute', top: 0, left: 0, right: 0, height: '100%'}}>
                          <MapView
                  showsUserLocation={true}
                  showsCompass={false}
                  pitchEnabled={false}
                  rotateEnabled={false}
                  style={{flex: 1}}
                  initialRegion={{
                      latitude: 52.4944623,
                      longitude: 13.4034689,
                      latitudeDelta: 0.2922,
                      longitudeDelta: 0.3421,
                    }}>
                      {this.state.locations.map((location) => {
                        let latlong = {latitude: location.location.lat, longitude: location.location.lon};
                        let marker = <MapView.Marker
                            coordinate={latlong}
                            key={location.name}
                        title={location.name}
                        description={location.location.formattedAddress}/>
                    return marker
                })}
                </MapView>
            </View>
        )

    }



    renderHeader() {
        return (
            <View 
                style={[{backgroundColor: 'rgba(0,0,0,0)', height: 400.0}]}
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

