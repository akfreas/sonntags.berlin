import React, {Component} from 'react';
import MapView from 'react-native-maps';

import {
    ListView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    AnimatedValue,
    Animated
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
            mapInteractionsEnabled: false,
                scrollY: new Animated.Value(0),
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
            let ds = this.state.dataSource.cloneWithRows(locations);
            this.setState({
                locations: locations,
                dataSource: ds,
            })
        })
    }

    toggleMapInteraction() {
        return;
        this.setState({
            mapInteractionsEnabled: !this.state.mapInteractionsEnabled
        });
        let height = this.state.mapInteractionsEnabled ? 500 : 200;

        this.state.animation.setValue(200);
        Animated.spring(this.state.animation,
            { toValue: height }
        ).start();

    }

    header() {
        return (
            <View style={[styles.mapContainer]}>
              <MapView
                  showsUserLocation={true}
                  showsCompass={false}
                  pitchEnabled={false}
                  zoomEnabled={this.state.mapInteractionsEnabled}
                  scrollEnabled={this.state.mapInteractionsEnabled}
                  style={[styles.map]}
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

            </View>
        )

    }

    renderHeader() {
        return (
            <View style={[{backgroundColor: 'rgba(0,0,0,0)', opacity: 0.0, height: 200.0}]}>
                <Text>Hey</Text>
            </View>
            )
    }

    viewBehind() {
        return (
            <View style={[{backgroundColor: 'rgb(36, 255, 6)', height: 400.0, position: 'absolute', top: 0, left: 0, right: 0}]}>
                <Text>Hi, i'm behind</Text>
            </View>
        )
    }


    render() {
        return (
        <View style={[{backgroundColor: '#FC1'}]}>
            {this.header()}
            <ListView
                renderHeader={this.renderHeader.bind(this)}
                contentContainerStyle={styles.locationListContainer}
                style={[{backgroundColor: 'rgba(0,0,0,0)', position: 'absolute', top: 0, left: 0, right: 0}]}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
            />

        </View>
        )
    }

}

