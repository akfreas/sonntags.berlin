import React, {Component} from 'react';
import MapView from 'react-native-maps';
import moment from 'moment';
import {
    ScrollView,
    FlatList,
    Image,
    Dimensions,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Modal,
    AnimatedValue,
    Animated,
    StyleSheet,
    Platform,
    Linking
} from 'react-native';

import { StatusBar } from 'react-native';


import {
    loadLocations,
    getUserLocation,
} from '../actions';

import Analytics from 'react-native-firebase-analytics';
import Icon from 'react-native-vector-icons/Entypo';
import LocationListItem from '../components/LocationListItem.js';
import LocationCallout from '../components/LocationCallout.js';
import HamburgerBars from '../components/HamburgerBars.js';
import NavigationBar from 'react-native-navbar';
import arrow from '../assets/images/map-annotation.png';
import { connect } from 'react-redux'

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


class LocationListView extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.category.name,
        headerRight:<HamburgerBars onPress={()=> navigation.state.params.showList()}/>
    });

    constructor(props) {
        super(props);
        this.state = {
            locations: [],
            modalVisible: false,
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
        this.setState({
            modalVisible: false
        });
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

    showList() {
        this.setState({
            modalVisible: true
        });
    }


    componentDidMount() {
        this.props.navigation.setParams({showList: this.showList.bind(this)});

        loadLocations(this.props.category).then((locations) => {
            let sorted = locations
            if (this.props.userLocation) {
                sorted = this.locationsSortedByDistance(locations);
            }
            this.setState({
                locations: sorted,
            })
        }).then(()=>{
            this.props.getUserLocation();
        })
    }

    componentDidUpdate() {
        let markers = this.state.locations.map((location) => {
            return location.id;
        })
        //this.map.fitToSuppliedMarkers(markers, true);
    }


    componentWillReceiveProps(nextProps) {

        this.setState({
            userLocation: nextProps.userLocation,
        });
        let sorted = this.locationsSortedByDistance(this.state.locations);
        this.setState({
            locations: sorted,
        });
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
                          let key = location.name;
                          if (location.sourceId) {
                              key = key + "_" + location.sourceId
                          }
                        let latlong = {latitude: location.location.lat, longitude: location.location.lon};
                        let marker = <MapView.Marker
                            coordinate={latlong}
                            key={key}

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

    rightButtonConfig() {
        return {
            title: 'Close',
            handler: () => this.setState({modalVisible: false}),
          style: [{
          }],
        }
    }
    titleConfig() {
      return {
        title: this.props.category.name,
          style: {
              color: '#3BB9BD',
              fontFamily: 'Lato-Bold',
          },
      }
    }

    render() {

        let width = Dimensions.get('window').width
        let height = Dimensions.get('window').height
        return (
        <View style={{flex: 1}}>

            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => {}}
            >
                <StatusBar barStyle = "dark-content" hidden = {false}/>
                <NavigationBar
                    rightButton={this.rightButtonConfig()}
                    title={this.titleConfig()}
                />

                <View style={{flex: 1, backgroundColor: '#C2FDFF'}}>
                    <View>
                        <Image style={{
                            height: width, 
                            width: width, 
                            position: 'absolute', 
                            bottom: -height,
                            left: 0,
                        }} source={require('../assets/images/icon_background.png')}/>
                        </View>
                     <FlatList
                        ItemSeparatorComponent={({highlighted}) => (
                            <View style={[styles.locationListItemSeparator, highlighted && {marginLeft: 0}]} />
                       )}
                       contentContainerStyle={{justifyContent: 'center', backgroundColor: 'white'}}
                        style={{backgroundColor: 'transparent', flex: 1}}
                        data={this.state.locations}
                        bounces={false}
                        extraData={this.state.locations}
                        renderItem={({item}) => this.renderRow(item)}
                        keyExtractor={item => item.id}
                    />
                </View>
            </Modal>

             <StatusBar barStyle = "light-content" hidden = {false}/>
            {this.mapView()}
        </View>
        );
    }

}

function mapStateToProps(state) {
    return {
        userLocation: state.main.userLocation,
        drawerGesturesEnabled: state.main.drawerGesturesEnabled,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getUserLocation: () => {
            return dispatch(getUserLocation());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationListView);
