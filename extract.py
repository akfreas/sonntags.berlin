import json
import requests

data = json.load(open('data.json'))['data']

extracted_data = []

headers = {
        'X-Parse-Application-Id': 'sonntags',
        'Content-Type': 'application/json',
        }

for place in data:

    item = {
            'name': place.get('name'),
            'openingHoursText': place.get('openingHours'),
            'phone': place.get('phone'),
            'location': place.get('location'),
            }

    response = requests.post('http://localhost:1337/parse/classes/Location', json=item, headers=headers)

    extracted_data.append(item)

extracted = json.dump(item, open('extracted.json', 'w'))
