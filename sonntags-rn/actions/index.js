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

function loadLocations(category) {

    let categoryId = category.id;
    Analytics.logEvent('load_category', {'category_name': category.name});
    return contentfulClient.getEntries(
        {
            'content_type': 'location', 
            'fields.categoryRef.sys.id': categoryId
        }).then((response) => {
        return response.items.map((location) => {
            let fields = location.fields;
            fields.id = location.sys.id;
            return fields;
        }, (error)=> {
            console.log(error);
        })
    })
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

module.exports = {
    loadLocations,
    loadOpenSundays,
    loadCategories,
    openDrawer,
    closeDrawer,
    toggleDrawer,
}
