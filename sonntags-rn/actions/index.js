import firebase from 'firebase';
import messaging from 'firebase';
import { Platform } from 'react-native';
import { createClient } from 'contentful';

const firebaseConfig = {
  apiKey: "AIzaSyBoJyMTSdPABBhKFNHhhWUzoYvYYZLBoZU",
  authDomain: "sonntags-c927b.firebaseapp.com",
  databaseURL: "https://sonntags-c927b.firebaseio.com/",
  storageBucket: "",
};

import {
    DRAWER_OPEN,
    DRAWER_CLOSE,
    TOGGLE_DRAWER,
    SET_DRAWER_GESTURES_ENABLED,
} from '../constants/ActionTypes';

const firebaseApp = firebase.initializeApp(firebaseConfig);
import Analytics from 'react-native-firebase-analytics';
const contentfulClient = createClient({
    space: '2dktdnk1iv2v',
    accessToken: '0c4c38965da326004aee2e05781bdea695d50429eb7a7222003399cfb2035d06'
})


function toggleDrawer() {
    return {
        type: TOGGLE_DRAWER
    };
}

function openDrawer() {
    return {
        type: DRAWER_OPEN
    };
}

function closeDrawer() {
    return {
        type: TOGGLE_DRAWER
    };
}

function loadCategories() {
    return contentfulClient.getEntries({'sys.id': '1H0SeRVFLCCUGyOCmQYYKE'}).then((entries) => {
            return entries.items[0].fields.list.map((category) => {
                let fields = category.fields;
                fields.id = category.sys.id;
                return fields;
            });

    }, (error) => {
    });
        /* 
    getEntries(
        { 'content_type': 'category' }).then((response)=> {
    });
    */
}

function getUserLocation(dispatch) {
    return (dispatch) => {
        console.log("getting location");
        navigator.geolocation.getCurrentPosition((position) => {
            console.log("position: " + position.latitude);
            dispatch({
                type: 'SET_LOCATION',
                userLocation: position
            });
        }, (error) => {
            console.log(error);
        },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      );
    };
}

function loadLocations(category) {

    let queryDict = {content_type: 'location'}
    if (category) {
        queryDict['fields.categoryRef.sys.id'] = category.id;
        Analytics.logEvent('load_category', {'category_name': category.name});
    } 
    return contentfulClient.getEntries(queryDict).then((response) => {
        return response.items.map((location) => {
            let fields = location.fields;
            fields.id = location.sys.id;
            return fields;
        }, (error)=> {
            console.log(error);
        })
    })
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}



function distanceFromUserLocation(location, userLocation) {

        if (userLocation == undefined || userLocation.coords == undefined) {
            return null
        }

        let distance = getDistanceFromLatLonInKm(
            userLocation.coords.latitude,
            userLocation.coords.longitude,
            location.location.lat,
            location.location.lon)
        return distance
}

function loadOpenSundays() {

    Analytics.logEvent('load_open_sundays');
    return contentfulClient.getEntries({
        'content_type': 'sundayOpenings',
        // 'field.date[gte]': new Date()
    }).then((response) => {
        return response.items.map((day) => {
            let fields = day.fields;
            return fields;
        });
    })
}

function setDrawerGesturesEnabled(enabled) {
    return {
        type: SET_DRAWER_GESTURES_ENABLED,
        drawerGesturesEnabled: enabled
    }
}

module.exports = {
    loadLocations,
    loadOpenSundays,
    loadCategories,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    getUserLocation,
    setDrawerGesturesEnabled,
    distanceFromUserLocation,
}
