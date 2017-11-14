import {
    Linking
} from 'react-native';
import Analytics from 'react-native-firebase-analytics';


import I18n from 'react-native-i18n';

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

function create_i18n() {

    I18n.fallbacks = true;
    I18n.translations = {
        en: {
            distance: 'km away',
            open_sundays: 'Open Sundays, ',
            add_business: 'Add Business',
            about: 'About',
            give_feedback: 'Feedback',
            share: 'Share',
            share_message: 'Find shops open on Sundays with the Sonntags app!',
            share_subject: 'Check it out!',
            opening_days_bold: 'Most stores aren\'t open on Sunday.',
            opening_days_text: 'The city of Berlin allows for some exceptions. On these Sundays, many stores will be open for business.  Each opening day takes place during another city-wide event, listed below.',
            more_info: 'More info at http://bit.ly/sonntags-berlin',
            special_opening_days_title: 'Special Opening Days',
        },
        de: {
            distance: 'km entfernt',
            open_sundays: 'Sonntags geöffnet, ',
            add_business: 'Geschäft Hinzufügen',
            give_feedback: 'Feedback Teilen',
            about: 'Info',
            share: 'Sonntags Teilen',
            share_message: 'Finde Geschäfte, die am Sonntags geöffnet sind!',
            share_subject: 'Guck mal hin!',
            opening_days_bold: 'Sonntag is doch kein Offentag.',
            opening_days_text: 'Ausser diese Tage, die in Berlin eine besondere Veranstaltung stattfindet. Am deisen Sonntags kann mann in viele Läden kaufen gehen.',
            more_info: 'Mehr Infos: http://bit.ly/sonntags-berlin',
            special_opening_days_title: 'Sonderöffnungen',
        }
    };
    return I18n;
}

module.exports = {
    pad: pad,
    openExternalApp: openExternalApp,
    create_i18n: create_i18n,
}
