import React, {Component} from 'react';
import {
    ListView,
    View,
    Text,
    StyleSheet,
    Switch
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
                            <Text style={{flex: 1, textAlign: 'center', fontSize: 12, fontFamily: 'lato-bold'}}>{month}</Text>
                            <Text style={{flex: 2, fontSize: 20, textAlign: 'center', fontFamily: 'lato-bold'}}>{day}</Text>
                        </View>
                    </View>
                    <View style={{height: '100%', width: '80%', margin: 15}}>
                        <Text numberOfLines={2} style={{flex: 1, fontFamily: 'lato-light'}}>{this.props.openDay.dayName}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

export default class OpeningDaysList extends Component {

    
    static navigationOptions = {
        title: "Special Opening Days"
    };
 
    constructor(props) {
        super(props);
        this.state = {
            notificationsOn: false,
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

    switchChanged(value) {
        this.setState({
            notificationsOn: value
        });
    }

    renderHeader() {
        return (
            <View style={{height: 130}}>
                <View style={{flex: 1, margin: 10}}>
                    <Text>
                        <Text style={{fontFamily: 'lato-bold'}}>Things aren't open on Sunday.</Text> 
                        <Text style={{fontFamily: 'lato-light'}}> Berlin allows for some exceptions.  Here they are.</Text>
                    </Text>

                </View>
                <View style={{flex: 1, margin: 10}}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 4}}>
                            <Text style={{fontFamily: 'lato-bold'}}>Notify me when shops are open on Sundays.</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Switch style={{}} 
                                onValueChange={this.switchChanged.bind(this)}
                                value={this.state.notificationsOn}
                            />
                        </View>

                    </View>
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
                style={{backgroundColor: 'white'}}
            />
        )
    }
}
