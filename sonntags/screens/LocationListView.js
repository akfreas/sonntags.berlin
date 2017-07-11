import React, {Component} from 'react';
import MapView from 'react-native-maps';

import {
    ListView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

var styles = require('../assets/styles');
import {
    loadLocations
} from '../actions';

class LocationListItem extends Component {

    render() {
        return (
            <TouchableOpacity onPress={this.props.onLocationSelected}>
                <View style={styles.locationListItem}>
                    <View style={styles.locationListItemTitleContainer}>
                        <Text style={styles.locationListItemTitleText}>{this.props.location.name}</Text>
                        <Text style={styles.locationListItemDescriptionText}>Open {this.props.location.openingTime} - {this.props.location.closingTime}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}


export default class LocationListView extends Component {

    static navigationOptions = {
        title: "Category"
    };

    constructor(props) {
        super(props);
        this.state = {
            locations: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        };
    }

    locationSelected(location) {
    }

    renderRow(location) {
        return (
            <LocationListItem 
                location={location}
                onLocationSelected={this.locationSelected.bind(this)}
            />
        )
    }

    componentWillMount() {
        
        loadLocations(this.props.category.id).then((locations) => {
            console.log(locations);
            let ds = this.state.dataSource.cloneWithRows(locations);
            this.setState({
                locations: locations,
                dataSource: ds
            })
        })
    }

    header() {
        return (
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
      </MapView>)

    }

    render() {
        return (
            <View>
    
            <ListView
                renderHeader={this.header.bind(this)}
                contentContainerStyle={styles.locationList}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
            />
        </View>
        )
    }

}

