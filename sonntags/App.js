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
    try {
      await cacheAssetsAsync({
        images: [require('./assets/images/expo-wordmark.png')],
        fonts: [
          FontAwesome.font,
          { 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf') },
        ],
      });
    } catch (e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    } finally {
      this.setState({ appIsReady: true });
    }
  }
    titleConfig() {
        return {
            title: 'sonntags.berlin'
        }
    }

  render() {
    if (this.state.appIsReady) {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {Platform.OS === 'android' &&
            <View style={styles.statusBarUnderlay} />}
 
            <NavigationBar
                title={this.titleConfig()}
            />

          <RootNavigation />
        </View>
      );
    } else {
      return <AppLoading />;
    }
  }
}

function select(store) {
    return {};
}
