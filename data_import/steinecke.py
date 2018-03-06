from bs4 import BeautifulSoup
import requests
import os
from contentful_utils import ContentfulImporter
import geocoder
import urllib


def fetch_matching_filiale():
    for i in range(60, 10000):
        url = 'https://www.steinecke.info/popup_filialen.php?id={}'.format(i)
        print('fetching url: ', url)
        response = requests.get(url)
        if "Sonntag:" in response.text:
            print('Found Sonntag in id ', i)
            with open('steinecke_filialen/{}.html'.format(i), 'w') as filiale:
                filiale.write(response.text.encode('utf-8'))

importer = ContentfulImporter(
    space_id='2dktdnk1iv2v', 
    access_token='8559f3884f60fdd6f3a07de91411be8be4bd74478b8ad326e671399b7a486162',
    publish_token='CFPAT-232539b20e313d9db3dc4cf8a226052b48af6fdaaaabdf395624726e370ebfef'
)
import codecs

def get_element(soup, key):
    div = soup.find('div', key)
    if div is None:
        return ''
    return div.text if div.text is not None else '' 

for html in os.listdir('.'):
    if os.path.isfile(html) == False:
        continue
    with codecs.open(html, encoding='utf-8') as html_doc:
        soup = BeautifulSoup(html_doc, 'html.parser')
    address = u'{}, {}'.format(
            get_element(soup, 'filialenErgebnisEintragStrasse'), \
            get_element(soup, 'filialenErgebnisEintragOrt'), \
    )

    tel = get_element(soup, 'filialenErgebnisEintragTelefon')
    hours_string = [hours.text.replace(' UhrSonntag:', '') for hours in soup.find_all('div', 'filialenOeffnungszeit') if 'Sonntag:' in hours.text][0]
    hours_formatted = map(lambda x: x.replace(':', ''), hours_string.split('-'))
    hours_from = hours_formatted[0]
    hours_to = hours_formatted[1].split(',')[:1][0]
    fields = {
            'name': 'Steinecke',
            'address': address,
            'openingTime': int(hours_from),
            'closingTime': int(hours_to),
            'phoneNumber': tel,
    }
    print "Geocoding..."
    encoded_url = 'https://maps.googleapis.com/maps/api/geocode/json?' + urllib.urlencode({'address': address.encode('utf-8'), 'key': 'AIzaSyAqZMGVENgm5k2RDtfmZ9EoDSatJr46nMA'})
    geocoded = requests.get(encoded_url)
    if geocoded.status_code == 200 and geocoded.json()['status'] == 'OK':
        geo = geocoded.json()['results'][0]['geometry']['location']
        fields['location'] = {'lat': float(geo['lat']), 'lon': float(geo['lng'])}
    else:
        print "Could not geocode: {}".format(geocoded.json()['status'])
        continue

    try:
        importer.import_location('bakery', fields, 'steinecke_html', html.split('.')[0], publish=True)
        os.rename(html, './published/' + html)
    except:
        continue


