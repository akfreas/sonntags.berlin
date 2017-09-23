import React from 'react';
import { StackNavigator } from 'react-navigation';
import {
    AppRegistry
} from 'react-native';

import { connect } from 'react-redux';
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

class _RootNavigator extends React.Component {

    constructor(props) {
        super(props);
    }

  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
    console.log(this._navigator);
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  render() {
      return (
                <Drawer 
                ref={(ref) => this._drawer = ref}
                type="overlay"
                tapToClose={true}
                acceptPan={true}
                type={'static'}
                open={this.props.drawerOpen}
                captureGestures={true}
                openDrawerOffset={0.2}
                content={<DrawerMenu navigation={this.props.navigation}/>}
            >
              <RootStackNavigator ref={(ref)=> this._navigator = ref}/>
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


function mapStateToProps(state) {
    return {
        drawerOpen: state.drawerOpen
    }
}
const RootNavigator = connect(mapStateToProps, {})(_RootNavigator);

export default RootNavigator;
AppRegistry.registerComponent('RootStackNavigator', () => RootNavigator);
