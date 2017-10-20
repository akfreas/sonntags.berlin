import React, {Component} from 'react';
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
  AdMobBanner, 
  AdMobInterstitial, 
  PublisherBanner,
  AdMobRewarded
} from 'react-native-admob'



import {
    loadLocations,
    getUserLocation,
    distanceFromUserLocation,
} from '../actions';

import Analytics from 'react-native-firebase-analytics';
import Icon from 'react-native-vector-icons/Entypo';
import LocationCallout from '../components/LocationCallout.js';
import HamburgerBars from '../components/HamburgerBars.js';
import NavigationBar from 'react-native-navbar';
import LocationListView from '../components/LocationListView';
import arrow from '../assets/images/map-annotation.png';
import { connect } from 'react-redux'
import LocationMapView from '../components/LocationMapView'; 
import LocationListItem from '../components/LocationListItem';

class MainLocationMap extends Component {

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
            modalVisible: false,
            selectedLocation: location
        });
        const { navigate } = this.props.navigation;
        var userLocation = "undefined"
        if (this.state.userLocation) {
            let userLocation = this.state.userLocation;
            userLocation = JSON.stringify({'lat': userLocation.coords.latitude, 'lon': userLocation.coords.longitude});
        }
        let distanceFromUser = distanceFromUserLocation(location, this.state.userLocation);
        Analytics.logEvent('location_selected', {
            'location_name': location.name,
            'user_location': userLocation,
            'source': source,
            'distance_from_user': distanceFromUser
        });
        navigate('LocationDetail', {
            location: location, 
            distanceFromUser: distanceFromUser
        });
    }

    

    locationsSortedByDistance(locations) {

        let sortedLocations = locations.sort((a, b) => {
            let distanceA = distanceFromUserLocation(a, this.state.userLocation);
            let distanceB = distanceFromUserLocation(b, this.state.userLocation);
            let retVal = distanceA - distanceB;
            return retVal;
        });

        return sortedLocations;

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
                <LocationMapView
                    locations={this.state.locations}
                    centerLocation={this.props.userLocation}
                    onAnnotationTapped={this.onAnnotationTapped.bind(this)}
                /> 
            <AdMobBanner
                  bannerSize="smartBannerPortrait"
                  adUnitID="ca-app-pub-5197876894535655/8159389107"
                  testDeviceID="EMULATOR"
                  didFailToReceiveAdWithError={this.bannerError} />

            </View>
        )

    }

    onAnnotationTapped(annotation) {
        let selectedLocation = this.state.locations.find((object)=> object.id == annotation.id);
        this.setState({
            selectedLocation: selectedLocation
        });
    }
       
    modalView() {
        return (
             <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => {}}
            >
                <LocationListView 
                    category={this.props.category}
                    locations={this.state.locations}
                    userLocation={this.props.userLocation}
                    onCloseButtonTapped={() => this.setState({modalVisible: false})}
                    onLocationSelected={this.locationSelected.bind(this)}
                />
            </Modal>
        )
    }

    render() {

        let width = Dimensions.get('window').width
        let height = Dimensions.get('window').height
        let itemView = null;
        if (this.state.selectedLocation) {
            itemView = (
                <View style={{backgroundColor: 'white', position: 'absolute', bottom: 0, width: width}}>
                    <LocationListItem 
                        location={this.state.selectedLocation}
                        userLocation={this.props.userLocation}
                        distanceFromUser={distanceFromUserLocation(this.state.selectedLocation, this.props.userLocation)}
                        onLocationSelected={this.locationSelected.bind(this)}
                    />
                </View>
            );
        }
        return (
        <View style={{flex: 1}}>
            {this.modalView()}
             <StatusBar barStyle = "light-content" hidden = {false}/>
            {this.mapView()}
            {itemView}
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

export default connect(mapStateToProps, mapDispatchToProps)(MainLocationMap);
