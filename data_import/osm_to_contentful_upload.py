import json
import argparse
from contentful_utils import ContentfulImporter


def publish_osm_data(osm_json, category, target_category):
    field_array = []

    importer = ContentfulImporter()

    for location in locations.get(category):

        if location.get('sunday') is None:
            continue
        phone = location.get('contact:phone', '') or location.get('phone')

        fields = {
                'name': location.get('name'),
                'openingTime': int(location['sunday']['open']),
                'closingTime': int(location['sunday']['close']),
                'phoneNumber': phone,
                'websiteUrl': location.get('website', ''),
        }
        osm_id = str(int(location.get('osm_id')))
        lat_lon = location['geometry']['coordinates']
        fields['location'] = {'lat': lat_lon[1], 'lon': lat_lon[0]}

        if None in fields.values():
            print("fields have a none value: " + json.dumps(fields))
            continue

        house_number = location.get('addr:housenumber')
        street = location.get('addr:street')
        city = location.get('addr:city')
        post_code = location.get('addr:postcode')

        if None not in [house_number, street, city]:
            fields['address'] = " ".join([street, house_number, post_code, city])

        importer.import_location(target_category, fields, 'openstreetmap', osm_id)
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

 
