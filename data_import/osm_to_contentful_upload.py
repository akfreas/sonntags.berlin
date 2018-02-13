import json
import argparse
from contentful_utils import ContentfulImporter
from shapely.geometry import Point, Polygon

def publish_osm_data(osm_json, category, target_category):
    field_array = []

    importer = ContentfulImporter(
        space_id='2dktdnk1iv2v', 
        access_token='8559f3884f60fdd6f3a07de91411be8be4bd74478b8ad326e671399b7a486162',
        publish_token='CFPAT-232539b20e313d9db3dc4cf8a226052b48af6fdaaaabdf395624726e370ebfef'
    )

    for location in locations.get(category).values():
        name = location.get('name')
        sunday = location.get('sunday')
        if sunday is None or name is None:
            continue
        phone = location.get('contact:phone', '') or location.get('phone')

        fields = {
                'name': name,
                'openingTime': int(sunday['open']),
                'closingTime': int(sunday['close']),
                'phoneNumber': phone,
                'websiteUrl': location.get('website', ''),
        }
        osm_id = location.get('osm_id')
        geo = location['geometry']

        try:
            points = Point(geo)
        except TypeError:
            points = Polygon(geo[0])

        inner = points.representative_point()
        lat, lon = inner.y, inner.x
        fields['location'] = {'lat': lat, 'lon': lon}

        fields = {key: fields[key] for key in fields.keys() if fields.get(key) is not None}

        house_number = location.get('addr:housenumber', '')
        street = location.get('addr:street', '')
        city = location.get('addr:city', '')
        post_code = location.get('addr:postcode', '')

        if None not in [house_number, street, city]:
            fields['address'] = " ".join([street, house_number, post_code, city])

        importer.import_location(target_category, fields, 'openstreetmap', osm_id, publish=True)
        field_array.append(fields)

if __name__ == '__main__':

    parser = argparse.ArgumentParser(description='Publish OSM JSON to Contentful')
    parser.add_argument('-f','--osm_file', help='OSM JSON file', required=True)
    parser.add_argument('-c','--category', help='OSM Category to publish', required=True)
    parser.add_argument('-t','--target_category', help='Contentful category to publish to', required=True)


    args = parser.parse_args()

    with open(args.osm_file) as listings:
        locations = json.load(listings)


    publish_osm_data(locations, args.category, args.target_category)

 
