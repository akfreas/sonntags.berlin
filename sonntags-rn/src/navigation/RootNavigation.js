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

class _RootNavigator extends React.Component {

    constructor(props) {
        super(props);
    }

  componentDidMount() {
  }

  componentWillUnmount() {
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
              
        </Drawer>);
  }
    componentWillReceiveProps(props) {
        console.log(props);
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
