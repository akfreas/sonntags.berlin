import React from 'react';

import {
  Image,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ListView
} from 'react-native';

var styles = require('../assets/styles');


import { MonoText } from '../components/StyledText';

import LocationListItem from '../components/LocationListItem';
import LocationTypeGrid from '../components/LocationTypeGrid';
import {
    loadLocations
} from '../actions';

var styles2 = require('../assets/styles');

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

    constructor(props) {
        super(props);
        this.state = {
            locations: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        }
    }

    componentWillMount() {
        loadLocations().then((locations) => {
            let ds = this.state.locations.cloneWithRows(locations);
            this.setState({
                locations: ds
            })
        })
    }

  render() {

    return (

      <View style={styles.container}>
          <LocationTypeGrid />
      </View>
    );
  }
}

