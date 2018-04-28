import psycopg2
import json
import re
from contentful_utils import ContentfulImporter
from shapely.geometry import Point, Polygon


conn = psycopg2.connect("dbname=berlin-latest.osm.pbf user=postgres")
cur = conn.cursor()
cat_map = {
        'garden_centre': 'Home & Garden',
        'bakery': 'bakery',
        'kiosk': 'kiosk',
        'dry_cleaning': 'laundry',
        'laundry': 'laundry',
        'deli': 'grocery',
        'convenience': 'kiosk',
	'garden_centre': 'home_and_garden',
        'bicycle': 'bike_shop',
	'pastry': 'bakery',
        'supermarket': 'grocery'
}
category_list = ', '.join('\'%s\'' % t for t in cat_map.keys())
query = "select osm_id, name, st_asgeojson, opening_hours, shop, \
        \"addr:city\", \"addr:postcode\", \"addr:street\", \"addr:housenumber\" \
        from sunday_open where shop in ({})".format(category_list)

query = "select osm_id, name, website, \"contact:phone\", \"contact:website\", \
        opening_hours, shop, \"addr:city\", \"addr:postcode\", \"addr:street\",  \
        \"addr:housenumber\",  ST_AsGeoJSON(way) as geojson_way from sunday_open \
        where shop in ({})".format(category_list)


print(query)
cur.execute(query)



def extract_hours(hours_string):
    hour_search = re.compile('Su(.*PH)? ([0-9]{1,2}:[0-9]{2})-([0-9]{1,2}:[0-9]{2})')

    matches = hour_search.findall(hours_string)

    if len(matches) > 0:
        hours_match = matches[0]
        hours_dict = {
            'open': hours_match[1].replace(':', ''),
            'close': hours_match[2].replace(':', '')
        }
        return hours_dict


importer = ContentfulImporter(
    space_id='2dktdnk1iv2v',
    access_token='8559f3884f60fdd6f3a07de91411be8be4bd74478b8ad326e671399b7a486162',
    publish_token='CFPAT-232539b20e313d9db3dc4cf8a226052b48af6fdaaaabdf395624726e370ebfef'
)


for point in cur:

    osm_id, name, website, phone, website, opening_hours, shop, \
            city, post_code, street, house_number, geojson = point


    target_category = cat_map[shop]
    sunday = extract_hours(opening_hours)
    if None in [sunday, name]:
        continue
    fields = {
            'name': name,
            'openingTime': int(sunday['open']),
            'closingTime': int(sunday['close']),
            'phoneNumber': phone or '',
            'websiteUrl': website or '',
    }

    geo = json.loads(geojson).get('coordinates')
    try:
        points = Point(geo)
    except TypeError:
        points = Polygon(geo[0])

    inner = points.representative_point()
    lat, lon = inner.y, inner.x
    fields['location'] = {'lat': lat, 'lon': lon}

    addr_components = [street, house_number, post_code, city]
    if None not in addr_components:
        fields['address'] = " ".join(addr_components)

    try:
        importer.import_location(target_category, fields, 'openstreetmap', osm_id, publish=True)
    except: 
        continue
