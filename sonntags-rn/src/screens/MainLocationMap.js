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
    PanResponder,
    View,
    Modal,
    AnimatedValue,
    Animated,
    StyleSheet,
    Platform,
    Linking,
    Button
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
import NavigationBar from 'react-native-navbar';
import MapButtonPanel from '../components/MapButtonPanel';
import LocationListView from '../components/LocationListView';
import LocationDetailSummaryView from '../components/LocationDetailSummaryView';
import LocationActionComponent from '../components/LocationActionComponent';
import arrow from '../../assets/images/map-annotation.png';
import { connect } from 'react-redux'
import LocationMapView from '../components/LocationMapView'; 
import LocationListItem from '../components/LocationListItem';
import Share, {ShareSheet} from 'react-native-share';
import LocationTypeGrid from '../screens/LocationTypeGrid';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

let width = Dimensions.get('window').width
let height = Dimensions.get('window').height

class MainLocationMap extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'sonntags',
    });

    
    constructor(props) {
        super(props);
        this.state = {
            locations: [],
            bottomAnim: new Animated.Value(0),
            categoryViewAnim: new Animated.Value(0),
            websiteModalVisible: false,
        };
    }

    locationSelected(location, source) {
        let previousLocation = this.state.selectedLocation;
        this.setState({
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
        let queryString = null;
        if (this.state.selectedLocation.address) {
            queryString = this.state.selectedLocation.address;
        } else {
            queryString = this.state.selectedLocation.location.lat + "+" + this.state.selectedLocation.location.lon;
        }



        var url = 'https://www.google.com/maps/search/?api=1&query=' + queryString;
        openExternalApp(url)
    }

    shareSelectedLocation() {
        let locationShareMessage = "Shop here on Sundays:"
        locationShareMessage += "\n" + this.state.selectedLocation.name 
        if (this.state.selectedLocation.address) {
            locationShareMessage += "\n" + this.state.selectedLocation.address
        }
        locationShareMessage += "\n" + this.state.selectedLocation.openingHoursString
        locationShareMessage += "\n\nhttp://bit.ly/sonntags-shopping"
        Share.open({
            title: this.state.selectedLocation.name,
            message: locationShareMessage,
            subject: "Shop here on Sundays",
        }).then((result) => {
            Analytics.logEvent('location_share_succeeded');
        }).catch((result) => {
            Analytics.logEvent('location_share_cancelled');
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
    hideCategoryList = () => {
        Animated.timing(
            this.state.categoryViewAnim,
            {
                toValue: -this.categoryViewHeight,
                duration: 200
            }
        ).start((finished) => {
            this.setState({
                categoryListShown: true
            });
        });
    }

    showCategoryList = () => {
        this.hideLocationSummary();
        Animated.timing(
            this.state.categoryViewAnim,
            {
                toValue: 0,
                duration: 200
            }
        ).start((finished) => {
            this.setState({
                categoryListShown: true
            });
        });
    }

    loadLocationsForState() {
        let bounds = this.currentMapRegion;
        if (bounds[0] == bounds[1] || !bounds[0] || !bounds[1]) { 
            return
        }
        loadLocations(this.state.selectedCategory, bounds).then((locations) => {
            let sorted = locations
            if (this.props.userLocation) {
                sorted = this.locationsSortedByDistance(locations);
            }
            this.setState({
                locations: sorted,
            })
        }).then(()=>{
            this.props.getUserLocation();
        });
    }

    componentDidMount() {
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


    onRegionDidChange(coordinates) {
        this.currentMapRegion = coordinates;
        this.loadLocationsForState();
    }

    mapView() {
        return (
            <View ref="mainView" style={{position: 'absolute', top: 0, left: 0, right: 0, height: '100%', width: '100%'}}
            onLayout={(event) => {
                var {x, y, width, height} = event.nativeEvent.layout;
                this.mainViewHeight = height;
            }}>
                <LocationMapView
                    locations={this.state.locations}
                    onAnnotationTapped={this.onAnnotationTapped.bind(this)}
                    onRegionDidChange={this.onRegionDidChange.bind(this)}
                    selectedLocation={this.state.selectedLocation}
                    onTap={this.onMapTapped.bind(this)}
                    ref={map => { this._map = map; }}
                /> 
            </View>
        )

    }

    clearSelectedLocation() {
        this.hideLocationSummary();
    }

    onMapTapped() {
        this.setState({
            previousLocation: this.state.selectedLocation
        });
        setTimeout(() => {
            if (this.state.previousLocation && this.state.selectedLocation 
                && this.state.selectedLocation.id == this.state.previousLocation.id) {
                this.clearSelectedLocation();        
            }
        }, 2000);
    }

    hideLocationSummary() {

        Animated.timing(
            this.state.bottomAnim,
            {
                toValue: -this.detailViewHeight,
                duration: 200,
            }
        ).start((finished) => {
            this.setState({
                selectedLocation: null
            });
        });
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

    onListItemSelected = (category) => {


        this.hideCategoryList();
        this.setState({
            selectedCategory: category,
        }, () => {;
            this.loadLocationsForState();
        });
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
            return null;
        }
    }
       
    modalListView() {
        return (
            <Animated.View style={{ top: this.state.categoryViewAnim}}
                    onLayout={(event) => {
                        var {x, y, width, height} = event.nativeEvent.layout;
                        console.log("grid height", height);
                        if (this.hasPerformedLayout) { return; }
                        this.state.categoryViewAnim.setValue(-height);
                        this.categoryViewHeight = height;
                        this.categoryViewY = y;
                            this.hasPerformedLayout = true;
                    }}

            >
                <LocationTypeGrid 
                    activeFilter={this.state.selectedCategory} 
                    onItemSelected={this.onListItemSelected}
                    onCloseTapped={this.hideCategoryList}

                    /> 
            </Animated.View>
        )
    }
    setBottomAnim(value) {
        if (value > 0) {
            return
        }
        this.state.bottomAnim.setValue(value);
    }

    releaseSwipeGesture() {

        let midpoint = this.mainViewHeight - this.detailViewHeight * 0.9;
        let position = this.detailViewY;
        if (position > midpoint) {
            this.clearSelectedLocation();
        } else {
            this.showLocationSummary();
        }
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
          onStartShouldSetPanResponder: (evt, gestureState) => true,
          onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
          onMoveShouldSetPanResponder: (evt, gestureState) => true,
          onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

          onPanResponderGrant: (evt, gestureState) => {
            this.animationStart = gestureState.y0;
          },
          onPanResponderMove: (evt, gestureState) => {
              this.setBottomAnim(this.animationStart - gestureState.moveY);
          },
          onPanResponderTerminationRequest: (evt, gestureState) => true,
          onPanResponderRelease: (evt, gestureState) => {
            this.releaseSwipeGesture();
          },
          onPanResponderTerminate: (evt, gestureState) => {
          },
          onShouldBlockNativeResponder: (evt, gestureState) => {
            return true;
          },
        });

    }

    openWebsite() {
        this.setState({
            websiteModalVisible: true
        });
    }

    itemView() {
        return (
            <Animated.View 
                style={{
                    shadowOffset: {width: 0, height: 0},
                    shadowOpacity: 0.2,
                    shadowRadius: 5.0,
                    shadowColor: 'black',
                backgroundColor: 'white', 
                position: 'absolute', 
                bottom: this.state.bottomAnim, 
                width: width,
                }}
                {...this._panResponder.panHandlers}
                    onLayout={(event) => {
                        var {x, y, width, height} = event.nativeEvent.layout;
                        this.detailViewHeight = height;
                        this.detailViewY = y;
                    }}

            >
                <LocationDetailSummaryView 
                    location={this.state.selectedLocation}
                    distanceFromUser={distanceFromUserLocation(this.state.selectedLocation, this.props.userLocation)}
                    ref={'detailView'}
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

    mapButtonPanel() {

        let config = [
            {icon: 'filter', target: this.showCategoryList },
            {icon: 'map-marker-plus', target: ()=> { console.log('heyyyy')} },
            {icon: 'calendar-range', target: ()=> { console.log('heyyyy')} }
        ];

        return (
            <View style={{
                flex:1, 
                alignSelf: 'flex-end', 
                flexDirection: 'row', 
                alignItems: 'center', 
                right: 0, 
                bottom: 0,
                width: 60
            }}>
                <MapButtonPanel buttons={config}/> 
            </View>
        )
    }

    render() {

        let itemView = null;

        if (this.state.selectedLocation) {
            itemView = this.itemView()
        }
        return (
            <View style={{flex: 1}}>
                {this.modalWebView()}
                 <StatusBar barStyle = "light-content" hidden = {false}/>
                 <View style={{height: '100%', position: 'absolute', top: 0, right: 0, width: '100%'}}>
                     {this.mapView()}
                     {this.mapButtonPanel()}
                 </View>
                 {this.modalListView()}
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
