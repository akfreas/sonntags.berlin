import React, {Component} from 'react';

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
                    <View style={styles.locationListItemDistanceContainer}>
                        <Text>0.5 Km</Text>
                    </View>
                    <View style={styles.locationListItemTitleContainer}>
                        <Text>{this.props.location.name}</Text>
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
                dataSource: ds
            })
        })
    }

    render() {
        return (
            <ListView
                contentContainerStyle={styles.locationList}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
            />
        )
    }

}

