import React, {Component} from 'react';
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ListView
} from 'react-native';


var styles = require('../assets/styles');

export default class Location extends Component {

    pressed() {
    }

    render() {
        return (
            <TouchableOpacity onPress={this.pressed.bind(this)}>
                <View style={styles.li}>
                    <Text style={styles.liText}>{this.props.item.name}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}
