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

import Icon from 'react-native-vector-icons/FontAwesome';


var styles = require('../assets/styles/index.js');


class LocationTypeGridItem extends Component {

    render() {
        return (
            <TouchableOpacity onPress={this.props.categorySelected}>
                <View style={styles.locationGridItem}>
                    <View style={styles.locationGridIconContainer}>
                        <Icon
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
        header: null
    }

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
            {typeName: 'Special Sunday Openings', id: 'sonderoeffnung', icon: 'calendar'},
            {typeName: 'Groceries', id: 'grocery', icon: 'shopping-cart'},
            {typeName: 'Home & Garden', id: 'homegarden', icon: 'home'},
            {typeName: 'Apotheke', id: 'apotheke', icon: 'medkit'},
            {typeName: 'Bike Shops', id: 'bikeshop', icon: 'bicycle'},
        ]
    }

    categorySelected(category) {
        const { navigate } = this.props.navigation; 
        if (category.id == 'sonderoeffnung') {
            navigate('OpenSundays');   
        } else {
            navigate('CategoryView', { category: category });
        }
    }

    renderRow(item) {
        return (
            <LocationTypeGridItem 
                type={item} 
                categorySelected={() => this.categorySelected(item)}
            />
        )
    }

    renderSeparator() {
        return (<View style={styles.categoryListItemDivider}/>)
    }
    
    render() {
        return (
            <View style={{ height: "100%"}}>
                <View style={{
                    height: 100, 
                    paddingTop: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#3BB9BD'

                }}>
                <Text style={{ textAlign: 'center', 
                    fontFamily: 'lato-bold',
                    fontSize: 32,
                    margin: 5,
                    color: 'white'
                }}>Sunday Shopping</Text>
            </View>
            <ListView 
                style={styles.categoryTable}
                renderSeparator={this.renderSeparator.bind(this)} 
                contentContainerStyle={styles.locationGridList}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}/>
            </View>
        );
    }
}
