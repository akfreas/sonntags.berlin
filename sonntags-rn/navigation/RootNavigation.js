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
import NavWebView from '../screens/NavWebView.js';
import Drawer from 'react-native-drawer';
import DrawerMenu from '../components/DrawerMenu';

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
    headerTitleStyle: {
        color: 'white',
        fontFamily: 'lato-bold',
        fontSize: 20

    },
    headerTintColor: 'white'
}

const RootStackNavigator = StackNavigator({
    
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

export default class RootNavigator extends React.Component {

  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
    console.log("xxxxxxx");
    console.log(this._navigator);


  }

  openDrawer() {
      Analytics.logEvent('drawer_open');
      this._drawer.open();
  }
  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  render() {
    console.log(this._navigator);
      return (
                <Drawer 
                ref={(ref) => this._drawer = ref}
                type="overlay"
                tapToClose={true}
                acceptPan={true}
                type={'static'}
                captureGestures={true}
                openDrawerOffset={0.2}
                content={<DrawerMenu navigation={this.props.navigation}/>}
            >
              <RootStackNavigator ref={(ref)=> this._navigator = ref} params={{openDrawer: this.openDrawer.bind(this)}}/>
        </Drawer>);
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
