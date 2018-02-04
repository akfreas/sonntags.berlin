import firebase from 'firebase';
import messaging from 'firebase';
import { 
    Platform,
    AsyncStorage
} from 'react-native';
const { createClient } = require('contentful/dist/contentful.browser.min.js');

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
import { 
    pad,
    create_i18n,
} from '../utilities';

var I18n = create_i18n();

const firebaseApp = firebase.initializeApp(firebaseConfig);
import moment from 'moment';
import Analytics from 'react-native-firebase-analytics';
import * as StoreReview from 'react-native-store-review';
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

function markLaunch() {
    getLaunchCount().then((count) => {
        let newCount = 1;
        if (count) {
            newCount = Number(count) + 1;
        }
        AsyncStorage.setItem('@Sonntags:launchCount', newCount.toString());
    });
}

function getLaunchCount() {
    return AsyncStorage.getItem('@Sonntags:launchCount');
}

function shouldShowReview(callback) {
    getLaunchCount().then((count) => {

        if (Number(count) == 2 || Number(count) == 10) {
            wasReviewPromptShown().then((show) => {
                callback(show == false);
            });
        } else {
            callback(false);
        }
    });
}

function markReviewPromptAsShown() {
    AsyncStorage.setItem('@Sonntags:reviewPromptShown', 'yes');
}

function wasReviewPromptShown() {
    return AsyncStorage.getItem('@Sonntags:reviewPromptShown').then((shown) => {
        if (shown) {
            return shown == 'yes';
        } else {
            return false;
        }
    });
}

function showReviewIfNeeded() {
    // This API is only available on iOS 10.3 or later
    shouldShowReview((shouldShow) => {
        if (shouldShow && StoreReview.isAvailable ) {
          StoreReview.requestReview();
           markReviewPromptAsShown(); 
        }
    });
}

function getLocale() {
    var locale = I18n.currentLocale().split('-');

    if (locale.length > 0) {
        locale = locale[0];
    } else {
        locale = "en";
    }
    return locale;
}

function loadCategories() {
    var locale = getLocale();
    return contentfulClient.getEntries({'sys.id': '1H0SeRVFLCCUGyOCmQYYKE', 'locale': locale}).then((entries) => {
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
        });
    };
}

function loadLocations(category, boundingBox) {

    let queryDict = {content_type: 'location'}
    if (category) {
        queryDict['fields.categoryRef.sys.id'] = category.id;
        Analytics.logEvent('load_category', {'category_name': category.name});
    } 
    queryDict['locale'] = getLocale();
    if (boundingBox) {
        var bb = boundingBox;
        queryDict['fields.location[within]'] = bb[0][1] + ',' + bb[0][0] + ',' + bb[1][1] + ',' + bb[1][0];
    }
    return contentfulClient.getEntries(queryDict).then((response) => {
        return response.items.map((location) => {
            let fields = location.fields;
            fields.id = location.sys.id;
            fields.iconName = location.fields.categoryRef.fields.iconName;
            fields.localizedCategory = location.fields.categoryRef.fields.name;

            fields.openingHoursString = formatHourString(fields);
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

function formatHourString(location) {

    let closingTimeString = pad(location.closingTime, 4);
    let openingTimeString = pad(location.openingTime, 4);
    let closingTime = moment(closingTimeString, "HHmm").format("HH:mm");
    let openingTime = moment(openingTimeString, "HHmm").format("HH:mm");
    let timeString = I18n.t('open_sundays') + openingTime + " - " +  closingTime;
        
    return timeString; 
}

function loadOpenSundays() {

    Analytics.logEvent('load_open_sundays');
    return contentfulClient.getEntries({
        'content_type': 'sundayOpenings',
        'fields.date[gte]': new Date(),
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
    formatHourString,
    markLaunch,
    shouldShowReview,
    showReviewIfNeeded,
}
