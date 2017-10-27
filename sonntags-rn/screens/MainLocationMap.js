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
    pad,
    openExternalApp
} from '../utilities';

import {
    loadLocations,
    getUserLocation,
    distanceFromUserLocation,
} from '../actions';

import NavWebView from '../screens/NavWebView';
import Analytics from 'react-native-firebase-analytics';
import LocationCallout from '../components/LocationCallout.js';
import HamburgerBars from '../components/HamburgerBars.js';
import NavigationBar from 'react-native-navbar';
import LocationListView from '../components/LocationListView';
import LocationDetailSummaryView from '../components/LocationDetailSummaryView';
import LocationActionComponent from '../components/LocationActionComponent';
import arrow from '../assets/images/map-annotation.png';
import { connect } from 'react-redux'
import LocationMapView from '../components/LocationMapView'; 
import LocationListItem from '../components/LocationListItem';
import Share, {ShareSheet, Button} from 'react-native-share';

let width = Dimensions.get('window').width
let height = Dimensions.get('window').height

class MainLocationMap extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.category.name,
        headerRight:<HamburgerBars onPress={()=> navigation.state.params.showList()}/>
    });
    
    constructor(props) {
        super(props);
        this.state = {
            locations: [],
            listViewModalVisible: false,
            bottomAnim: new Animated.Value(-100),
            websiteModalVisible: false,
        };
    }

    locationSelected(location, source) {
        let previousLocation = this.state.selectedLocation;
        this.setState({
            listViewModalVisible: false,
            previousLocation: previousLocation,
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
 
    openInMaps() {
        Analytics.logEvent('open_maps', {'location_name': this.state.selectedLocation.name});
        var url = 'https://www.google.com/maps/search/?api=1&query=' + this.state.selectedLocation.address;
        openExternalApp(url)
    }

    shareSelectedLocation() {
        let locationShareMessage = "Shop here on Sundays:"
        locationShareMessage += "\n" + this.state.selectedLocation.name 
        if (this.state.selectedLocation.address) {
            locationShareMessage += "\n" + this.state.selectedLocation.address
        }
        locationShareMessage += "\nOpen " + this.state.selectedLocation.name
        locationShareMessage += "\n\nSee more at http://bit.ly/sonntags-shopping"
        Share.open({
            title: this.state.selectedLocation.name,
            message: locationShareMessage,
            url: "http://sonntags.sashimiblade.com",
            subject: "Check it out!"
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
            listViewModalVisible: true
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
                    onAnnotationTapped={this.onAnnotationTapped.bind(this)}
                    selectedLocation={this.state.selectedLocation}
                    onTap={this.onMapTapped.bind(this)}
                /> 
            <AdMobBanner
                  bannerSize="smartBannerPortrait"
                  adUnitID="ca-app-pub-5197876894535655/8159389107"
                  testDeviceID="EMULATOR"
                  didFailToReceiveAdWithError={this.bannerError} />

            </View>
        )

    }

    onMapTapped() {
        this.setState({
            previousLocation: this.state.selectedLocation
        });
        setTimeout(() => {
            if (this.state.previousLocation && this.state.selectedLocation 
                && this.state.selectedLocation.id == this.state.previousLocation.id) {
                this.setState({
                    selectedLocation: null
                });
                this.hideLocationSummary();
            }
        }, 2000);
    }

    hideLocationSummary() {
        Animated.timing(
            this.state.bottomAnim,
            {
                toValue: -100,
                duration: 200
            }
        ).start();
    }


    showLocationSummary() {

        Animated.timing(
            this.state.bottomAnim,
            {
                toValue: 0,
                duration: 200
            }
        ).start();
    }

    onAnnotationTapped(annotation) {
        let selectedLocation = this.state.locations.find((object)=> object.id == annotation.id);
        this.setState({
            selectedLocation: selectedLocation
        });
        this.showLocationSummary();
    }

    modalWebView() {
        if (this.state.selectedLocation) {
            return (
                 <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.websiteModalVisible}
                    onRequestClose={() => {}}
                >
                    <NavWebView 
                        uri={this.state.selectedLocation.websiteUrl}
                        title={this.state.selectedLocation.name}
                        rightButtonPressed={() => this.setState({ websiteModalVisible: false })}
                    />
                </Modal>
            )
        } else {
            return null
        }
    }
       
    modalListView() {
        return (
             <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.listViewModalVisible}
                onRequestClose={() => {}}
            >
                <LocationListView 
                    category={this.props.category}
                    locations={this.state.locations}
                    userLocation={this.props.userLocation}
                    onCloseButtonTapped={() => this.setState({listViewModalVisible: false})}
                    onLocationSelected={this.locationSelected.bind(this)}
                />
            </Modal>
        )
    }

    openWebsite() {
        this.setState({
            websiteModalVisible: true
        });
    }

    itemView() {
        return (
            <Animated.View style={{
                backgroundColor: 'white', 
                position: 'absolute', 
                bottom: this.state.bottomAnim, 
                width: width,
            }}>
                <LocationDetailSummaryView 
                    location={this.state.selectedLocation}
                    distanceFromUser={distanceFromUserLocation(this.state.selectedLocation, this.props.userLocation)}
                    openWebsite={() => this.openWebsite()}
                    startPhoneCall={() => {}}
                />
                <LocationActionComponent
                    googleMapsAction={() => this.openInMaps()}
                    shareAction={() => this.shareSelectedLocation()}
                 />
            </Animated.View>
        )
    }

    render() {

        let itemView = null;

        if (this.state.selectedLocation) {
            itemView = this.itemView()
        }
        return (
            <View style={{flex: 1}}>
                {this.modalListView()}
                {this.modalWebView()}
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
