import json
from contentful_utils import ContentfulImporter


with open('./formatted_listings_with_hours.json') as listings:
    locations = json.load(listings)

field_array = []

importer = ContentfulImporter()
category = 'greengrocer'
for location in locations.get(category):

    if location.get('sunday') is None:
        continue

    fields = {
            'name': location.get('name'),
            'openingTime': int(location['sunday']['open']),
            'closingTime': int(location['sunday']['close']),
            'phoneNumber': location.get('contact:phone', ''),
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

    importer.import_location('grocery', fields, 'openstreetmap', osm_id)
    field_array.append(fields)

