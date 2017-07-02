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
            <TouchableOpacity onPress={this.props.categorySelected}>
                <View style={styles.locationGridItem}>
                    <View style={styles.locationGridIconContainer}>
                        <FontAwesome
                            style={styles.locationGridIcon}
                            name={this.props.type.icon}
                            size={32}
                            color='#3BB9BD'/>
                    </View>
                    <View style={styles.locationGridTextContainer}>
                        <Text style={styles.locationGridText}>{this.props.type.typeName}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}


export default class LocationTypeGrid extends Component {

    static navigationOptions = {
        title: "sonntags.berlin"
    };


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
            {typeName: 'Groceries', id: 'grocery', icon: 'shopping-cart'},
            {typeName: 'Home & Garden', id: 'homegarden', icon: 'home'},
            {typeName: 'Apotheke', id: 'apotheke', icon: 'medkit'}
        ]
    }

    categorySelected(category) {
        const { navigate } = this.props.navigation; 
        navigate('CategoryView', { category: category })
        console.log(category);

    }

    renderRow(item) {
        return (<LocationTypeGridItem 
            type={item} 
            categorySelected={() => this.categorySelected(item)}/>
        )
    }
    
    render() {
        return (
            <ListView contentContainerStyle={styles.locationGridList}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}/>
        );

    }
}
