import React, {Component} from 'react';

import {
    Image,
    Linking,
    Button,
    Platform,
    Dimensions,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Row,
    ListView
} from 'react-native';

import Analytics from 'react-native-firebase-analytics';
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import MapButtonPanel from '../components/MapButtonPanel';

import {create_i18n} from '../utilities';

var I18n = create_i18n();

var styles = require('../styles/index.js');

import { loadCategories } from '../actions';
import LocationTypeGridItem from '../components/LocationTypeGridItem';

let width = Dimensions.get('window').width
let height = Dimensions.get('window').height



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

    componentWillMount() {
        this.loadForProps(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.loadForProps(nextProps);
    }

    loadForProps(props) {
        if (!props.loadCategories) {
            return
        }
        props.loadCategories((categories) => {
                let ds = null;
                if (props.activeFilter) {
                    let withAllCategory = [{
                        name: I18n.t('clear_filter'), 
                        backgroundColor: styles.constants.secondaryColor,
                        textColor: styles.constants.secondaryColorNegative,
                        iconName: 'close'}].concat(categories);

                    ds = this.state.dataSource.cloneWithRows(withAllCategory);
                } else {
                    ds = this.state.dataSource.cloneWithRows(categories);
                }

                this.setState({
                    dataSource: ds
                })
        });

    }

    categorySelected(category) {
        if (!category.id) {
            this.props.onItemSelected(null);
        } else {
            this.props.onItemSelected(category);
        }
    }

    renderRow(item) {
        return (
            <LocationTypeGridItem 
                type={item} 
                active={item.id && this.props.activeFilter && item.id == this.props.activeFilter.id}
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
                    style={[styles.categoryTable, {position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}]}
                    renderSeparator={this.renderSeparator.bind(this)} 
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                >
             </ListView>
             <View  style={{
                        alignSelf: 'flex-end',
                        flexDirection: 'row',
                        paddingTop: 0,
                        position: 'absolute',
                        alignItems: 'center',
                        top: height/2-30,
                        width: 60,
                        height: 60
             }}>
             <MapButtonPanel buttons={[{
                 title: 'close_filter',
                 icon: 'close', 
                 target: () => {this.props.onCloseTapped()}}]}/>
            </View>


            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadCategories: (callback) => {
            return dispatch(loadCategories(callback))
        }
    };
}

// export default connect(mapStateToProps, mapDispatchToProps)(LocationTypeGrid);
export default LocationTypeGrid;
