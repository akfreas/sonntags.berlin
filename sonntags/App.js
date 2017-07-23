import React from 'react';
import { 
    Platform, 
    StatusBar, 
    View 
} from 'react-native';
import { AppLoading } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';

import NavigationBar from 'react-native-navbar';

var styles = require('./assets/styles');


export default class AppContainer extends React.Component {
  state = {
    appIsReady: false,
  };

  componentWillMount() {
  }

  render() {
      return (
        <RootNavigation />
      );
  }
}

function select(store) {
    return {};
}
