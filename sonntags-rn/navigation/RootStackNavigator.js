import React from 'react';
import { StackNavigator } from 'react-navigation';
import styles from '../assets/styles';
import LocationTypeGrid from '../screens/LocationTypeGrid';
import OpeningDays from '../screens/OpeningDays';
import LocationDetailView from '../screens/LocationDetailView.js';
import NavWebView from '../screens/NavWebView.js';
import LocationListView from '../screens/LocationListView';

const paramsToProps = (SomeComponent) => {
// turns this.props.navigation.state.params into this.params.<x>
    return class extends React.Component {
        static navigationOptions = SomeComponent.navigationOptions;
    	// everything else, call as SomeComponent
        render() {
            const {navigation, ...otherProps} = this.props
            const {state: {params}} = navigation
            return <SomeComponent {...this.props} {...params} />
        }
    }
}
const defaultNavOptions = {
    headerStyle: {
        backgroundColor: '#3BB9BD'
    },
    headerBackTitle: null,
    headerTitleStyle: styles.headerTitleStyle,
    headerTintColor: 'white'
}

export const RootStackNavigator = StackNavigator({

    Main: {
        screen: paramsToProps(LocationTypeGrid),
        navigationOptions: defaultNavOptions,
    },
    CategoryView: {
        screen: paramsToProps(LocationListView),
        navigationOptions: defaultNavOptions,
    },
    OpenSundays: {
        screen: paramsToProps(OpeningDays),
        navigationOptions: defaultNavOptions,
    },
    NavWebView: {
        screen: paramsToProps(NavWebView),
        navigationOptions: defaultNavOptions,
    },
    LocationDetail: {
        screen: paramsToProps(LocationDetailView),
        navigationOptions: defaultNavOptions,
    },
});


