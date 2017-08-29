import {
    Linking
} from 'react-native';

function pad(num, size){ return ('000000' + num).substr(-size); }

function openExternalApp(url) {
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    } else {
      console.log('Don\'t know how to open URI: ' + url);
    }
  });
}

module.exports = {
    pad: pad,
    openExternalApp: openExternalApp
}
