import React from "react";
import { Provider } from "react-redux";
import main from "./reducers";
import {
  legacy_createStore as createStore,
  applyMiddleware,
  combineReducers,
  compose
} from "redux";
import { thunk as thunkMiddleware } from "redux-thunk";
import { RootStackNavigator } from "./navigation/RootStackNavigator.js";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";

const store = createStore(
  combineReducers({
    main
  }),
  compose(applyMiddleware(thunkMiddleware))
);

class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Provider store={store}>
          <RootStackNavigator />
        </Provider>
      </NavigationContainer>
    );
  }
}

export default App;
