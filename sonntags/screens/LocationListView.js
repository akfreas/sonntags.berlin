import React, {Component} from 'react';

import {
    ListView
} from 'react-native';

var styles = require('../assets/styles');
import {
    loadLocations
} from '../actions';

class LocationListItem extends Component {

    render() {
        return (
            <Text>{this.props.location.name}</Text>
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


    renderRow(location) {
        return (
            <LocationListItem location={location}/>
        )
    }

    componentWillMount() {
        loadLocations(this.props.category).then((locations) => {
            let ds = this.state.dataSource.cloneWithRows(locations);
            this.setState({
                dataSource: ds
            })
        })
    }

    render() {
        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
            />
        )
    }

}

