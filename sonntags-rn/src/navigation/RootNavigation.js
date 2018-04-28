import React from 'react';
import { StackNavigator } from 'react-navigation';
import {
    AppRegistry
} from 'react-native';

import { closeDrawer } from '../actions';
import { connect } from 'react-redux';
import Drawer from 'react-native-drawer';
import DrawerMenu from '../components/DrawerMenu';
import { RootStackNavigator } from './RootStackNavigator';

import { addNavigationHelpers } from 'react-navigation';
import { getSpaceInfo } from '../actions';

class _RootNavigator extends React.Component {

    constructor(props) {
        super(props);
    }
    componentWillMount() {
    }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  render() {
      return (
                <RootStackNavigator navigation={addNavigationHelpers({
                    dispatch: this.props.dispatch,
                    state: this.props.navigation,
                })}
                    ref={(ref)=> this._navigator = ref}/>
      );
  }

    componentWillReceiveProps(props) {
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
        getSpaceInfo: () => {
            dispatch(getSpaceInfo());
        },
        setDrawerClosed: () => {
            dispatch(closeDrawer())
        },
        dispatch: dispatch
    }
})(_RootNavigator);

export default RootNavigator;
AppRegistry.registerComponent('RootStackNavigator', () => RootNavigator);
