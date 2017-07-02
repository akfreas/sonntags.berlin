import React, {Component} from 'react';

import {
    ListView
} from 'react-native';

var styles = require('../assets/styles');
import {
    loadLocations
} from '../actions';


export default class LocationListView extends Component {

    renderRow() {
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

