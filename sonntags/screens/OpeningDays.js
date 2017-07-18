import React, {Component} from 'react';
import {
    ListView,
    View,
    Text,
} from 'react-native';

import { loadOpenSundays } from '../actions';


class OpeningDayItem extends Component {

    render() {
        console.log("openday: ", this.props.openDay);
        return (
            <View style={{height: 44.0, flex: 1}} >
                <Text style={{flex: 1}}>{this.props.openDay.dayName}</Text>
            </View>
        )
    }
}

export default class OpeningDaysList extends Component {
 
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        }
    }

    componentWillMount() {
        loadOpenSundays().then((days) => {
            let ds = this.state.dataSource.cloneWithRows(days);
            this.setState({
                dataSource: ds
            })
        })
    }

    renderRow(day) {
        return (
            <OpeningDayItem openDay={day}/>
        )
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
