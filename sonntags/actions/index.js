const Parse = require('parse/react-native');
Parse.initialize('sonntags');
Parse.serverURL = 'http://akfmbp.local:1337/parse'

const Location = Parse.Object.extend('Location');

function loadLocations() {
    var query = new Parse.Query(Location);

    return query.find();
}

module.exports = {
    loadLocations: loadLocations
}
