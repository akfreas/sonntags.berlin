import MapView from 'react-native-maps';
import React, {Component} from 'react';

var styles = require('../assets/styles');
import {
    loadLocations
} from '../actions';


export default class LocationMapView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            locations: []
        }
    }

    componentWillMount() {
        loadLocations().then((locations) => {
            console.log(locations);
            this.setState({
                locations: locations
            })
        })
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
      >
          {this.state.locations.map((location) => {
            let latlong = {latitude: location.location.lat, longitude: location.location.lon};
            let marker = <MapView.Marker
                coordinate={latlong}
                key={location.name}
                title={location.name}
                description={location.location.formattedAddress}/>
            return marker
        })}
      </MapView>
        )
    }
}
