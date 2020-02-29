import React from "react";
import {
    AppRegistry
} from "react-native";

import { connect } from "react-redux";
import { RootStackNavigator } from "./RootStackNavigator";

import { addNavigationHelpers } from "react-navigation";
import { getSpaceInfo } from "../actions";

class RootNavigator extends React.Component {

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
                // <RootStackNavigator navigation={{
                //     dispatch: this.props.dispatch,
                //     state: this.props.navigation,
                // }}
                <RootStackNavigator />
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
        navigation: state.navigation
    }
}
// const RootNavigator = connect(mapStateToProps, function(dispatch, props) {
//     return {
//         getSpaceInfo: () => {
//             dispatch(getSpaceInfo());
//         },
//         dispatch: dispatch
//     }
// })(_RootNavigator);

export default RootNavigator;
AppRegistry.registerComponent("RootStackNavigator", () => RootNavigator);
