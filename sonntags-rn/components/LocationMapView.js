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

import Mapbox, { MapView }from 'react-native-mapbox-gl';
import PropTypes from 'prop-types';

const accessToken = 'pk.eyJ1IjoiYWtmcmVhcyIsImEiOiJjajh3b252ODkxcW9jMnFydmw1NzNzNGtiIn0.8IeSD3SyJIf8gbXhqwHIAA';

Mapbox.setAccessToken(accessToken);

export default class LocationMapView extends Component {

	state = {
		center: {
			latitude: 40.72052634,
			longitude: - 73.97686958312988
		},
		zoom: 11,
		userTrackingMode: Mapbox.userTrackingMode.none,
		annotations: [{
			coordinates: [40.72052634, - 73.97686958312988],
			type: 'point',
			title: 'This is marker 1',
			subtitle: 'It has a rightCalloutAccessory too',
			rightCalloutAccessory: {
				source: {
					uri: 'https://cldup.com/9Lp0EaBw5s.png'
				},
				height: 25,
				width: 25
			},
			annotationImage: {
				source: {
					uri: 'https://cldup.com/CnRLZem9k9.png'
				},
				height: 25,
				width: 25
			},
			id: 'marker1'
		},
		{
			coordinates: [40.714541341726175, - 74.00579452514648],
			type: 'point',
			title: 'Important!',
			subtitle: 'Neat, this is a custom annotation image',
			annotationImage: {
				source: {
					uri: 'https://cldup.com/7NLZklp8zS.png'
				},
				height: 25,
				width: 25
			},
			id: 'marker2'
		},
		{
			coordinates: [[40.76572150042782, - 73.99429321289062], [40.743485405490695, - 74.00218963623047], [40.728266950429735, - 74.00218963623047], [40.728266950429735, - 73.99154663085938], [40.73633186448861, - 73.98983001708984], [40.74465591168391, - 73.98914337158203], [40.749337730454826, - 73.9870834350586]],
			type: 'polyline',
			strokeColor: '#00FB00',
			strokeWidth: 4,
			strokeAlpha: .5,
			id: 'foobar'
		},
		{
			coordinates: [[40.749857912194386, - 73.96820068359375], [40.741924698522055, - 73.9735221862793], [40.735681504432264, - 73.97523880004883], [40.7315190495212, - 73.97438049316406], [40.729177554196376, - 73.97180557250975], [40.72345355209305, - 73.97438049316406], [40.719290332250544, - 73.97455215454102], [40.71369559554873, - 73.97729873657227], [40.71200407096382, - 73.97850036621094], [40.71031250340588, - 73.98691177368163], [40.71031250340588, - 73.99154663085938]],
			type: 'polygon',
			fillAlpha: 1,
			strokeColor: '#ffffff',
			fillColor: '#0000ff',
			id: 'zap'
		}]
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
                subtitle: location.address
            }
        });
        this.setState({
            annotations: newAnnotations
        });
    }

    render() {
        return(
            <View style={{flex: 1, alignItems: 'stretch'}}>
             <MapView
                      ref={map => { this._map = map; }}
                      style={{flex: 1}}
                      initialCenterCoordinate={this.state.center}
                      initialZoomLevel={this.state.zoom}
                      initialDirection={0}
                      rotateEnabled={true}
                      scrollEnabled={true}
                      zoomEnabled={true}
                      showsUserLocation={false}
                      styleURL={Mapbox.mapStyles.light}
                      userTrackingMode={this.state.userTrackingMode}
                      annotations={this.state.annotations}
                      annotationsAreImmutable
                      onChangeUserTrackingMode={this.onChangeUserTrackingMode}
                      onRegionDidChange={this.onRegionDidChange}
                      onRegionWillChange={this.onRegionWillChange}
                      onOpenAnnotation={this.onOpenAnnotation}
                      onRightAnnotationTapped={this.onRightAnnotationTapped}
                      onUpdateUserLocation={this.onUpdateUserLocation}
                      onLongPress={this.onLongPress}
                      onTap={this.onTap}
            />
            </View>
        )
    }
}

LocationMapView.propTypes = {
}

