import React, {Component} from 'react';
import { StatusBar } from 'react-native';
import NavigationBar from 'react-native-navbar';
import LocationListItem from '../components/LocationListItem.js';
import {
    FlatList,
    Image,
    Dimensions,
    Text,
    View,
    StyleSheet,
} from 'react-native';

import { distanceFromUserLocation } from '../actions';

var styles = StyleSheet.create({
    locationListItem: {
        padding: 10.0,
        height: 95.0,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff'//rgba(255,255,255,1)
    },
    locationListItemDistanceContainer: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'purple',
    },
    locationListItemTitleContainer: {
        flex: 1.0,
        alignItems: 'flex-start',
    },
    locationListItemDescriptionText: {
    },
    locationListItemTitleText: {
        color: 'black',
        fontWeight: 'bold',
        height: 25.0,
    },

    locationListItemSeparator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgb(233, 238, 255)',
    }
})

export default class LocationListView extends Component {
    renderSeparator() {
        return (<View style={styles.locationListItemSeparator}/>)
    }

    rightButtonConfig() {
        return {
            title: 'Close',
            handler: this.props.onCloseButtonTapped.bind(this),
          style: [{
          }],
        }
    }
    titleConfig() {
      return {
        title: this.props.category.name,
          style: {
              color: '#3BB9BD',
              fontFamily: 'Lato-Bold',
          },
      }
    }

    renderRow(location) {
        return (
            <LocationListItem
                location={location}
                userLocation={this.props.userLocation}
                distanceFromUser={distanceFromUserLocation(location, this.props.userLocation)}
                onLocationSelected={this.props.onLocationSelected.bind(this)}
            />
        )
    }

    render() {
        let width = Dimensions.get('window').width
        let height = Dimensions.get('window').height
 
        return(
            <View style={{flex: 1}}>
             <StatusBar barStyle = "dark-content" hidden = {false}/>
                <NavigationBar
                    rightButton={this.rightButtonConfig()}
                    title={this.titleConfig()}
                />
                <View style={{flex: 1, backgroundColor: '#C2FDFF'}}>
                    <View>
                        <Image style={{
                            height: width, 
                            width: width, 
                            position: 'absolute', 
                            bottom: -height,
                            left: 0,
                        }} source={require('../../assets/images/icon_background.png')}/>
                        </View>
                     <FlatList
                        ItemSeparatorComponent={({highlighted}) => (
                            <View style={[styles.locationListItemSeparator, highlighted && {marginLeft: 0}]} />
                       )}
                       contentContainerStyle={{justifyContent: 'center', backgroundColor: 'white'}}
                        style={{backgroundColor: 'transparent', flex: 1}}
                        data={this.props.locations}
                        bounces={true}
                        extraData={this.props.locations}
                        renderItem={({item}) => this.renderRow(item)}
                        keyExtractor={item => item.id}
                    />
                </View>
            </View>
        )
    }
}
