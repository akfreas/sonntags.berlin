import React from 'react';
import { StackNavigator } from 'react-navigation';
import {
    AppRegistry
} from 'react-native';

import LocationListView from '../screens/LocationListView';
import LocationTypeGrid from '../screens/LocationTypeGrid';
import OpeningDays from '../screens/OpeningDays';

const paramsToProps = (SomeComponent) => { 
// turns this.props.navigation.state.params into this.params.<x>
    return class extends React.Component {
        render() {
            const {navigation, ...otherProps} = this.props
            const {state: {params}} = navigation
            return <SomeComponent {...this.props} {...params} />
        }
    }
}
const RootStackNavigator = StackNavigator({
    Main: {
        screen: paramsToProps(LocationTypeGrid),
    },
    CategoryView: {
        screen: paramsToProps(LocationListView),
    },
    OpenSundays: {
        screen: paramsToProps(OpeningDays),
    },
},
{
    navigationOptions: () => ({
        headerTitleStyle: {
            fontWeight: 'normal',
        },
    }),
});

export default class RootNavigator extends React.Component {
  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return <RootStackNavigator />;
  }

  _handleNotification = ({ origin, data }) => {
    console.log(
      `Push notification ${origin} with data: ${JSON.stringify(data)}`
    );
  };
}

AppRegistry.registerComponent('RootStackNavigator', () => RootStackNavigator);
