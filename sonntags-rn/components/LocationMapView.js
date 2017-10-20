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

import Mapbox, { MapView, Annotation }from 'react-native-mapbox-gl';
import PropTypes from 'prop-types';


const forwardArrow = require('../assets/images/arrow-forward.png');
const accessToken = 'pk.eyJ1IjoiYWtmcmVhcyIsImEiOiJjajh3b252ODkxcW9jMnFydmw1NzNzNGtiIn0.8IeSD3SyJIf8gbXhqwHIAA';

Mapbox.setAccessToken(accessToken);

export default class LocationMapView extends Component {

	state = {
		center: {
			latitude: 52.5174389,
			longitude: 13.3912796
		},
		zoom: 11,
		userTrackingMode: Mapbox.userTrackingMode.none,
		annotations: []
	};

  onRegionDidChange = (location) => {
    this.setState({ currentZoom: location.zoomLevel });
    console.log('onRegionDidChange', location);
  };
  onRegionWillChange = (location) => {
    console.log('onRegionWillChange', location);
  };
  onUpdateUserLocation = (location) => {
    console.log('onUpdateUserLocation', location);
  };
  onOpenAnnotation = (annotation) => {
    console.log('onOpenAnnotation', annotation);
  };
  onRightAnnotationTapped = (e) => {
    console.log('onRightAnnotationTapped', e);
  };
  onLongPress = (location) => {
    console.log('onLongPress', location);
  };
  onTap = (location) => {
    console.log('onTap', location);
  };
  onChangeUserTrackingMode = (userTrackingMode) => {
    this.setState({ userTrackingMode });
    console.log('onChangeUserTrackingMode', userTrackingMode);
  };

  componentWillMount() {
    this._offlineProgressSubscription = Mapbox.addOfflinePackProgressListener(progress => {
      console.log('offline pack progress', progress);
    });
    this._offlineMaxTilesSubscription = Mapbox.addOfflineMaxAllowedTilesListener(tiles => {
      console.log('offline max allowed tiles', tiles);
    });
    this._offlineErrorSubscription = Mapbox.addOfflineErrorListener(error => {
      console.log('offline error', error);
    });
  }

  componentWillUnmount() {
    this._offlineProgressSubscription.remove();
    this._offlineMaxTilesSubscription.remove();
    this._offlineErrorSubscription.remove();
  }

    componentWillReceiveProps(props) {
        if (props.locations) {
            this.handleNewLocationProps(props.locations);
        }
    }

    handleNewLocationProps(locations) {
        let newAnnotations = locations.map((location) => {
            return {
                id: location.id,
                coordinates: [location.location.lat, location.location.lon],
                type: 'point',
                title: location.name,
                subtitle: location.address,
                rightCalloutAccessory: {
                    source: {uri: 'https://cldup.com/9Lp0EaBw5s.png'},
                    height: 25,
                    width: 25
                },
            }
        });
        this.setState({
            annotations: newAnnotations
        });
    }

    renderAnnotations() {
        let arrow_img = require('../assets/images/arrow.png');
        let annotationViews = this.state.annotations.map((annotation) => {
            return (
              <Annotation
                    id={annotation.id}
                    key={annotation.id}
                    coordinate={{
                        latitude: annotation.coordinates[0], 
                        longitude: annotation.coordinates[1]
                    }}
                    annotationImageSource={{}}
                    style={{alignItems: 'center', justifyContent: 'center', position: 'absolute'}}
                  >
                    <View style={{width: 25, height: 25, backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Image style={{flex: 1}} source={arrow_img}/>
                    </View>
              </Annotation>
            )
        });

        return annotationViews;
    }

    render() {
        return(
            <View style={{flex: 1, alignItems: 'stretch'}}>
             <MapView
                      ref={map => { this._map = map; }}
                      style={{flex: 1}}
                      initialCenterCoordinate={this.state.center}
                      initialZoomLevel={9}
                      initialDirection={0}
                      annotations={[]}
                      rotateEnabled={false}
                      scrollEnabled={true}
                      zoomEnabled={true}
                      showsUserLocation={true}
                      styleURL={Mapbox.mapStyles.light}
                      userTrackingMode={this.state.userTrackingMode}
                      annotationsAreImmutable
                      onChangeUserTrackingMode={this.onChangeUserTrackingMode}
                      onRegionDidChange={this.onRegionDidChange}
                      onRegionWillChange={this.onRegionWillChange}
                      onOpenAnnotation={this.onOpenAnnotation}
                      onRightAnnotationTapped={this.onRightAnnotationTapped}
                      onUpdateUserLocation={this.onUpdateUserLocation}
                      onLongPress={this.onLongPress}
                      onTap={this.onTap}
                  >
                      {this.renderAnnotations()}   
  </MapView>
            </View>
        )
    }
}

LocationMapView.propTypes = {
}

