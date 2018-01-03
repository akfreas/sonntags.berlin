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

import Analytics from 'react-native-firebase-analytics';
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'

import {create_i18n} from '../utilities';

var I18n = create_i18n();

var styles = require('../styles/index.js');

import { loadCategories } from '../actions';
import LocationTypeGridItem from '../components/LocationTypeGridItem';



class LocationTypeGrid extends Component {
    
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
        title: 'sonntags',
    }};

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
            let withAllCategory = [{
                name: I18n.t('special_opening_days_title'), 
                id: 'sonderoeffnung', 
                iconName: 'sigma'}].concat(categories);

            let ds = this.state.dataSource.cloneWithRows(withAllCategory);
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

export default connect(mapStateToProps)(LocationTypeGrid);
