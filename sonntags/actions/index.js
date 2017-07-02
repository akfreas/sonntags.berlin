import firebase from 'firebase';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyBoJyMTSdPABBhKFNHhhWUzoYvYYZLBoZU",
  authDomain: "sonntags-c927b.firebaseapp.com",
  databaseURL: "https://sonntags-c927b.firebaseio.com/",
  storageBucket: "",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);



function loadLocations(callback) {
    var ref = firebase.database().ref('locations')

    var options = {
        headers: {
            'Cache-Control': 'no-cache'
        }
    };
   
    return fetch('https://s3.amazonaws.com/sonntags/extracted.json', options).then((response) => response.json())

}

module.exports = {
    loadLocations: loadLocations
}
