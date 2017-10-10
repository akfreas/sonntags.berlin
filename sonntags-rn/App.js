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
import { 
    createStore, 
    applyMiddleware,
    combineReducers,
} from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';

var styles = require('./assets/styles');


const store = createStore(
    combineReducers({nav: rootReducer}),
    composeWithDevTools(applyMiddleware(thunkMiddleware)),
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
