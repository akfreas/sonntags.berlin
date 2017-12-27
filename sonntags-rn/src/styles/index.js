const React = require('react-native')
const constants = {
  actionColor: '#24CE84'
};

import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ListView
} from 'react-native';

var styles = StyleSheet.create({
    headerTitleStyle: {
        color: 'white',
        fontFamily: 'lato-bold',
        fontSize: 20

    },
    categoryTable: {

        backgroundColor: '#fff',
    },
    categoryListItemDivider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgb(233, 238, 255)',
    }, 
    locationGridList: {
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    locationGridItem: {
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 1,
        height: 65,
    },
    locationGridIcon: {
        padding: 0,

    },
    locationGridIconContainer: {
        flex: 0.25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationGridTextContainer: {
        flex: 1.0,
        justifyContent: 'center',
        alignItems: 'flex-start',
    }, 
    locationGridText: {
        textAlign: 'center',
        marginLeft: 10,
        marginRight: 10,
        fontFamily: 'Lato-Bold',
        fontSize: 20
    },
    locationList: {
        justifyContent: 'center',
    },
    locationListItem: {
        padding: 10.0,
        height: 90.0,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    locationListItemDistanceContainer: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    locationListItemTitleContainer: {
        flex: 1.0,
        //justifyContent: 'start',
        alignItems: 'flex-start',
    },
    locationListItemDescriptionText: {
        fontFamily: 'Lato-Regular',
    },
    locationListItemDistanceText: {
        fontFamily: 'lato-italic',
    },
    locationListItemTitleText: {

        fontFamily: 'Lato-Bold',
        fontSize: 18
    }
})

module.exports = styles
module.exports.constants = constants;
