import React from 'react';
import { StackNavigator } from 'react-navigation';
import {
    AppRegistry
} from 'react-native';

import { closeDrawer } from '../actions';
import { connect } from 'react-redux';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';
import Drawer from 'react-native-drawer';
import DrawerMenu from '../components/DrawerMenu';
import { RootStackNavigator } from './RootStackNavigator';

import { 
  AdMobBanner, 
  AdMobInterstitial, 
  PublisherBanner,
  AdMobRewarded
} from 'react-native-admob'

import { addNavigationHelpers } from 'react-navigation';

class _RootNavigator extends React.Component {

    constructor(props) {
        super(props);
    }

  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
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
            acceptTap={false}
            type={'displace'}
            open={this.props.drawerOpen}
            onClose={() => this.props.setDrawerClosed() }
            captureGestures={this.props.drawerGesturesEnabled}
            openDrawerOffset={0.2}
            content={<DrawerMenu navigation={this.props.navigation}/>}
        >
                
                <RootStackNavigator navigation={addNavigationHelpers({
                    dispatch: this.props.dispatch,
                    state: this.props.navigation,
                })}
                    ref={(ref)=> this._navigator = ref}/>
                              <AdMobBanner
                  bannerSize="smartBannerPortrait"
                  adUnitID="ca-app-pub-5197876894535655/8159389107"
                  testDeviceID="EMULATOR"
                  didFailToReceiveAdWithError={this.bannerError} />
        </Drawer>);
  }
    componentWillReceiveProps(props) {
        console.log(props);
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
        drawerOpen: state.main.drawerOpen,
        navigation: state.navigation,
        drawerGesturesEnabled: state.main.drawerGesturesEnabled,
    }
}
const RootNavigator = connect(mapStateToProps, function(dispatch, props) {
    return {
        setDrawerClosed: () => {
            dispatch(closeDrawer())
        },
        dispatch: dispatch
    }
})(_RootNavigator);

export default RootNavigator;
AppRegistry.registerComponent('RootStackNavigator', () => RootNavigator);
