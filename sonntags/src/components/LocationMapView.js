import React, { Component } from "react";

import { TouchableOpacity, View } from "react-native";

import Mapbox, { MapView, Camera, PointAnnotation } from "@rnmapbox/maps";

var styles = require("../styles");

const accessToken =
  "pk.eyJ1IjoiYWtmcmVhcyIsImEiOiJjajh3b252ODkxcW9jMnFydmw1NzNzNGtiIn0.8IeSD3SyJIf8gbXhqwHIAA";

Mapbox.setAccessToken(accessToken);

const defaultCenter = [13.39127, 52.51743];

export default class LocationMapView extends Component {
  centerCoordinate() {
    if (this.props.centerCoordinate) {
      return [
        this.props.centerCoordinate.longitude,
        this.props.centerCoordinate.latitude
      ];
    }
    return defaultCenter;
  }

  zoomToLocation(location) {
    this._camera.setCamera({
      centerCoordinate: location,
      zoomLevel: 12,
      animationDuration: 2000
    });
  }

  getVisibleBounds() {
    return this._map.getVisibleBounds();
  }

  annotations() {
    let locations = this.props.locations || [];
    return locations.map(location => {
      let selected =
        this.props.selectedLocation &&
        location.id == this.props.selectedLocation.id;
      return {
        id: location.id,
        coordinates: [
          parseFloat(location.location.lon),
          parseFloat(location.location.lat)
        ],
        type: "point",
        category: location.category,
        selected: selected,
        location: location
      };
    });
  }

  onAnnotationTapped(annotation) {
    if (this.props.onAnnotationTapped) {
      this.props.onAnnotationTapped(annotation);
    }
  }

  onMapIdle = mapState => {
    if (!this.props.onRegionDidChange) {
      return;
    }
    let bounds = mapState.properties.bounds;
    // same shape the old getVisibleBounds callback delivered: [ne, sw]
    this.props.onRegionDidChange([bounds.ne, bounds.sw]);
  };

  onTap = () => {
    if (this.props.onTap) {
      this.props.onTap();
    }
  };

  renderAnnotations() {
    const annotationSize = 20;
    return this.annotations().map(annotation => {
      let backgroundColor = annotation.selected
        ? styles.constants.secondaryColor
        : "#D09CDE";
      return (
        <PointAnnotation
          id={annotation.id}
          // key includes selection so iOS re-renders the child view on select
          key={annotation.id + (annotation.selected ? "-selected" : "")}
          coordinate={annotation.coordinates}
          onSelected={() => this.onAnnotationTapped(annotation)}
        >
          <TouchableOpacity
            onPress={() => this.onAnnotationTapped(annotation)}
          >
            <View
              style={{
                width: annotationSize,
                height: annotationSize,
                borderColor: "#FFFFFF",
                borderWidth: 1,
                borderRadius: annotationSize / 2,
                backgroundColor: backgroundColor
              }}
            />
          </TouchableOpacity>
        </PointAnnotation>
      );
    });
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "stretch" }}>
        <MapView
          ref={map => {
            this._map = map;
          }}
          style={{ flex: 1 }}
          rotateEnabled={false}
          scrollEnabled={true}
          zoomEnabled={true}
          pitchEnabled={false}
          styleURL={"mapbox://styles/akfreas/cjbtmvqcaarka2qtgs0yakriu"}
          onMapIdle={this.onMapIdle}
          onPress={this.onTap}
        >
          <Camera
            ref={camera => {
              this._camera = camera;
            }}
            defaultSettings={{
              centerCoordinate: this.centerCoordinate(),
              zoomLevel: this.props.initialZoomLevel
                ? this.props.initialZoomLevel
                : 9
            }}
          />
          {this.renderAnnotations()}
        </MapView>
      </View>
    );
  }
}
