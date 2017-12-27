import React, {Component} from 'react';

import {
    Image,
    Linking,
    Button,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Row,
    ListView
} from 'react-native';

import MapboxGL, { MapView, Annotation }from '@mapbox/react-native-mapbox-gl';

import PropTypes from 'prop-types';

var styles = require('../styles');

const forwardArrow = require('../../assets/images/arrow-forward.png');
const accessToken = 'pk.eyJ1IjoiYWtmcmVhcyIsImEiOiJjajh3b252ODkxcW9jMnFydmw1NzNzNGtiIn0.8IeSD3SyJIf8gbXhqwHIAA';

MapboxGL.setAccessToken(accessToken);
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class LocationMapView extends Component {


    constructor(props) {
        super(props);
    }

	state = {
		center: [
			52.5174389,
			13.3912796
        ],
		zoom: 11,
		userTrackingMode: MapboxGL.UserTrackingModes.Follow,
		annotations: []
	};

  onRegionDidChange = (location) => {
    this.setState({ currentZoom: location.zoomLevel });
    console.log('onRegionDidChange', location);
  };
  onOpenAnnotation = (annotation) => {
      if (this.props.onAnnotationTapped) {
          this.props.onAnnotationTapped(annotation);
      }
  };

  onTap = (location) => {
      if (this.props.onTap) {
          this.props.onTap();
      }
  };
  onChangeUserTrackingMode = (userTrackingMode) => {
    this.setState({ userTrackingMode });
  };

  componentWillMount() {

  }

    componentDidMount() {
        this.handleNewLocationProps(this.props.locations);
        if (this.props.centerCoordinate) {
            this.setState({
                center: this.props.centerCoordinate
            });
        }
    }

  componentWillUnmount() {
    this._offlineProgressSubscription.remove();
    this._offlineMaxTilesSubscription.remove();
    this._offlineErrorSubscription.remove();
  }

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

        let newAnnotations = locations.map((location) => {
            let arrowImage = 'arrow';
            if (selectedLocation && 
                location.id == selectedLocation.id) {
                arrowImage = 'arrow_selected';
            }
            return {
                id: location.id,
                coordinates: [parseFloat(location.location.lat), parseFloat(location.location.lon)],
                type: 'point',
                annotationImage: {
                    source: {uri: arrowImage},
                    height: 35,
                    width: 35
                },
                location: location,
            };
        });
        this.setState({
            annotations: newAnnotations
        });
    }

    renderAnnotations() {
        let annotationViews = this.state.annotations.map((annotation) => {
            return (
              <MapboxGL.PointAnnotation
                    id={annotation.id}
                    key={annotation.id}
                    coordinate={[annotation.coordinates]}
                    style={{alignItems: 'center', justifyContent: 'center', position: 'absolute'}}
                  >
                    <View style={{width: 25, height: 25, backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Icon
                            style={styles.locationGridIcon}
                            name={'tree'}
                            size={32}
                            color='#3BB9BD'/>                        

                    </View>
              </MapboxGL.PointAnnotation>
            )
        });

        return annotationViews;
    }

    render() {
        return(
            <View style={{flex: 1, alignItems: 'stretch'}}>
             <MapboxGL.MapView
                      ref={map => { this._map = map; }}
                      style={{flex: 1}}
                      centerCoordinate={[13.39127, 52.51743]}
                      zoomLevel={this.props.initialZoomLevel ? this.props.initialZoomLevel : 9}
                      initialDirection={0}
                      annotations={this.state.annotations}
                      rotateEnabled={false}
                      scrollEnabled={true}
                      zoomEnabled={true}
                      styleURL={MapboxGL.StyleURL.Dark}
                      onOpenAnnotation={this.onOpenAnnotation}
                      onTap={this.onTap}
                  >
            </MapboxGL.MapView>
            </View>
        )
    }
}

LocationMapView.propTypes = {
}

