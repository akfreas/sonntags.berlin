import React from 'react';
import { createStackNavigator } from 'react-navigation';
import styles from '../styles';
import LocationTypeGrid from '../screens/LocationTypeGrid';
import OpeningDays from '../screens/OpeningDays';
import LocationDetailView from '../screens/LocationDetailView.js';
import NavWebView from '../screens/NavWebView.js';
import MainLocationMap from '../screens/MainLocationMap';
import InfoPage from '../screens/InfoPage';

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
        backgroundColor: styles.constants.primaryColor
    },
    headerBackTitle: null,
    headerTitleStyle: styles.headerTitleStyle,
    headerTintColor: 'white'
}

export const RootStackNavigator = createStackNavigator({

    Main: {
        screen: paramsToProps(MainLocationMap),
        navigationOptions: defaultNavOptions,
    },
    CategoryView: {
        screen: paramsToProps(MainLocationMap),
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
    InfoPage: {
        screen: paramsToProps(InfoPage),
        navigationOptions: defaultNavOptions
    },

});


