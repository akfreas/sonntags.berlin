import json
import ipdb
import requests

json_file = open('./rewe-to-go.json')




locations = json.load(json_file)
sundays_open = [loc for loc in locations if loc['city'] == 'Berlin' and 'So' in loc['openingsHours'][0]['weekDays'].split(' ')]


headers = {
        'Authorization': 'Bearer CFPAT-232539b20e313d9db3dc4cf8a226052b48af6fdaaaabdf395624726e370ebfef',
        'X-Contentful-Content-Type': 'location'
}
space_id = '2dktdnk1iv2v'
category_id = '4nHu7CLWSQOo4A2kwY48Am'
for location in sundays_open:
    street_name = ''.join([i for i in location['street'].encode('utf-8') if not i.isdigit()])
    name = 'REWE To Go {}'.format(street_name)
    fields = {
            'name': name,
            'address': " ".join([location['street'],location['zipCode'], location['city']]),
            'openingTime': location['openingsHours'][0]['from']*100,
            'closingTime': location['openingsHours'][0]['to']*100,
            'phoneNumber': location['phone'],
            'category': 'grocery',
            'categoryRef': {'sys': {'id': category_id, 'linkType': 'Entry', 'type': 'Link'}}
    }

    lat_lon = location.get('location')
    if lat_lon is None:
        fields['location'] = fields['address']
    else:
        fields['location'] = {'lat': lat_lon['lat'], 'lon': lat_lon['lng']}

    formatted_fields = {'fields': {key: {"en-US": fields[key]} for key in fields}}
    space_url = 'https://api.contentful.com/spaces/{}/entries'.format(space_id)
    request = requests.post(space_url, 
            headers=headers, 
            json=formatted_fields
    )

    response = request.json()
    if request.status_code < 300:
        print 'created location {} successfully: id {}'.format(fields['address'].encode('utf-8'), response['sys']['id'])
    else:
        print 'failed to create with fields {}, got back {}'.format(fields, response)


