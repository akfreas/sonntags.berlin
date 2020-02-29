import React, { Component } from "react";

import { TouchableOpacity, View } from "react-native";

import MapboxGL, { MapView, Annotation } from "@react-native-mapbox-gl/maps";

import PropTypes from "prop-types";

var styles = require("../styles");

const forwardArrow = require("../../assets/images/arrow-forward.png");
const accessToken =
  "pk.eyJ1IjoiYWtmcmVhcyIsImEiOiJjajh3b252ODkxcW9jMnFydmw1NzNzNGtiIn0.8IeSD3SyJIf8gbXhqwHIAA";

MapboxGL.setAccessToken(accessToken);
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default class LocationMapView extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    center: [52.5174389, 13.3912796],
    zoom: 11,
    followUserLocation: true,
    annotations: []
  };

  onOpenAnnotation = annotation => {
    if (this.props.onAnnotationTapped) {
      this.props.onAnnotationTapped(annotation);
    }
  };

  onTap = location => {
    if (this.props.onTap) {
      this.props.onTap();
    }
  };
  //   onChangeUserTrackingMode = userTrackingMode => {
  //     this.setState({ userTrackingMode });
  //   };

  componentWillMount() {}

  componentDidMount() {
    this.handleNewLocationProps(this.props.locations);
    if (this.props.centerCoordinate) {
      this.setState({
        center: this.props.centerCoordinate
      });
    }
  }

  zoomToLocation(location) {
    this._map.setCamera({
      centerCoordinate: location,
      zoom: 12,
      duration: 2000
    });
  }

  componentWillUnmount() {}

  componentWillReceiveProps(props) {
    if (props.locations) {
      this.handleNewLocationProps(props.locations, props.selectedLocation);
    }

    if (props.centerCoordinate) {
      this.setState({
        center: props.centerCoordinate
      });
    }
  }

  handleNewLocationProps(locations, selectedLocation) {
    let newAnnotations = locations.map(location => {
      let selected = false;
      if (selectedLocation && location.id == selectedLocation.id) {
        selected = true;
      }
      return {
        id: location.id,
        coordinates: [
          parseFloat(location.location.lon),
          parseFloat(location.location.lat)
        ],
        type: "point",
        category: location.category,
        // iconName: location.iconName,
        selected: selected,
        location: location
      };
    });
    this.setState({
      annotations: newAnnotations
    });
  }

  getVisibleBounds() {
    return this._map.getVisibleBounds();
  }

  renderAnnotations() {
    const annotationSize = 20;
    let annotationViews = this.state.annotations.map(annotation => {
      backgroundColor = styles.constants.secondaryColor;
      iconColor = styles.constants.secondaryColorNegative;
      if (annotation.selected) {
        backgroundColor = styles.constants.primaryColor;
        iconColor = styles.constants.primaryColorNegative;
      }
      return (
        <MapboxGL.PointAnnotation
          id={annotation.id}
          key={annotation.id}
          coordinate={annotation.coordinates}
          attributionEnabled={false}
          style={{
            alignItems: "center",
            justifyContent: "center",
            position: "absolute"
          }}
        >
          <TouchableOpacity
            onPress={() => this.props.onAnnotationTapped(annotation)}
          >
            <View
              style={{
                width: annotationSize,
                borderColor: "#FFFFFF",
                borderWidth: 1,
                height: annotationSize,
                backgroundColor: "white",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 100 / 2,
                backgroundColor: "#D09CDE"
              }}
            >
              {/* <Icon
                            style={styles.locationListIcon}
                            name={annotation.iconName}
                            size={14}
                            color={iconColor}/> */}
            </View>
          </TouchableOpacity>
        </MapboxGL.PointAnnotation>
      );
    });

    return annotationViews;
  }

  onRegionDidChange(region) {
    this.props.onRegionDidChange(region.properties.visibleBounds);
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "stretch" }}>
        <MapboxGL.MapView
          ref={map => {
            this._map = map;
          }}
          style={{ flex: 1 }}
          centerCoordinate={[13.39127, 52.51743]}
          zoomLevel={
            this.props.initialZoomLevel ? this.props.initialZoomLevel : 9
          }
          initialDirection={0}
          annotations={this.state.annotations}
          showUserLocation={true}
          rotateEnabled={false}
          scrollEnabled={true}
          zoomEnabled={true}
          onRegionDidChange={this.onRegionDidChange.bind(this)}
          pitchEnabled={false}
          styleURL={"mapbox://styles/akfreas/cjbtmvqcaarka2qtgs0yakriu"}
          onOpenAnnotation={this.onOpenAnnotation}
          onPress={this.onTap}
        >
          {this.renderAnnotations()}
        </MapboxGL.MapView>
      </View>
    );
  }
}

LocationMapView.propTypes = {};
