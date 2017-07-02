import React, {Component} from 'react';

var styles = require('../assets');

export default class Location extends Component {

    render() {
        return (
            <View style={styles.li}>
                <Text style={styles.liText}>{this.props.item.title}</Text>
            </View>
        )
    }
}
