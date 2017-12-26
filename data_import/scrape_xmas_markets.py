import mechanize
from ipdb import set_trace as bp
import re
from bs4 import BeautifulSoup
import os.path
from os import listdir
import json
from datetime import datetime 
from contentful_utils import ContentfulImporter
import requests
import geocoder


browser = mechanize.Browser()


def fetch_page_urls():

    browser.open("https://www.weihnachteninberlin.de/weihnachtsmaerkte/bezirke/")
    matching_links = [link for link in browser.links() if "rkte in" in unicode(link.text) ]


    page_regex = re.compile('.*(weihnachtsmaerkte)/.*([0-9]{1,7}\-[0-9]{1,7}).*')

    target_page_urls = []

    for link in matching_links:
        list_page = browser.open(link.absolute_url)

        for target_link in browser.links():
            match = page_regex.match(target_link.absolute_url)
            if match is None:
                continue
            
            target_page_urls.append(target_link.absolute_url)

    target_page_urls = list(set(target_page_urls))
    return target_page_urls


"""
pagelist_filename = "links.txt"

if os.path.exists(pagelist_filename):

    with open(pagelist_filename) as f:
        target_page_urls = f.readlines()
else:
    target_page_urls = fetch_page_urls()
    with open(pagelist_filename, 'w') as f:
        f.writelines(map(lambda x:x+'\n', target_page_urls))
"""

def extract_json_from_pages():
    target_page_urls = listdir('./pages')

    extracted_json = []

    for target_link in target_page_urls:

        with open('./pages/' + target_link) as market_page: 
            soup = BeautifulSoup(market_page, 'html.parser')
            
        page_json = soup.find_all('script', type='application/ld+json')

        if len(page_json) != 1:
            print 'Did not find LDJSON in {}'.format(target_link)
            continue

        json_string = page_json[0].text.replace('\r', '').replace('\n', '').encode('utf-8')
        try:
            json_dict = json.loads(json_string)
            json_dict['id'] = target_link.replace('.html', '')
            extracted_json.append(json_dict)
            print "Successfully parsed LDJSON from {}".format(target_link)
        except:
            print "Did not parse LDJSON from {}".format(target_link)



    with open('extracted.json', 'w+') as extracted_json_file:
        json.dump(extracted_json, extracted_json_file)



    """
        matching_content = [dx for dx in soup.find_all('div') if dx.get('class') is not None and 'mod_contentteaser floatbox' in " ".join(dx['class'])]
        sundays_open = [dx for dx in matching_content if \
                'Sonntag' in dx.text \
                or 'nungszeiten' in dx.text]
        print "matching content count: " + str(len(matching_content))
        #print matching_content
        #bp()
        with open('markt_dump.html', 'a') as f:
            write = map(lambda x:x.prettify().encode('UTF-8')+'\n', matching_content)
            f.writelines(write)

        try:
            print matching_content[0].div.h3.text

            time_info = [div for div in matching_content if "Wann:" in div.text][0].div.h3 or None
            print time_info
            address_info = [div for div in matching_content if "Wo:" in div.text][0].div.p or None
            print address_info
        except:
            pass
        continue

        for content in matching_content:

            try:
                print content.div.h3.text
            except:
                pass

    """
strptime = datetime.strptime
now = datetime.now
importer = ContentfulImporter(
    space_id='2dktdnk1iv2v', 
    access_token='8559f3884f60fdd6f3a07de91411be8be4bd74478b8ad326e671399b7a486162',
    publish_token='CFPAT-232539b20e313d9db3dc4cf8a226052b48af6fdaaaabdf395624726e370ebfef'
)

with open('extracted.json') as extracted:
    extracted = json.load(extracted)
    for market in extracted:
        start_date = strptime(market['startDate'], '%Y-%m-%dT%H:%M')
        end_date = strptime(market['endDate'], '%Y-%m-%dT%H:%M')
        
        current = strptime('2017-12-24T01:00', )

        if current < end_date and current > start_date:
            loc = market['location']['address']
            address = "{} {} {}".format(
                    loc['streetAddress'].encode('utf-8'), 
                    loc['addressLocality'], 
                    loc['postalCode']
            )
            fields = {
                    'name': market['name'],
                    'startDate': market['startDate'].split('T')[0],
                    'endDate': market['endDate'].split('T')[0],
                    'websiteUrl': market['url'],
                    'openingTime': 1200,
                    'closingTime': int("{0:02d}{1:02d}".format(end_date.hour, end_date.minute)),
                    'address': address,
            }
            
            print "Geocoding..."
            geocoded = requests.get('https://maps.googleapis.com/maps/api/geocode/json?address={}&key={}'.format(
                address,
                'AIzaSyAqZMGVENgm5k2RDtfmZ9EoDSatJr46nMA'))
            if geocoded.status_code == 200 and geocoded.json()['status'] == 'OK':
                geo = geocoded.json()['results'][0]['geometry']['location']
                fields['location'] = {'lat': float(geo['lat']), 'lon': float(geo['lng'])}
            else:
                print "Could not geocode: {}".format(geocoded.json()['status'])
                bp()
            print "Importing to contentful..."
            importer.import_location('christmas_markets', fields, 'berlin_weihnachtsmarkt', market['id'])
            print "Successfully imported {}".format(market['name'].encode('utf-8'))



        elif current < end_date:
            print "{} will be on {}".format(market['name'].encode('utf-8'), market['endDate'].encode('utf-8'))
        else:
            continue
            print "{} is not currently on.".format(market['name'].encode('utf-8'))

