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

import Icon from 'react-native-vector-icons/FontAwesome';
import Analytics from 'react-native-firebase-analytics';

import { NavigationActions } from 'react-navigation'

var styles = require('../assets/styles/index.js');

import { loadCategories } from '../actions';



class LocationTypeGridItem extends Component {

    render() {
        return (
            <TouchableOpacity onPress={this.props.categorySelected}>
                <View style={styles.locationGridItem}>
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


export default class LocationTypeGrid extends Component {
    
    static navigationOptions = ({ navigation }) => ({
        title: 'sonntags',
        headerLeft:<TouchableOpacity onPress={()=> navigation.navigate('DrawerOpen')}>
           <Icon name={'bars'}
               size={32}
               style={{height: 44, width: 44}}
           style={{color: 'white'}}/>
           </TouchableOpacity>

    });

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        }
    }
    
    componentDidMount() {

        loadCategories().then((categories) => {
            let withSpecialSundays = [{name: 'Special Sunday Openings', id: 'sonderoeffnung', iconName: 'calendar'}].concat(categories);
            let ds = this.state.dataSource.cloneWithRows(withSpecialSundays);
            this.setState({
                dataSource: ds
            })
        });
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
