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
        let locationGridIconContainerStyle = styles.locationGridIconContainer;
        let iconColor = this.props.type.textColor ? this.props.type.textColor : styles.constants.primaryColor;
        let textColor = this.props.type.textColor ? this.props.type.textColor : 'black';

        if (this.props.type.backgroundColor) {
            rowStyle = [rowStyle, {backgroundColor: this.props.type.backgroundColor}];
        }
        if (this.props.active) {
            locationGridIconContainerStyle = [locationGridIconContainerStyle, {margin: 10, borderRadius: 100, backgroundColor: styles.constants.secondaryColor}];
            iconColor = styles.constants.secondaryColorNegative;
        }

        return (
            <TouchableOpacity onPress={this.props.categorySelected}>
                <View style={rowStyle}>
                    <View style={locationGridIconContainerStyle}>
                        <Icon
                            style={styles.locationGridIcon}
                            name={this.props.type.iconName}
                            size={32}
                            color={iconColor}/>                        
                    </View>
                    <View style={styles.locationGridTextContainer}>
                        <Text style={[{color: textColor}, styles.locationGridText]}>{this.props.type.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}


