import React, { Component } from "react";

import { View } from "react-native";

import Mapbox, {
  MapView,
  Camera,
  ShapeSource,
  CircleLayer
} from "@rnmapbox/maps";

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

  onShapePress = event => {
    let feature = event.features && event.features[0];
    if (!feature) {
      return;
    }
    let annotation = this.annotations().find(
      a => a.id == feature.properties.id
    );
    if (annotation) {
      this.onAnnotationTapped(annotation);
    }
  };

  renderAnnotations() {
    let features = {
      type: "FeatureCollection",
      features: this.annotations().map(annotation => ({
        type: "Feature",
        id: annotation.id,
        geometry: { type: "Point", coordinates: annotation.coordinates },
        properties: { id: annotation.id, selected: !!annotation.selected }
      }))
    };
    return (
      <ShapeSource id="locations" shape={features} onPress={this.onShapePress}>
        <CircleLayer
          id="location-pins"
          style={{
            circleRadius: 10,
            circleColor: [
              "case",
              ["get", "selected"],
              styles.constants.secondaryColor,
              "#D09CDE"
            ],
            circleStrokeColor: "#FFFFFF",
            circleStrokeWidth: 1
          }}
        />
      </ShapeSource>
    );
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
