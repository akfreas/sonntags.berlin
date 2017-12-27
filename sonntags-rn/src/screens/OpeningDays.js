import React, {Component} from 'react';
import {
    ListView,
    View,
    Text,
    StyleSheet,
    Switch
} from 'react-native';

import moment from 'moment';
import Hyperlink from 'react-native-hyperlink';
import { loadOpenSundays } from '../actions';

import {create_i18n} from '../utilities';

var I18n = create_i18n();

class OpeningDayItem extends Component {

    render() {
        let dateMoment = moment(this.props.openDay.date);
        let day = dateMoment.format("DD");
        let month = dateMoment.format("MMM");
        return (
            <View style={{height: 70.0, flex: 1}} >
                <View style={{flexDirection: 'row', height: '100%'}}>
                    <View style={{height: '100%', width: 60.0, justifyContent: 'center'}}>
                        <View style={{width: '70%', height: '70%', margin: '15%'}}>
                            <Text style={{flex: 1, textAlign: 'center', fontSize: 14, fontFamily: 'Lato-Bold'}}>{month}</Text>
                            <Text style={{flex: 2, fontSize: 22, textAlign: 'center', fontFamily: 'Lato-Bold'}}>{day}</Text>
                        </View>
                    </View>
                    <View style={{height: '100%', width: '80%', margin: 15}}>
                        <Text numberOfLines={2} style={{flex: 1, fontFamily: 'lato-light', fontSize: 16}}>{this.props.openDay.dayName}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

export default class OpeningDaysList extends Component {

    
    static navigationOptions = {
        title: I18n.t('special_opening_days_title')
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

    openWebsite() {
        const { navigate } = this.props.navigation;
        navigate('NavWebView', {title: 'berlin.de', uri: 'http://bit.ly/sonntags-berlin'});
    }

    renderHeader() {
        return (
            <View style={{flex: 1}}>
                <View style={{flex: 1, margin: 10}}>

                            <Hyperlink linkStyle={{ color: '#2980b9'}} onPress={this.openWebsite.bind(this)}>
                    <Text>
                        <Text style={{fontFamily: 'Lato-Bold', fontSize: 16}}>{I18n.t('opening_days_bold')}{'\n'}</Text> 
                        <Text style={{fontFamily: 'Lato-Regular', fontSize: 16}}>{I18n.t('opening_days_text')}</Text>
                            <Text style={{fontFamily: 'Lato-Regular', fontSize: 16}}>{"\n\n"}{I18n.t('more_info')}</Text>
                    </Text>
                        </Hyperlink>

                </View>
                <View style={{flex: 1, margin: 10}}>
                    <View style={{flexDirection: 'row'}}>
                        {/*
                        <View style={{flex: 4}}>
                            <Text style={{fontFamily: 'Lato-Bold'}}>Notify me when shops are open on Sundays.</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Switch style={{}} 
                                onValueChange={this.switchChanged.bind(this)}
                                value={this.state.notificationsOn}
                            />
                        </View>
                        */}

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
