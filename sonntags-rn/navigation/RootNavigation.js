import React from 'react';
import { StackNavigator } from 'react-navigation';
import {
    AppRegistry
} from 'react-native';

import LocationListView from '../screens/LocationListView';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';
import LocationTypeGrid from '../screens/LocationTypeGrid';
import OpeningDays from '../screens/OpeningDays';
import LocationDetailView from '../screens/LocationDetailView.js';

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

const RootStackNavigator = StackNavigator({
    Main: {
        screen: paramsToProps(LocationTypeGrid),
    },
    CategoryView: {
        screen: paramsToProps(LocationListView),
    },
    OpenSundays: {
        screen: OpeningDays,
    },
    LocationDetail: {
        screen: paramsToProps(LocationDetailView),
    },
});

export default class RootNavigator extends React.Component {
  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  render() {
    return <RootStackNavigator />;
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync();

  }

  _handleNotification = ({ origin, data }) => {
    console.log(
      `Push notification ${origin} with data: ${JSON.stringify(data)}`
    );
  };
}

AppRegistry.registerComponent('RootStackNavigator', () => RootStackNavigator);
