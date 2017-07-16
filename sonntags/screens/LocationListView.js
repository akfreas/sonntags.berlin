import React, {Component} from 'react';
import MapView from 'react-native-maps';

import {
    ScrollView,
    ListView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    AnimatedValue,
    Animated,
    StyleSheet
} from 'react-native';

import {
    loadLocations
} from '../actions';

var styles = StyleSheet.create({
    locationListItem: {
        padding: 10.0,
        height: 70.0,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff'//rgba(255,255,255,1)
    },
    locationListItemDistanceContainer: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    locationListItemTitleContainer: {
        flex: 1.0,
        //justifyContent: 'start',
        alignItems: 'flex-start',
    },
    locationListItemDescriptionText: {
    },
    locationListItemTitleText: {
        fontWeight: 'bold',
    }
})
class LocationListItem extends Component {

    render() {
        return (

            <View style={[styles.locationListItem]}>
                <TouchableOpacity onPress={this.props.onLocationSelected}>
                    <View style={[styles.locationListItem]}>
                        <View style={styles.locationListItemTitleContainer}>
                            <Text style={styles.locationListItemTitleText}>{this.props.location.name}</Text>
                            <Text style={styles.locationListItemDescriptionText}>Open {this.props.location.openingTime} - {this.props.location.closingTime}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

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
            let ds = this.state.dataSource.cloneWithRows(locations);
            this.setState({
                locations: locations,
                dataSource: ds,
            })
        })
    }
    mapView() {
        return (
            <View style={{position: 'absolute', top: 0, left: 0, right: 0, height: '100%'}}>
                          <MapView
                  showsUserLocation={true}
                  showsCompass={false}
                  pitchEnabled={false}
                  style={{flex: 1}}
                  initialRegion={{
                      latitude: 52.4944623,
                      longitude: 13.4034689,
                      latitudeDelta: 0.2922,
                      longitudeDelta: 0.3421,
                    }}>
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

    handleHeaderTouches(event) {
        console.log(event)
    }


    renderHeader() {
        return (
            <View 
                style={[{backgroundColor: 'rgba(0,0,0,0)', height: 400.0}]}
            >
            {this.mapView()}
        </View>

            )
    }


    render() {

        return (
        <View style={{backgroundColor: '#FC1', flex: 1}}>
             <ListView
                renderHeader={this.renderHeader.bind(this)}
                contentContainerStyle={{justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0)'}}
                style={{backgroundColor: 'rgba(0,0,0,0)', flex: 1}}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
            />

        </View>
        );
    }

}

