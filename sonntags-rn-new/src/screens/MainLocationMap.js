import React, { Component } from "react";
import {
  Dimensions,
  PanResponder,
  ActivityIndicator,
  View,
  Modal,
  Animated
} from "react-native";

import { StatusBar } from "react-native";

import { create_i18n } from "../utilities";

var I18n = create_i18n();

import { pad, openExternalApp } from "../utilities";

import {
  loadLocations,
  getUserLocation,
  distanceFromUserLocation,
  markLaunch,
  showReviewIfNeeded,
  locationsSortedByDistance
} from "../actions";

import NavWebView from "../screens/NavWebView";
import Analytics from "react-native-firebase-analytics";
import MapButtonPanel from "../components/MapButtonPanel";
import LocationDetailSummaryView from "../components/LocationDetailSummaryView";
import LocationActionComponent from "../components/LocationActionComponent";
import { connect } from "react-redux";
import LocationMapView from "../components/LocationMapView";
import Share from "react-native-share";
import CategorySelectionList from "../screens/CategorySelectionList";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const supplementarySummaryHeight = 0;

class MainLocationMap extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    let isLoading;
    if (state.params) {
      isLoading = state.params.isLoading;
    } else {
      isLoading = false;
    }
    return {
      title: "STIL IN BERLIN",
      headerRight: (
        <ActivityIndicator
          style={{ padding: 5 }}
          size="small"
          color="#fff"
          animating={isLoading}
        />
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      bottomAnim: new Animated.Value(-supplementarySummaryHeight),
      categoryViewAnim: new Animated.Value(0),
      websiteModalVisible: false
    };

    markLaunch();
  }

  openInMaps() {
    Analytics.logEvent("open_maps", {
      location_name: this.state.selectedLocation.name
    });
    let queryString = null;
    if (this.state.selectedLocation.address) {
      queryString = this.state.selectedLocation.address;
    } else {
      queryString =
        this.state.selectedLocation.location.lat +
        "+" +
        this.state.selectedLocation.location.lon;
    }

    var url = "https://www.google.com/maps/search/?api=1&query=" + queryString;
    openExternalApp(url);
  }

  shareSelectedLocation() {
    let locationShareMessage = "Shop here on Sundays:";
    locationShareMessage += "\n" + this.state.selectedLocation.name;
    if (this.state.selectedLocation.address) {
      locationShareMessage += "\n" + this.state.selectedLocation.address;
    }
    locationShareMessage +=
      "\n" + this.state.selectedLocation.openingHoursString;
    locationShareMessage += "\n\nhttp://bit.ly/sonntags-shopping";
    Share.open({
      title: this.state.selectedLocation.name,
      message: locationShareMessage,
      subject: "Shop here on Sundays"
    })
      .then(result => {
        Analytics.logEvent("location_share_succeeded");
      })
      .catch(result => {
        Analytics.logEvent("location_share_cancelled");
      });
  }

  hideCategoryList = callback => {
    Animated.timing(this.state.categoryViewAnim, {
      toValue: -this.categoryViewHeight,
      duration: 200
    }).start(finished => {
      this.setState({
        categoryListShown: false
      });
      if (callback) {
        callback();
      }
    });
  };

  showCategoryList = () => {
    this.hideLocationSummary(0);
    Animated.timing(this.state.categoryViewAnim, {
      toValue: 0,
      duration: 200
    }).start(finished => {
      this.setState({
        categoryListShown: true
      });
    });
  };

  expandBoundingBox(box) {
    let factor = 0.001;
    let newBox = [
      [box[0][0] * (1 + factor * 2), box[0][1] * (1 + factor / 2)],
      [box[1][0] * (1 - factor * 2), box[1][1] * (1 - factor / 2)]
    ];
    return newBox;
  }

  printBox(box) {
    console.log([box[0][0], box[0][1], box[1][0], box[1][1]]);
  }

  loadLocationsForState() {
    const { setParams } = this.props.navigation;
    let bounds = this.currentMapRegion;
    if (bounds[0] == bounds[1] || !bounds[0] || !bounds[1]) {
      return;
    }
    let expanded = this.expandBoundingBox(bounds);
    setParams({
      isLoading: true
    });
    loadLocations(this.state.selectedCategory, expanded)
      .then(locations => {
        let sorted = locations;
        // if (this.props.userLocation) {
        //     sorted = locationsSortedByDistance(this.props.userLocation, locations);
        // }
        this.setState({
          locations: sorted
        });

        setParams({
          isLoading: false
        });
      })
      .then(() => {
        this.props.getUserLocation();
      });
  }

  componentDidMount() {
    this.props.getUserLocation();
  }

  componentWillUpdate(nextProps, nextState) {
    if (!this.state.userLocation && nextState.userLocation) {
      let coords = nextState.userLocation.coords;
      this._map.zoomToLocation([coords.longitude, coords.latitude]);
    }
  }

  componentDidUpdate() {}

  componentWillReceiveProps(nextProps) {
    this.setState({
      userLocation: nextProps.userLocation
    });
    // let sorted = locationsSortedByDistance(this.props.userLocation, this.state.locations);
    this.setState({
      locations: this.state.locations
    });
  }

  onRegionDidChange(coordinates) {
    this.currentMapRegion = coordinates;
    this.loadLocationsForState();
  }

  mapView() {
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          width: "100%"
        }}
        onLayout={event => {
          var { x, y, width, height } = event.nativeEvent.layout;
          this.mainViewHeight = height;
        }}
      >
        <LocationMapView
          locations={this.state.locations}
          onAnnotationTapped={this.onAnnotationTapped.bind(this)}
          onRegionDidChange={this.onRegionDidChange.bind(this)}
          selectedLocation={this.state.selectedLocation}
          onTap={this.onMapTapped.bind(this)}
          ref={map => {
            this._map = map;
          }}
        />
      </View>
    );
  }

  clearSelectedLocation() {
    this.hideLocationSummary();
  }

  onMapTapped() {
    this.setState({
      previousLocation: this.state.selectedLocation
    });
    setTimeout(() => {
      if (
        this.state.previousLocation &&
        this.state.selectedLocation &&
        this.state.selectedLocation.id == this.state.previousLocation.id
      ) {
        this.clearSelectedLocation();
      }
    }, 500);
  }

  hideLocationSummary(duration = 200) {
    console.log("detail view height", this.detailViewHeight);
    Animated.timing(this.state.bottomAnim, {
      toValue: this.detailViewHeight
        ? -this.detailViewHeight
        : -this.mainViewHeight,
      duration: duration
    }).start(finished => {
      this.setState({
        selectedLocation: null
      });
    });
  }

  showLocationSummary() {
    Animated.timing(this.state.bottomAnim, {
      toValue: -supplementarySummaryHeight,
      duration: 200
    }).start();
  }

  onAnnotationTapped(annotation) {
    showReviewIfNeeded();
    let selectedLocation = this.state.locations.find(
      object => object.id == annotation.id
    );
    this.setState({
      selectedLocation: selectedLocation
    });
    this.showLocationSummary();
  }

  onListItemSelected = category => {
    this.hideCategoryList(() => {
      this.setState(
        {
          selectedCategory: category
        },
        () => {
          this.loadLocationsForState();
        }
      );
    });
  };

  modalWebView() {
    if (this.state.openPage) {
      return (
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.websiteModalVisible}
          onRequestClose={() => {}}
        >
          <NavWebView
            uri={this.state.openPage.url}
            title={this.state.openPage.title}
            rightButtonPressed={() =>
              this.setState({ websiteModalVisible: false })
            }
          />
        </Modal>
      );
    } else {
      return null;
    }
  }

  modalListView() {
    return (
      <Animated.View
        style={{ top: this.state.categoryViewAnim }}
        onLayout={event => {
          var { x, y, width, height } = event.nativeEvent.layout;
          if (this.hasPerformedLayout) {
            return;
          }
          this.state.categoryViewAnim.setValue(-height);
          this.categoryViewHeight = height;
          this.categoryViewY = y;
          this.hasPerformedLayout = true;
        }}
      >
        <CategorySelectionList
          activeFilter={this.state.selectedCategory}
          onItemSelected={this.onListItemSelected}
          onCloseTapped={this.hideCategoryList}
        />
      </Animated.View>
    );
  }

  sundayOpeningsModal() {
    return (
      <Animated.View
        style={{ top: this.state.categoryViewAnim }}
        onLayout={event => {
          var { x, y, width, height } = event.nativeEvent.layout;
          console.log("grid height", height);
          if (this.hasPerformedLayout) {
            return;
          }
          this.state.categoryViewAnim.setValue(-height);
          this.categoryViewHeight = height;
          this.categoryViewY = y;
          this.hasPerformedLayout = true;
        }}
      ></Animated.View>
    );
  }

  setBottomAnim(value) {
    // if (value > 0) {
    //     this.setState({
    //         showSupplementarySummary: true
    //     });
    // } else {
    //     this.setState({
    //         showSupplementarySummary: false
    //     });
    // }
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
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,

      onPanResponderGrant: (evt, gestureState) => {
        this.animationStart = gestureState.y0;
      },
      onPanResponderMove: (evt, gestureState) => {
        this.setBottomAnim(
          this.animationStart - gestureState.moveY - supplementarySummaryHeight
        );
      },
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderRelease: (evt, gestureState) => {
        this.releaseSwipeGesture();
      },
      onPanResponderTerminate: (evt, gestureState) => {},
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return false;
      }
    });
  }

  openWebsite = () => {
    this.showPage(
      this.state.selectedLocation.name,
      this.state.selectedLocation.websiteUrl
    );
  };

  itemView() {
    return (
      <Animated.View
        style={{
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 5.0,
          shadowColor: "black",
          backgroundColor: "white",
          position: "absolute",
          bottom: this.state.bottomAnim,
          width: width
        }}
        {...this._panResponder.panHandlers}
        onLayout={event => {
          var { x, y, width, height } = event.nativeEvent.layout;
          this.detailViewHeight = height;
          this.detailViewY = y;
        }}
      >
        <LocationDetailSummaryView
          location={this.state.selectedLocation}
          distanceFromUser={distanceFromUserLocation(
            this.state.selectedLocation,
            this.props.userLocation
          )}
          openWebsite={this.openWebsite}
          startPhoneCall={() => {}}
        />
      </Animated.View>
    );
  }

  showPage(title, uri) {
    this.setState({
      websiteModalVisible: true,
      openPage: {
        title: title,
        url: uri
      }
    });
  }

  mapButtonPanel() {
    const { navigate } = this.props.navigation;
    let config = [
      { title: "show_filter", icon: "filter", target: this.showCategoryList },
      {
        title: "info_page",
        icon: "information-outline",
        target: () => {
          navigate("AppInfoPage");
        }
      }
    ];

    return (
      <View
        style={{
          flex: 1,
          alignSelf: "flex-end",
          flexDirection: "row",
          alignItems: "center",
          right: 0,
          bottom: 0,
          width: 60
        }}
      >
        <MapButtonPanel buttons={config} />
      </View>
    );
  }

  render() {
    let itemView = null;

    if (this.state.selectedLocation) {
      itemView = this.itemView();
    }
    return (
      <View style={{ flex: 1 }}>
        {this.modalWebView()}
        <StatusBar barStyle="light-content" hidden={false} />
        <View
          style={{
            height: "100%",
            position: "absolute",
            top: 0,
            right: 0,
            width: "100%"
          }}
        >
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
    userLocation: state.main.userLocation
  };
}

const mapDispatchToProps = (dispatch, getState) => {
  return {
    getUserLocation: callback => {
      return dispatch(getUserLocation(callback));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainLocationMap);
