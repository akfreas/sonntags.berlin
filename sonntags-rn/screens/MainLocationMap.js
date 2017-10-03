import MapView from 'react-native-maps';
import React, {Component} from 'react';
import { connect } from 'react-redux'

import {
    loadLocations,
    getUserLocation
} from '../actions';

import {
    TouchableOpacity,
    Text,
    View,
} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';
import Analytics from 'react-native-firebase-analytics';
import arrow from '../assets/images/map-annotation.png';
import arrowSelected from '../assets/images/arrow-selected.png';
import LocationListItem from '../components/LocationListItem.js';


class MainLocationMap extends Component {


    constructor(props) {
        super(props);
        this.state = {
            locations: [],
        }
    }

    componentDidMount() {
        loadLocations().then((locations) => {
            this.setState({
                locations: locations
            });
            this.props.getUserLocation();
        })
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

    locationSelected() {
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

    componentWillReceiveProps(nextProps) {

        this.setState({
            userLocation: nextProps.userLocation,
        });
    }

    arrowForLocation(location) {
        if (this.state.selectedLocation && location.id == this.state.selectedLocation.id) {
            return arrowSelected;
        } else {
            return arrow;
        }
    }

    render() {
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
                            let ref = `callout-${index}`;
                            let marker = <MapView.Marker
                                coordinate={latlong}
                                key={location.name}

                            ref={ref}
                            image={this.arrowForLocation(location)}
                            onPress={(marker) => {
                                this.setState({selectedLocation: location});
                            }}
                            identifier={location.id}
                            description={location.location.formattedAddress}>
                             </MapView.Marker>
                        return marker
                    })}
            </MapView>
            {this.state.selectedLocation &&
            <LocationListItem
                location={this.state.selectedLocation}
                userLocation={this.state.userLocation}
                distanceFromUser={this.distanceFromUser(this.state.selectedLocation)}
                onLocationSelected={this.locationSelected.bind(this)}
            />}

        </View>

        )
    }
}

function mapStateToProps(state) {
    return {
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getUserLocation: () => {
            return dispatch(getUserLocation())
        }
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(MainLocationMap);
