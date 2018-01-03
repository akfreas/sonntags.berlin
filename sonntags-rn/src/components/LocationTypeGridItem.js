import React, {Component} from 'react';

import {
    Image,
    Linking,
    Button,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Row,
    ListView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


var styles = require('../styles');

export default class LocationTypeGridItem extends Component {

    render() {

        let rowStyle = styles.locationGridItem;
        if (this.props.type.backgroundColor) {
            rowStyle = [rowStyle, {backgroundColor: this.props.type.backgroundColor}];
        }
        if (this.props.active) {
            rowStyle = [rowStyle, {backgroundColor: '#E4E3D8'}];
        }

        return (
            <TouchableOpacity onPress={this.props.categorySelected}>
                <View style={rowStyle}>
                    <View style={styles.locationGridIconContainer}>
                        <Icon
                            style={styles.locationGridIcon}
                            name={this.props.type.iconName}
                            size={32}
                            color='#3BB9BD'/>                        
                    </View>
                    <View style={styles.locationGridTextContainer}>
                        <Text style={styles.locationGridText}>{this.props.type.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}


