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

import { 
  AdMobBanner, 
  AdMobInterstitial, 
  PublisherBanner,
  AdMobRewarded
} from 'react-native-admob'

import Icon from 'react-native-vector-icons/FontAwesome';
import Analytics from 'react-native-firebase-analytics';
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'


var styles = require('../assets/styles/index.js');

import { loadCategories, toggleDrawer } from '../actions';



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


class LocationTypeGrid extends Component {
    
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
        title: 'sonntags',
        headerLeft:<TouchableOpacity onPress={()=> params.openDrawer() }>

           <Icon name={'bars'}
               size={32}
               style={{height: 44, width: 44}}
           style={{color: 'white'}}/>
           </TouchableOpacity>

    }};

    constructor(props) {
        super(props);

        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        }
    }

    onNavigatorEvent(event) {
        if (event.type == 'DrawerOpen') {

        }
    }

    openDrawer() {
        this.props.ourToggleDrawer();
    }
    
    componentDidMount() {

        this.props.navigation.setParams({ openDrawer: this.openDrawer.bind(this) });
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
                <AdMobBanner
                  bannerSize="fullBanner"
                  adUnitID="ca-app-pub-5197876894535655/8159389107"
                  testDeviceID="EMULATOR"
                  didFailToReceiveAdWithError={this.bannerError} />

            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
    };
}

export default connect(mapStateToProps, { ourToggleDrawer: toggleDrawer })(LocationTypeGrid);
