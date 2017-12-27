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

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Analytics from 'react-native-firebase-analytics';
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'

import {create_i18n} from '../utilities';

var I18n = create_i18n();

var styles = require('../styles/index.js');

import { loadCategories, toggleDrawer } from '../actions';
import LocationTypeGridItem from '../components/LocationTypeGridItem';

import HamburgerBars from '../components/HamburgerBars.js';


class LocationTypeGrid extends Component {
    
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
        title: 'sonntags',
        headerLeft:<HamburgerBars onPress={()=> params.openDrawer() }/>
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
            let withSpecialSundays = [{name: I18n.t('special_opening_days_title'), id: 'sonderoeffnung', iconName: 'calendar'}].concat(categories);
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
                    renderRow={this.renderRow.bind(this)}
                />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
    };
}

export default connect(mapStateToProps, { ourToggleDrawer: toggleDrawer })(LocationTypeGrid);
