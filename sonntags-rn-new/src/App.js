import React from "react";
import { 
    Platform, 
    StatusBar, 
    View 
} from "react-native";
import NavigationBar from "react-native-navbar";
import { Provider } from "react-redux"
import cacheAssetsAsync from "./utilities/cacheAssetsAsync";
import main from "./reducers"
import { 
    createStore, 
    applyMiddleware,
    combineReducers,
} from "redux"
import thunkMiddleware from "redux-thunk";
import { RootStackNavigator } from "./navigation/RootStackNavigator.js";
import { composeWithDevTools } from "redux-devtools-extension";
import Analytics from "react-native-firebase-analytics";
import { createAppContainer } from "react-navigation";
var styles = require("./styles/index.js");


const store = createStore(
    combineReducers({
        main,
        navigation: (state, action) => (
            RootStackNavigator.router.getStateForAction(action, state)
        )
    }),
    composeWithDevTools(applyMiddleware(thunkMiddleware)),
)

const AppContainer = createAppContainer(RootStackNavigator);

class App extends React.Component {
  state = {
    appIsReady: false,
  };

  componentWillMount() {
      this._loadAssetsAsync();
      Analytics.setEnabled(true);
  }

  async _loadAssetsAsync() {
  }

  render() {
      return (
        <Provider store={store}>
            <AppContainer />
        </Provider>
      );
  }
}

function select(store) {
    return {};
}

function mapStateToProps(state) {
    return {
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default App;

