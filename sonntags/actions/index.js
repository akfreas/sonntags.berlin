import firebase from 'firebase';
import messaging from 'firebase';
import FCM from 'react-native-fcm';
import { Platform } from 'react-native';
import { createClient } from 'contentful';

const firebaseConfig = {
  apiKey: "AIzaSyBoJyMTSdPABBhKFNHhhWUzoYvYYZLBoZU",
  authDomain: "sonntags-c927b.firebaseapp.com",
  databaseURL: "https://sonntags-c927b.firebaseio.com/",
  storageBucket: "",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
debugger;

/*
const FCM = firebase.messaging();
    FCM.requestPermissions();
firebase.auth.onAuthStateChanged((user: any) => {
  if (user) {
    this.topic = `/topics/${user.uid}`;
    FCM.subscribeToTopic(this.topic);
  } else if (this.topic) {
    // If the user is logged-out, we unsubscribe
     FCM.unsubscribeFromTopic(this.topic);
  }
});
*/
const contentfulClient = createClient({
    space: '2dktdnk1iv2v',
    accessToken: '0c4c38965da326004aee2e05781bdea695d50429eb7a7222003399cfb2035d06'
})

function loadLocations(category) {

    return contentfulClient.getEntries(
        {
            'content_type': 'location', 
            'fields.category': category
        }).then((response) => {
        return response.items.map((location) => {
            let fields = location.fields;
            return fields;
        })
    })
}

function loadOpenSundays() {
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
    loadOpenSundays
}
