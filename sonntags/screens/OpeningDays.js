import React, {Component} from 'react';
import {
    ListView,
    View,
    Text,
    StyleSheet
} from 'react-native';

import moment from 'moment';

import { loadOpenSundays } from '../actions';


class OpeningDayItem extends Component {

    render() {
        let dateMoment = moment(this.props.openDay.date);
        let day = dateMoment.format("DD");
        let month = dateMoment.format("MMM");
        return (
            <View style={{height: 60.0, flex: 1}} >
                <View style={{flexDirection: 'row', height: '100%'}}>
                    <View style={{height: '100%', width: 60.0, justifyContent: 'center'}}>
                        <View style={{width: '70%', height: '70%', margin: '15%'}}>
                            <Text style={{flex: 1, textAlign: 'center', fontSize: 12}}>{month}</Text>
                            <Text style={{flex: 2, fontSize: 20, textAlign: 'center'}}>{day}</Text>
                        </View>
                    </View>
                    <View style={{height: '100%', width: '80%', margin: 15}}>
                        <Text numberOfLines={2} style={{flex: 1}}>{this.props.openDay.dayName}</Text>
                    </View>
                </View>
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
            let sorted = days.sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
            });
            let ds = this.state.dataSource.cloneWithRows(sorted);
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

    renderSeparator() {
        return (<View style={{height: StyleSheet.hairlineWidth}}/>)
    }

    renderHeader() {
        return (
            <View style={{height: 300}}>
                <View style={{height: '90%'}}>
                    <Text>In Berlin and throughout all of Germany, most stores are closed on Sunday.  However, the city allows
                        for several special Sunday shopping days during the year, when shops are allowed to open on Sunday and
                        do business as they do during the week.  These dates in Berlin are listed below. Most major supermarket 
                        chains participate in this, but not every one and not every other types of store,
                        so call ahead to make sure they're open beforehand.</Text>
                </View>
            </View>
        )
    }
   
    render() {
        return (
            <ListView
                renderSeparator={this.renderSeparator.bind(this)}
                renderHeader={this.renderHeader.bind(this)}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
            />
        )
    }
}
