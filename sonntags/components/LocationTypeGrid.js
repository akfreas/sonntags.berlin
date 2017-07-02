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
import { FontAwesome } from '@expo/vector-icons';

var styles = require('../assets/styles');


class LocationTypeGridItem extends Component {

    render() {
        return (
            <View style={styles.locationGridItem}>
                <FontAwesome
                    style={styles.locationGridIcon}
                    name={this.props.type.icon}
                    size={32}
                    color='#3BB9BD'/>
                <Text style={styles.locationGridText}>{this.props.type.typeName}</Text>
            </View>
        )
    }
}


export default class LocationTypeGrid extends Component {


    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        }
    }
    
    componentDidMount() {
        let ds = this.state.dataSource.cloneWithRows(this.locationTypes());
        this.setState({
            dataSource: ds
        })
    }

    locationTypes() {
        return [
            {typeName: 'Groceries', icon: 'shopping-cart'},
            {typeName: 'Home & Garden', icon: 'home'},
            {typeName: 'Apotheke', icon: 'medkit'}
        ]
    }

    renderRow(item) {
        return (<LocationTypeGridItem type={item}/>)
    }
    
    render() {
        return (
            <ListView contentContainerStyle={styles.list}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}/>
        );

    }
}
