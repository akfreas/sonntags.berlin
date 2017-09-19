import React from 'react';
import { 
    Platform, 
    StatusBar, 
    View 
} from 'react-native';
import RootNavigation from './navigation/RootNavigation';
import IntroScreen from './screens/IntroScreen.js';
import NavigationBar from 'react-native-navbar';
import { Provider } from 'react-redux'
import cacheAssetsAsync from './utilities/cacheAssetsAsync';
import rootReducer from './reducers'
import { createStore, applyMiddleware } from 'redux'

var styles = require('./assets/styles');


const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

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
      return (
          <Provider store={store}>
                <RootNavigation />
            </Provider>
      );
  }
}

function select(store) {
    return {};
}
