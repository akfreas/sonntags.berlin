import React from 'react';
import { 
    Platform, 
    StatusBar, 
    View 
} from 'react-native';
import RootNavigation from './navigation/RootNavigation';
import IntroScreen from './screens/IntroScreen.js';
import NavigationBar from 'react-native-navbar';

import cacheAssetsAsync from './utilities/cacheAssetsAsync';

var styles = require('./assets/styles');



export default class AppContainer extends React.Component {
  state = {
    appIsReady: false,
  };

  componentWillMount() {
    this._loadAssetsAsync();
  }

  async _loadAssetsAsync() {
  }

  render() {

      //      return (<IntroScreen/>);

      return (
        <RootNavigation />
      );
  }
}

function select(store) {
    return {};
}
