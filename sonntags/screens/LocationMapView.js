import MapView from 'react-native-maps';
import React, {Component} from 'react';

var styles = require('../assets/styles');

export default class LocationMapView extends Component {

    componentWillMount() {
    }

    render() {
        return(
      <MapView
          style={styles.map}
        initialRegion={{
          latitude: 52.4944623,
          longitude: 13.4034689,
          latitudeDelta: 0.7922,
          longitudeDelta: 0.7421,
        }}
      />
        )
    }
}
